import { SlimRequestResponse } from ".";

export interface IEndpointMethodProps {
  id?: string,
  disableRollback?: boolean
}

export interface IAsyncOrchestrationProps<RequestPayload = void, MethodProps = void> {
  params: RequestPayload,
  props: MethodProps & IEndpointMethodProps,
  response: SlimRequestResponse
}
