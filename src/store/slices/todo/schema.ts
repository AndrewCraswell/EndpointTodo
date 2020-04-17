import { ITodoItem } from '../../../models';
import { createEntityAdapter } from '@reduxjs/toolkit';

// Data Adapters
export const todoAdapter = createEntityAdapter<ITodoItem>({
  selectId: todo => todo.url,
  sortComparer: (a, b) => a.order - b.order,
})
