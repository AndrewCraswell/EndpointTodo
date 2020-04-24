import { SlimRequestResponse, RequestMethod } from "..";

export interface IEndpointMethodProps {
  id?: string;
  disableRollback?: boolean;
  method?: RequestMethod;
}

export interface IAsyncOrchestrationRequestMeta<MethodProps = void> {
  props: MethodProps;
}

export interface IAsyncOrchestrationResultMeta<RequestPayload = void, MethodProps = void> {
  params: RequestPayload;
  props: MethodProps;
  response: SlimRequestResponse;
}
