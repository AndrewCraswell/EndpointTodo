import { AsyncMethodActions, EndpointHandledApiFunction } from '.';

export type AsyncOrchestratorConfig<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined> =  {
  name: string,
  actions: AsyncMethodActions<RequestPayload, ResponsePayload, MethodProps>,
  apiFunction: EndpointHandledApiFunction<RequestPayload, ResponsePayload, MethodProps>
}

// TODO: Convert the orchestrator from a Class to a Function
export abstract class AsyncOrchestrator {
  public abstract orchestrate<RequestPayload = undefined, ResponsePayload = undefined, MethodProps = undefined>(
    config: AsyncOrchestratorConfig<RequestPayload, ResponsePayload, MethodProps>
  ): void;
}
