import { IRequestResponse } from ".";

export interface IAsyncOrchestrationProps<RequestPayload = undefined, MethodProps = undefined> {
  params: RequestPayload,
  props: MethodProps,
  response: Omit<IRequestResponse, 'data'|'config'>
}
