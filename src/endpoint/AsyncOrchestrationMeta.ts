import { SlimRequestResponse } from ".";

export interface IEndpointMethodProps {
  id?: string,
  disableRollback?: boolean
}

export interface IAsyncOrchestrationMeta<RequestPayload = void, MethodProps = void> {
  params: RequestPayload,
  props: MethodProps,
  response: SlimRequestResponse
}
