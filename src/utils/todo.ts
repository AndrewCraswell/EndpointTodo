import { v4 as uuid } from 'uuid';
import { normalize } from 'normalizr';

import { ITodoItem, TodoMap } from '../models';
import { todoListSchema } from '../store/slices/todo/schema';

export const getSortedTodoIds = (todos: TodoMap) => {
  return Object.values(todos).sort((a, b) => b.order - a.order).map((todo) => todo.id);
};

export const getTodoId = (todo: ITodoItem) => {
  if (todo.id) return todo.id;

  return todo.url ? todo.url.split('.com/')[1] : uuid();
};

export const normalizeSingleTodo = (todo: ITodoItem): ITodoItem => {
  const { entities } = normalize([todo], todoListSchema);
    const items = entities.todos as TodoMap;
    return Object.values(items)[0]
}
