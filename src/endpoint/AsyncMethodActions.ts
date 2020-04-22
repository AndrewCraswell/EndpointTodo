
import { ActionCreatorWithPreparedPayload } from "@reduxjs/toolkit";

import { IAsyncOrchestrationResultMeta, IAsyncOrchestrationRequestMeta } from "./";

export type AsyncExecuteActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, IAsyncOrchestrationRequestMeta<MethodProps>>;
export type AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps> = ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>>;
export type AsyncFailureActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>>;

export type AsyncMethodActions<RequestPayload = void, ResponsePayload = void, MethodProps = void> = {
  Execute: AsyncExecuteActionCreator<RequestPayload, MethodProps>;
  Success: AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>;
  Failure: AsyncFailureActionCreator<RequestPayload, MethodProps>;
};

