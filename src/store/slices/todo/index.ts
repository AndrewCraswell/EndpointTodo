import { createReducer, createEntityAdapter } from "rtoolkit-immer-fix";

import { EndpointSlice } from "../../../endpoint";
import { TodoMethods } from "./actions";
import { ITodoItem } from "../../../models";

// Data Adapters
const todoAdapter = createEntityAdapter<ITodoItem>({
  selectId: todo => todo.url,
  sortComparer: (a, b) => a.order - b.order,
});

export const TodoSelectors = todoAdapter.getSelectors();

// Slice Definition
export const TodoSlice = new EndpointSlice(
  'Todo',
  'https://todo-backend-typescript.herokuapp.com/',
  todoAdapter.getInitialState(),
  TodoMethods
)

// Reducer
const { Add, Delete, GetAll, GetById, Update } = TodoSlice.actions;
const todoReducer = createReducer(TodoSlice.initialState, {
  [GetAll.Success.type]: todoAdapter.upsertMany,
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
