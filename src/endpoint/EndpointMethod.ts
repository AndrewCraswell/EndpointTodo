import { createAction, ActionCreatorWithPreparedPayload, nanoid } from "@reduxjs/toolkit";

import { RequestMethod, AsyncMethodActions, EndpointApiFunction, AsyncOrchestrator, IAsyncOrchestrationProps } from '.';
import { IEndpointMethodProps } from "./AsyncOrchestrationProps";

// TODO: Get action type names as a getter
export type EndpointMethodMap = {
  [name: string]: IEndpointMethod
}

export interface IEndpointMethod {
  Orchestrate(sliceName: string, baseUrl: string, methodName?: string): void;
}

export class EndpointMethod<RequestPayload = void, ResponsePayload = void, MethodProps = IEndpointMethodProps | void> implements IEndpointMethod {
  private _sliceName: string | undefined;
  private _actions: AsyncMethodActions<RequestPayload, ResponsePayload, MethodProps>;
  private _name: string | undefined;

  private readonly apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>;
  private readonly method: RequestMethod;
  private readonly asyncOrchestrator: AsyncOrchestrator | undefined;

  // List of Action Types
  public Types: {
    Execute: string,
    Success: string,
    Failure: string
  }

  // References to the underlying actions
  public Execute: ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, MethodProps>;
  public Success: ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
  public Failure: ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;

  constructor(
    method: keyof typeof RequestMethod,
    apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>,
    asyncOrchestrator?: AsyncOrchestrator) {

    this.method = method as RequestMethod;
    this.apiFunction = apiFunction;
    this.asyncOrchestrator = asyncOrchestrator;

    const actions = this.CreateActions();
    this.Types = this.GetActionTypes();

    this._actions = actions;
    [this.Execute, this.Success, this.Failure] = [actions.Execute, actions.Success, actions.Failure];
  }

  public Orchestrate(sliceName: string, baseUrl: string, methodName: string) {
    const apiFunction = this.apiFunction;
    this._sliceName = sliceName;
    this._name = methodName;

    this.CreateActions();

    // If the method has an async orchestrator, kick it off
    if (this.asyncOrchestrator) {
      this.asyncOrchestrator.orchestrate({
        name: `${sliceName}/${methodName}`,
        actions: this._actions,
        apiFunction: (payload: RequestPayload, props: IAsyncOrchestrationProps<RequestPayload, MethodProps>): ReturnType<typeof apiFunction> => {
          return apiFunction({
            url: baseUrl,
            method: this.method,
            payload,
            props
          });
        }
      });
    }
  }

  private CreateActions() {
    this.Types = this.GetActionTypes();

    this.Execute = createAction(this.Types.Execute,
      (params: RequestPayload, props: MethodProps & IEndpointMethodProps) => ({ payload: params, meta: { ...props, id: props?.id || nanoid() } }));

    this.Success = createAction(this.Types.Success,
      (params: ResponsePayload, props: IAsyncOrchestrationProps<RequestPayload, MethodProps>) => ({ payload: params, meta: props }));

    this.Failure = createAction(this.Types.Failure,
      (params: Error, props: IAsyncOrchestrationProps<RequestPayload, MethodProps>) => ({ payload: params, meta: props }));

    this._actions = {
      Execute: this.Execute,
      Success: this.Success,
      Failure: this.Failure
    };

    return this._actions;
  };

  private GetActionTypes() {
    let slicePrefix: string = `@Restux`;
    if (this._sliceName) {
      if (this._name) {
        slicePrefix = `${slicePrefix}/${this._sliceName}/${this._name}`;
      } else {
        slicePrefix = `${slicePrefix}/${this._name}`;
      }
    } else {
      slicePrefix = `${slicePrefix}/${this.method}`
    }

    return {
      Execute: `${slicePrefix}/Execute`,
      Success: `${slicePrefix}/Success`,
      Failure: `${slicePrefix}/Failure`
    }
  }
}
