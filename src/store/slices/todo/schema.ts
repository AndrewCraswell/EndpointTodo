import { schema } from 'normalizr';

import { ITodoItem } from '../../../models';
import { getTodoId } from '../../../utils';

const todoSchema = new schema.Entity('todos', {}, {
  idAttribute: (todo: ITodoItem) => getTodoId(todo),
  processStrategy: (todo: ITodoItem) => {
    return {
      ...todo,
      id: getTodoId(todo)
    }
  }
});

export const todoListSchema = [todoSchema];
