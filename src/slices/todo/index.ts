import { getType } from "typesafe-actions";
import { createReducer } from "@reduxjs/toolkit";

import { EndpointSlice, EndpointMethodFactory, SagaOrchestrator } from "../../endpoint";
import { TodoApi } from "./api";
import { ITodoItem } from "../../models";
import { takeEvery, takeLeading } from "redux-saga/effects";

interface ITodoSliceState {
  items: { [id: string]: ITodoItem };
}

export const initialState: ITodoSliceState = {
  items: {}
}

export const TodoSlice = new EndpointSlice(
  'Todo',
  'https://todo-backend-typescript.herokuapp.com/',
  initialState,
  {
    // TODO: Infer RequestPayload and ResponsePayload from Api method itself
    // TODO: Configure to be able to GET by Id or get all without an Id
    GET: new EndpointMethodFactory<string | undefined, ITodoItem[] | ITodoItem>(TodoApi.getTodos, new SagaOrchestrator(takeLeading)),
    POST: new EndpointMethodFactory<ITodoItem, ITodoItem>(TodoApi.addTodo, new SagaOrchestrator(takeEvery)),
  }
)

export const todoReducer = createReducer(TodoSlice.initialState, {
  // TODO: Don't depend on getType()
  [getType(TodoSlice.Methods.GET.success)]: (state, action: ReturnType<typeof TodoSlice.Methods.GET.success>) => {
    if (Array.isArray(action.payload)) {
      action.payload.map((payload) => {
        const id = payload.url ? payload.url.split('.com/')[1] : '';
        return state.items[id] = payload;
      });
    } else {
      const id = action.payload.url ? action.payload.url.split('.com/')[1] : '';
      state.items[id] = action.payload;
    }
  },
  [getType(TodoSlice.Methods.POST.request)]: (state, action: ReturnType<typeof TodoSlice.Methods.POST.request>) => {
    state.items[0] = action.payload;
  },
  [getType(TodoSlice.Methods.POST.success)]: (state, action: ReturnType<typeof TodoSlice.Methods.POST.success>) => {
    const id = action.payload.url ? action.payload.url.split('.com/')[1] : '';
    delete state.items[0];
    state.items[id] = action.payload;
  }
})

TodoSlice.registerReducer(todoReducer);
