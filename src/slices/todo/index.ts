import { getType } from "typesafe-actions";
import { createReducer } from "@reduxjs/toolkit";

import { EndpointSlice, EndpointMethod, Orchestrators } from "../../endpoint";
import { TodoApi } from "./api";
import { ITodoItem } from "../../models";

// TODO: Restrict TodoSliceState to being required to inherit from the IEndpointState
//  This will allow us to fix code-splitting

interface ITodoSliceState {
  items: { [id: string]: ITodoItem };
}

export const initialState: ITodoSliceState = {
  items: {}
}

export const TodoMethods =   {
  // TODO: Infer RequestPayload and ResponsePayload from Api method itself?
  GetAll: new EndpointMethod<undefined, ITodoItem[]>('GET', TodoApi.getTodos, Orchestrators.takeLatest),
  GetById: new EndpointMethod<number, ITodoItem>('GET', TodoApi.getTodoById, Orchestrators.takeEvery),
  Add: new EndpointMethod<ITodoItem, ITodoItem>('POST', TodoApi.addTodo, Orchestrators.takeEvery),
}

export const TodoSlice = new EndpointSlice(
  'Todo',
  'https://todo-backend-typescript.herokuapp.com/',
  initialState,
  TodoMethods
)

export const todoReducer = createReducer(TodoSlice.initialState, {
  // TODO: Don't depend on getType()
  [getType(TodoMethods.GetAll.Success)]: (state, action: ReturnType<typeof TodoMethods.GetAll.Success>) => {
    action.payload.map((payload) => {
      const id = payload.url ? payload.url.split('.com/')[1] : '';
      return state.items[id] = payload;
    });
  },
  [getType(TodoMethods.GetById.Success)]: (state, action: ReturnType<typeof TodoMethods.GetById.Success>) => {
    const id = action.payload.url ? action.payload.url.split('.com/')[1] : '';
    state.items[id] = action.payload;
  },
  [getType(TodoMethods.Add.Execute)]: (state, action: ReturnType<typeof TodoMethods.Add.Execute>) => {
    state.items[0] = action.payload;
  },
  [getType(TodoMethods.Add.Success)]: (state, action: ReturnType<typeof TodoMethods.Add.Success>) => {
    const id = action.payload.url ? action.payload.url.split('.com/')[1] : '';
    delete state.items[0];
    state.items[id] = action.payload;
  }
})

TodoSlice.registerReducer(todoReducer);
