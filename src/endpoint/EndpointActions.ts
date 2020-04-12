import { createAsyncAction } from "typesafe-actions";

import { RequestMethod, AsyncMethodActions, EndpointApiFunction, AsyncOrchestrator } from './';

// TODO: Migrate from typesafe-actions to a new AsyncMethodActions structure
// Accept an AyncOrchestrator and have the EndpointSlice execute the binding

export class EndpointMethodFactory<RequestPayload = undefined, ResponsePayload = undefined, ErrorPayload = undefined, MethodProps = undefined> {
  public readonly apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>;
  public readonly asyncOrchestrator: AsyncOrchestrator | undefined;

  constructor(apiFunction: EndpointApiFunction<RequestPayload, ResponsePayload, MethodProps>, asyncOrchestrator?: AsyncOrchestrator) {
    this.apiFunction = apiFunction;
    this.asyncOrchestrator = asyncOrchestrator;
  }

  public GetActions(sliceName: string, method: RequestMethod): AsyncMethodActions<RequestPayload, ResponsePayload, ErrorPayload, MethodProps> {
    return createAsyncAction(`${method}/${sliceName}/Request`, `${method}/${sliceName}/Success`, `${method}/${sliceName}/Failure`)<
    [RequestPayload, MethodProps],
    [ResponsePayload, MethodProps],
    [ErrorPayload, MethodProps]
    >();
  };
}
