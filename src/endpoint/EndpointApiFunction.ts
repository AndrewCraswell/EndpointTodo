import { RequestMethod, IRequestResponse } from ".";
import { IAsyncOrchestrationProps } from "./";

export type EndpointApiFunctionConfig<RequestPayload = void, MethodProps = void> = {
  url: string,
  method: RequestMethod,
  payload?: RequestPayload,
  props?: IAsyncOrchestrationProps<RequestPayload, MethodProps>
}

export type EndpointApiFunction<RequestPayload = void, ResponsePayload = void, MethodProps = void> = (
  config: EndpointApiFunctionConfig<RequestPayload, MethodProps>
) => Promise<IRequestResponse<ResponsePayload>>

export type EndpointHandledApiFunction<RequestPayload = void, ResponsePayload = void, MethodProps = void> =
  (payload: RequestPayload, props: IAsyncOrchestrationProps<RequestPayload, MethodProps>) => Promise<IRequestResponse<ResponsePayload>>;
