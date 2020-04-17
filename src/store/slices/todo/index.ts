import { createReducer } from "@reduxjs/toolkit";

import { EndpointSlice } from "../../../endpoint";
import { todoAdapter } from './schema';
import { TodoMethods } from "./actions";

// TODO: Restrict TodoSliceState to being required to inherit from the IEndpointState
//  This will allow us to fix code-splitting

// TODO: Use the Redux Toolkit createSlice() method internally

export const TodoSlice = new EndpointSlice(
  'Todo',
  'https://todo-backend-typescript.herokuapp.com/',
  todoAdapter.getInitialState(),
  TodoMethods
)

const { Add, Delete, GetAll, GetById, Update } = TodoSlice.Actions;
export const todoReducer = createReducer(TodoSlice.initialState, {
  [GetAll.Success.type]: todoAdapter.addMany,
  [GetById.Success.type]: todoAdapter.addOne,
  [Add.Execute.type]: todoAdapter.addOne,
  [Add.Success.type]: (state, action: ReturnType<typeof Add.Success>) => {
    todoAdapter.removeOne(state, action.meta.params.url);
    todoAdapter.addOne(state, action.payload);
  },
  [Delete.Execute.type]: (state, action: ReturnType<typeof Delete.Execute>) => {
    todoAdapter.removeOne(state, action.payload.url);
  },
  [Update.Execute.type]: (state, action: ReturnType<typeof Update.Execute>) => {
    todoAdapter.updateOne(state, {
      id: action.payload.url,
      changes: action.payload
    });
  },
})

TodoSlice.registerReducer(todoReducer);
