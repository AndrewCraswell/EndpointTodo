
import { ActionCreatorWithPreparedPayload } from "@reduxjs/toolkit";

import { IAsyncOrchestrationProps } from "./";

export type AsyncMethodActions<RequestPayload = void, ResponsePayload = void, MethodProps = void> = {
  Execute: ActionCreatorWithPreparedPayload<[RequestPayload, MethodProps], RequestPayload, string, never, MethodProps>;
  Success: ActionCreatorWithPreparedPayload<[ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>], ResponsePayload, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
  Failure: ActionCreatorWithPreparedPayload<[Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>], Error, string, never, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
};
