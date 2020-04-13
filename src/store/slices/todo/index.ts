import { getType } from "typesafe-actions";
import { createReducer } from "@reduxjs/toolkit";
import { normalize } from 'normalizr';

import { EndpointSlice, EndpointMethod, Orchestrators } from "../../../endpoint";
import { TodoApi } from "./api";
import { ITodoItem, TodoMap } from "../../../models";
import { todoListSchema } from './schema';
import { getSortedTodoIds, normalizeSingleTodo } from '../../../utils';

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
  GetAll: new EndpointMethod<undefined, ITodoItem[]>('GET', TodoApi.getTodos, Orchestrators.takeLatest),
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
  // TODO: Don't depend on getType()
  [getType(GetAll.Success)]: (state, action: ReturnType<typeof GetAll.Success>) => {
    const { entities } = normalize(action.payload, todoListSchema);
    const items = entities.todos as TodoMap;

    state.items = items;
    state.ids = getSortedTodoIds(items);
  },
  [getType(GetById.Success)]: (state, action: ReturnType<typeof GetById.Success>) => {
    const todo = normalizeSingleTodo(action.payload);

    state.items[todo.id] = todo;
    state.ids = getSortedTodoIds(state.items);
  },
  [getType(Add.Execute)]: (state, action: ReturnType<typeof Add.Execute>) => {
    const todo = normalizeSingleTodo(action.payload);

    state.items[todo.id] = todo;
    state.ids = getSortedTodoIds(state.items);
  },
  [getType(Add.Success)]: (state, action: ReturnType<typeof Add.Success>) => {
    // TODO: Remove the temp todo that was added
    const todo = normalizeSingleTodo(action.payload);

    state.items[todo.id] = todo;
    state.ids = getSortedTodoIds(state.items);
  },
  [getType(Delete.Execute)]: (state, action: ReturnType<typeof Delete.Execute>) => {
    const todo = normalizeSingleTodo(action.payload);

    delete state.items[todo.id];
    state.ids = getSortedTodoIds(state.items);
  },
  [getType(Update.Execute)]: (state, action: ReturnType<typeof Update.Execute>) => {
    const todo = normalizeSingleTodo(action.payload);

    state.items[todo.id] = todo;
    state.ids = getSortedTodoIds(state.items);
  },
})

TodoSlice.registerReducer(todoReducer);
