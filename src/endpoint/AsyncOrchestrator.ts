import { AsyncMethodActions, EndpointHandledApiFunction } from '.';

export type AsyncOrchestratorConfig<RequestPayload = void, ResponsePayload = void, MethodProps = void> =  {
  name: string,
  actions: AsyncMethodActions<RequestPayload, ResponsePayload, MethodProps>,
  apiFunction: EndpointHandledApiFunction<RequestPayload, ResponsePayload, MethodProps>
}

// TODO: Convert the orchestrator from a Class to a Function
export abstract class AsyncOrchestrator {
  public abstract orchestrate<RequestPayload = void, ResponsePayload = void, MethodProps = void>(
    config: AsyncOrchestratorConfig<RequestPayload, ResponsePayload, MethodProps>
  ): void;
}
