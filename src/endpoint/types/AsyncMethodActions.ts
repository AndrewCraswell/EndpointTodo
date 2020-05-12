import { ActionCreatorWithPreparedPayload } from "@reduxjs/toolkit";

import { IAsyncOrchestrationResultMeta, IAsyncOrchestrationRequestMeta, IEndpointMethodProps } from "..";

export type AsyncExecuteActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, IAsyncOrchestrationRequestMeta<MethodProps & IEndpointMethodProps>>;
export type AsyncExecutingActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[RequestPayload, IAsyncOrchestrationRequestMeta<MethodProps & IEndpointMethodProps>], RequestPayload, string, never, IAsyncOrchestrationRequestMeta<MethodProps & IEndpointMethodProps>>;
export type AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps> = ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>>;
export type AsyncFailureActionCreator<RequestPayload, MethodProps> = ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationResultMeta<RequestPayload, MethodProps>>;
export type AsyncClearRequestsActionCreator = ActionCreatorWithPreparedPayload<[string | string[]], string | string[], any, never, never>;

export type AsyncMethodActions<RequestPayload = void, ResponsePayload = void, MethodProps = void> = {
  Execute: AsyncExecuteActionCreator<RequestPayload, MethodProps>;
  Executing: AsyncExecutingActionCreator<RequestPayload, MethodProps>;
  Success: AsyncSuccessActionCreator<RequestPayload, ResponsePayload, MethodProps>;
  Failure: AsyncFailureActionCreator<RequestPayload, MethodProps>;
  ClearRequests: AsyncClearRequestsActionCreator;
};

