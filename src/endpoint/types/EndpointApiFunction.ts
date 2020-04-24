import { RequestMethod, IRequestResponse, IEndpointMethodProps } from "..";

export type EndpointApiFunctionConfig<RequestPayload = void, MethodProps = IEndpointMethodProps | void> = {
  url: string,
  method: RequestMethod,
  payload?: RequestPayload,
  props?: MethodProps
}

export type EndpointApiFunction<RequestPayload = void, ResponsePayload = void, MethodProps = void> = (
  config: EndpointApiFunctionConfig<RequestPayload, MethodProps>
) => Promise<IRequestResponse<ResponsePayload>>

export type EndpointHandledApiFunction<RequestPayload = void, ResponsePayload = void, MethodProps = void> =
  (payload: RequestPayload, props: MethodProps) => Promise<IRequestResponse<ResponsePayload>>;
