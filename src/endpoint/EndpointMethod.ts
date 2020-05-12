import { createAction, nanoid } from "@reduxjs/toolkit";

import {
  RequestMethod,
  AsyncMethodActions,
  EndpointApiFunction,
  AsyncOrchestrator,
  IAsyncOrchestrationResultMeta,
  AsyncExecuteActionCreator,
  AsyncSuccessActionCreator,
  AsyncFailureActionCreator,
  AsyncClearRequestsActionCreator,
  AsyncExecutingActionCreator,
  IEndpointMethodProps,
  IAsyncOrchestrationRequestMeta
} from '.';

export type EndpointMethodMap = {
  [name: string]: IEndpointMethod
}

type UrlPreparerConfig<RequestPayload, MethodProps> = {
  baseUrl: string;
  params: RequestPayload;
  props: MethodProps;
}

type BodyPreparerConfig<RequestPayload, MethodProps> = {
  params: RequestPayload;
  props: MethodProps;
}

type UrlPreparerFunction<RequestPayload, MethodProps> = (config: UrlPreparerConfig<RequestPayload, MethodProps>) => string;
type BodyPreparerFunction<RequestPayload, MethodProps> = (config: BodyPreparerConfig<RequestPayload, MethodProps>) => any;

type EndpointMethodConfig<RequestPayload, ResponsePayload, MethodProps> = {
  method: keyof typeof RequestMethod,
  apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>,
  urlPreparer?: UrlPreparerFunction<RequestPayload, MethodProps>,
  bodyPreparer?: BodyPreparerFunction<RequestPayload, MethodProps>,
  asyncOrchestrator?: AsyncOrchestrator
}

export interface IEndpointMethod {
  Types: {
    Execute: string,
    Executing: string,
    Success: string,
    Failure: string,
    ClearRequests: string
  };
  ClearRequests: AsyncClearRequestsActionCreator;
  Orchestrate(sliceName: string, baseUrl: string, methodName?: string): void;
}

export type EndpointMethodProps<Props> = Props & IEndpointMethodProps | void;

export class EndpointMethod<RequestPayload = void, ResponsePayload = void, MethodProps = void | IEndpointMethodProps> implements IEndpointMethod {
  private _sliceName: string | undefined;
  private _actions: AsyncMethodActions<RequestPayload, ResponsePayload, MethodProps>;
  private _name: string | undefined;

  private readonly apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>;
  private readonly method: RequestMethod;
  private readonly asyncOrchestrator: AsyncOrchestrator | undefined;
  private readonly bodyPreparer: BodyPreparerFunction<RequestPayload, MethodProps> = ({ params }) => params;
  private readonly urlPreparer: UrlPreparerFunction<RequestPayload, MethodProps> = ({ baseUrl }) => baseUrl;

  // List of Action Types
  public Types: {
    Execute: string,
    Executing: string,
    Success: string,
    Failure: string,
    ClearRequests: string
  }

  // References to the underlying actions
  public Execute: AsyncExecuteActionCreator<RequestPayload, MethodProps>;
  public Executing: AsyncExecutingActionCreator<RequestPayload, MethodProps>;
  public Success: AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>;
  public Failure: AsyncFailureActionCreator<RequestPayload, MethodProps>;
  public ClearRequests: AsyncClearRequestsActionCreator;

  constructor(config: EndpointMethodConfig<RequestPayload, ResponsePayload, MethodProps>) {
    const { apiFunction, method, asyncOrchestrator, bodyPreparer, urlPreparer } = config;
    this.method = method as RequestMethod;
    this.apiFunction = apiFunction;
    this.asyncOrchestrator = asyncOrchestrator;

    if (bodyPreparer) {
      this.bodyPreparer = bodyPreparer;
    }

    if (urlPreparer) {
      this.urlPreparer = urlPreparer;
    }

    const actions = this.CreateActions();
    this.Types = this.GetActionTypes();

    this._actions = actions;

    this.Execute = actions.Execute;
    this.Executing = actions.Executing;
    this.Success = actions.Success;
    this.Failure = actions.Failure;
    this.ClearRequests = actions.ClearRequests;
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
        apiFunction: (payload: RequestPayload, props: MethodProps): ReturnType<typeof apiFunction> => {
          return apiFunction({
            url: this.urlPreparer({ baseUrl, params: payload, props }),
            method: this.method,
            payload: this.bodyPreparer({ params: payload, props }),
            props
          });
        }
      });
    }
  }

  private CreateActions() {
    this.Types = this.GetActionTypes();

    this.Execute = createAction(this.Types.Execute,
      (params: RequestPayload, props: MethodProps & IEndpointMethodProps) => ({
        payload: params,
        meta: {
          props: {
            ...props,
            id: props?.id || nanoid(),
            method: this.method
          }
        }
      }));

    this.Executing = createAction(this.Types.Executing,
      (params: RequestPayload, props: IAsyncOrchestrationRequestMeta<MethodProps>) => ({ payload: params, meta: props }));

    this.Success = createAction(this.Types.Success,
      (params: ResponsePayload, props: IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>) => ({ payload: params, meta: props }));

    this.Failure = createAction(this.Types.Failure,
      (params: Error, props: IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>) => ({ payload: params, meta: props }));

    this.ClearRequests = createAction(this.Types.ClearRequests, (id: string | string[]) => ({
      payload: id
    }));

    this._actions = {
      Execute: this.Execute,
      Executing: this.Executing,
      Success: this.Success,
      Failure: this.Failure,
      ClearRequests: this.ClearRequests
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
      Executing: `${slicePrefix}/Executing`,
      Success: `${slicePrefix}/Success`,
      Failure: `${slicePrefix}/Failure`,
      ClearRequests: `${slicePrefix}/ClearRequests`
    }
  }
}
