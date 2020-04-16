import { createReducer } from "@reduxjs/toolkit";
import { normalize } from 'normalizr';

import { EndpointSlice, EndpointMethod, Orchestrators, IEndpointMethodProps } from "../../../endpoint";
import { TodoApi } from "./api";
import { ITodoItem, TodoMap } from "../../../models";
import { todoListSchema } from './schema';
import { getSortedTodoIds, normalizeSingleTodo, addTodoToStore } from '../../../utils';

// TODO: Restrict TodoSliceState to being required to inherit from the IEndpointState
//  This will allow us to fix code-splitting

interface ITodoSliceState {
  items: TodoMap;
  ids: string[];
}

const initialState: ITodoSliceState = {
  items: {},
  ids: []
}

export const TodoMethods =   {
  // TODO: Infer RequestPayload and ResponsePayload from Api method itself?
  GetAll: new EndpointMethod<void, ITodoItem[]>('GET', TodoApi.getTodos, Orchestrators.takeLatest),
  GetById: new EndpointMethod<string, ITodoItem>('GET', TodoApi.getTodoById, Orchestrators.takeEvery),
  Add: new EndpointMethod<ITodoItem, ITodoItem>('POST', TodoApi.addTodo, Orchestrators.takeEvery),
  Delete: new EndpointMethod<ITodoItem, ITodoItem>('DELETE', TodoApi.deleteTodo, Orchestrators.takeEvery),
  Update: new EndpointMethod<ITodoItem, ITodoItem>('PATCH', TodoApi.updateTodo, Orchestrators.takeEvery),
}

export const TodoSlice = new EndpointSlice(
  'Todo',
  'https://todo-backend-typescript.herokuapp.com/',
  initialState,
  TodoMethods
)

const { Add, Delete, GetAll, GetById, Update } = TodoMethods;
export const todoReducer = createReducer(TodoSlice.initialState, {
  [GetAll.Success.type]: (state, action: ReturnType<typeof GetAll.Success>) => {
    const { entities } = normalize(action.payload, todoListSchema);
    const items = entities.todos as TodoMap;

    state.items = items;
    state.ids = getSortedTodoIds(items);
  },
  [GetById.Success.type]: addTodoToStore,
  [Add.Execute.type]: addTodoToStore,
  [Add.Success.type]: (state, action: ReturnType<typeof Add.Success>) => {
    const todo = normalizeSingleTodo(action.payload);
    delete state.items[action.meta.params.id];
    state.items[todo.id] = todo;
    state.ids = getSortedTodoIds(state.items);
  },
  [Delete.Execute.type]: (state, action: ReturnType<typeof Delete.Execute>) => {
    const todo = normalizeSingleTodo(action.payload);
    delete state.items[todo.id];
    state.ids = getSortedTodoIds(state.items);
  },
  [Update.Execute.type]: addTodoToStore,
})

TodoSlice.registerReducer(todoReducer);
