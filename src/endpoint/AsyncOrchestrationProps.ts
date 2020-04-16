import { IRequestResponse } from ".";

export interface IAsyncOrchestrationProps<RequestPayload = void, MethodProps = void> {
  params: RequestPayload,
  props: MethodProps,
  response: Omit<IRequestResponse, 'data'|'config'>
}
