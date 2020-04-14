import { ActionCreatorBuilder } from "typesafe-actions";

import { IAsyncOrchestrationProps } from "./";

export type AsyncMethodActions<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined> = {
  request: ActionCreatorBuilder<string, RequestPayload, MethodProps>;
  success: ActionCreatorBuilder<string, ResponsePayload, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
  failure: ActionCreatorBuilder<string, Error, IAsyncOrchestrationProps<RequestPayload, MethodProps>>;
};
