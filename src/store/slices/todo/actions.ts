import { EndpointMethod, OptionalMethodProps } from "../../../endpoint";
import { ITodoItem, ICacheProps } from "../../../models";
import { TodoApi } from "./api";
import { Orchestrators } from "../../../endpoint/saga";

export const TodoMethods = {
  GetAll: new EndpointMethod<void, ITodoItem[], OptionalMethodProps<ICacheProps>>({
    method: 'GET',
    apiFunction: TodoApi.cacheOverridableRequest,
    asyncOrchestrator: Orchestrators.takeLeading
  }),

  GetById: new EndpointMethod<string, ITodoItem>({
    method: 'GET',
    apiFunction: TodoApi.request,
    asyncOrchestrator: Orchestrators.takeEvery,
    urlPreparer: (config) => config.params
  }),

  Add: new EndpointMethod<ITodoItem, ITodoItem>({
    method: 'POST',
    apiFunction: TodoApi.request,
    asyncOrchestrator: Orchestrators.takeEvery
  }),

  Delete: new EndpointMethod<ITodoItem, ITodoItem>({
    method: 'DELETE',
    apiFunction: TodoApi.request,
    asyncOrchestrator: Orchestrators.takeEvery,
    bodyPreparer: () => undefined,
    urlPreparer: (config) => config.params.url
  }),

  Update: new EndpointMethod<ITodoItem, ITodoItem>({
    method: 'PATCH',
    apiFunction: TodoApi.request,
    asyncOrchestrator: Orchestrators.takeEvery,
    urlPreparer: (config) => config.params.url
  }),
}
