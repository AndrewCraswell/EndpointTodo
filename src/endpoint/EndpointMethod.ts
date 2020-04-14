import { createAsyncAction, ActionCreatorBuilder } from "typesafe-actions";

import { RequestMethod, AsyncMethodActions, EndpointApiFunction, AsyncOrchestrator, IAsyncOrchestrationProps } from '.';

// TODO: Get action type names as a getter
// TODO: Migrate from typesafe-actions to Async

export type EndpointMethodMap = {
  [name: string]: IEndpointMethod
}

export interface IEndpointMethod {
  Orchestrate(sliceName: string, baseUrl: string, methodName?: string): void;
}

export class EndpointMethod<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined> implements IEndpointMethod {
  private _sliceName: string | undefined;
  private _actions: AsyncMethodActions<RequestPayload, ResponsePayload, MethodProps>
  private _name: string | undefined;

  private readonly apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>;
  private readonly method: RequestMethod;
  private readonly asyncOrchestrator: AsyncOrchestrator | undefined;

  // References to the underlying actions
  public Execute: ActionCreatorBuilder<string, RequestPayload, MethodProps>;
  public Success: ActionCreatorBuilder<string, ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
  public Failure: ActionCreatorBuilder<string, Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;

  constructor(
    method: keyof typeof RequestMethod,
    apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>,
    asyncOrchestrator?: AsyncOrchestrator) {

    this.method = method as RequestMethod;
    this.apiFunction = apiFunction;
    this.asyncOrchestrator = asyncOrchestrator;

    const actions = this.CreateActions();

    this._actions = actions;
    [this.Execute, this.Success, this.Failure] = [actions.request, actions.success, actions.failure];
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
    let slicePrefix: string = this.method;
    if (this._sliceName) {
      if (this._name) {
        slicePrefix = `${this._sliceName}/${this._name}`;
      } else {
        slicePrefix = `${this.method}/${this._sliceName}`;
      }
    }

    const actions = createAsyncAction(`${slicePrefix}/Execute`, `${slicePrefix}/Success`, `${slicePrefix}/Failure`)<
    [RequestPayload, MethodProps],
    [ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>],
    [Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>]
    >();

    this._actions = actions;
    [this.Execute, this.Success, this.Failure] = [actions.request, actions.success, actions.failure];

    return actions;
  };
}