
import { ActionCreatorWithPreparedPayload } from "@reduxjs/toolkit";

import { IAsyncOrchestrationMeta } from "./";

export type AsyncExecuteActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, MethodProps>;
export type AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps> = ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationMeta<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationMeta<RequestPayload, MethodProps>>;
export type AsyncFailureActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationMeta<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationMeta<RequestPayload, MethodProps>>;

export type AsyncMethodActions<RequestPayload = void, ResponsePayload = void, MethodProps = void> = {
  Execute: AsyncExecuteActionCreator<RequestPayload, MethodProps>;
  Success: AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>;
  Failure: AsyncFailureActionCreator<RequestPayload, MethodProps>;
};

