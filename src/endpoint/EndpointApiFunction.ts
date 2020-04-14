import { RequestMethod, IRequestResponse } from ".";
import { IAsyncOrchestrationProps } from "./";

export type EndpointApiFunctionConfig<RequestPayload = undefined, MethodProps = undefined> = {
  url: string,
  method: RequestMethod,
  payload?: RequestPayload,
  props?: IAsyncOrchestrationProps<RequestPayload, MethodProps>
}

export type EndpointApiFunction<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined> = (
  config: EndpointApiFunctionConfig<RequestPayload, MethodProps>
) => Promise<IRequestResponse<ResponsePayload>>

export type EndpointHandledApiFunction<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined> =
  (payload: RequestPayload, props: IAsyncOrchestrationProps<RequestPayload, MethodProps>) => Promise<IRequestResponse<ResponsePayload>>;
