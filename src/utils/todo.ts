import { normalize } from 'normalizr';
import { PayloadAction } from 'typesafe-actions';
import { nanoid } from '@reduxjs/toolkit';

import { ITodoItem, TodoMap } from '../models';
import { todoListSchema } from '../store/slices/todo/schema';
import { TodoSlice } from '../store/slices/todo';

export const getSortedTodoIds = (todos: TodoMap) => {
  return Object.values(todos).sort((a, b) => a.order - b.order).map((todo) => todo.id);
};

export const getTodoId = (todo: ITodoItem) => {
  if (todo.id) return todo.id;

  return todo.url ? todo.url.split('.com/')[1] : nanoid();
};

export const normalizeSingleTodo = (todo: ITodoItem): ITodoItem => {
  const { entities } = normalize([todo], todoListSchema);
    const items = entities.todos as TodoMap;
    return Object.values(items)[0]
}

export const addTodoToStore = (state: typeof TodoSlice.initialState, action: PayloadAction<any, ITodoItem>) => {
  const todo = normalizeSingleTodo(action.payload);

  state.items[todo.id] = todo;
  state.ids = getSortedTodoIds(state.items);

  return state;
}
