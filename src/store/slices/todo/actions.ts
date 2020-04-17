import { EndpointMethod, Orchestrators } from "../../../endpoint";
import { ITodoItem } from "../../../models";
import { TodoApi } from "./api";

export const TodoMethods = {
  // TODO: Infer RequestPayload and ResponsePayload from Api method itself?
  GetAll: new EndpointMethod<void, ITodoItem[]>('GET', TodoApi.getTodos, Orchestrators.takeLeading),
  GetById: new EndpointMethod<string, ITodoItem>('GET', TodoApi.getTodoById, Orchestrators.takeEvery),
  Add: new EndpointMethod<ITodoItem, ITodoItem>('POST', TodoApi.addTodo, Orchestrators.takeEvery),
  Delete: new EndpointMethod<ITodoItem, ITodoItem>('DELETE', TodoApi.deleteTodo, Orchestrators.takeEvery),
  Update: new EndpointMethod<ITodoItem, ITodoItem>('PATCH', TodoApi.updateTodo, Orchestrators.takeEvery),
}
