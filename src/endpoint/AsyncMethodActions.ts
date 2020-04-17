
import { ActionCreatorWithPreparedPayload } from "@reduxjs/toolkit";

import { IAsyncOrchestrationProps } from "./";

export type AsyncExecuteActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, MethodProps>;
export type AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps> = ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
export type AsyncFailureActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;

export type AsyncMethodActions<RequestPayload = void, ResponsePayload = void, MethodProps = void> = {
  Execute: AsyncExecuteActionCreator<RequestPayload, MethodProps>;
  Success: AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>;
  Failure: AsyncFailureActionCreator<RequestPayload, MethodProps>;
};

