/* tslint:disable */
import { Reducer } from "@reduxjs/toolkit";

import { IEndpointState, defaultEndpointState, EndpointMethodFactory, reducerRegistry, RequestMethod, AsyncMethodActions } from './';

// TODO: Create reductor base reducer
// TODO: Accept a asyncActionOrchestrator function to configure saga flows

export class EndpointSlice<
  State,
  GetRequestPayload = undefined, GetResponsePayload = undefined, GetErrorPayload = undefined, GetMethodProps = undefined,
  PostRequestPayload = undefined, PostResponsePayload = undefined, PostErrorPayload = undefined, PostMethodProps = undefined
  > {
  public readonly name: string;
  public readonly initialState: State & IEndpointState;
  public readonly baseUrl: string;
  private _reducer: Reducer<State & IEndpointState> | undefined;

  get reducer() {
    return this._reducer;
  }
  
  public Methods: {
    GET: AsyncMethodActions<GetRequestPayload, GetResponsePayload, GetErrorPayload, GetMethodProps>,
    POST: AsyncMethodActions<PostRequestPayload, PostResponsePayload, PostErrorPayload, PostMethodProps>
  };

  constructor(name: string, baseUrl: string, initialState: State, factories: {
    GET: EndpointMethodFactory<GetRequestPayload, GetResponsePayload, GetErrorPayload, GetMethodProps>,
    POST: EndpointMethodFactory<PostRequestPayload, PostResponsePayload, PostErrorPayload, PostMethodProps>
  }) {
    this.name = name;
    this.baseUrl = baseUrl;

    this.initialState = {
      ...defaultEndpointState,
      ...initialState
    } as State & IEndpointState

    const methodActions = {} as any;
    for (const [method, factory] of Object.entries(factories)) {
      methodActions[method] = factory.GetActions(this.name, method as RequestMethod)

      // If the method has an async orchestrator, kick it off
      if (factory.asyncOrchestrator) {
        factory.asyncOrchestrator.orchestrate({
          name: `${method}/${name}`,
          actions: methodActions[method],
          // TODO: Fix any types
          apiFunction: (payload: any, props: any): any => {
            return factory.apiFunction({
              url: this.baseUrl,
              method: method as RequestMethod,
              payload,
              props
            });
          }
        });
      }
    }
    this.Methods = methodActions;
  }

  public registerReducer(reducer: Reducer<State & IEndpointState>) {
    this._reducer = reducer;

    reducerRegistry.register(this.name, reducer);
  }
}
