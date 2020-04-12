import { ActionCreatorBuilder } from "typesafe-actions";

export type AsyncMethodActions<RequestPayload = undefined, ResponsePayload = undefined, ErrorPayload = undefined, MethodProps = undefined> = {
  request: ActionCreatorBuilder<string, RequestPayload, MethodProps>;
  success: ActionCreatorBuilder<string, ResponsePayload, MethodProps>;
  failure: ActionCreatorBuilder<string, ErrorPayload, MethodProps>;
};
