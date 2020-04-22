import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { ITodoItem } from '../../../models';
import { List } from '@material-ui/core';
import SortableTodo from './SortableTodo';

import './SortableTodoList.scss';

export interface ISortableTodoListProps {
  items: ITodoItem[];
  onItemRemove: (item: ITodoItem) => void;
  onItemCheck: (item: ITodoItem) => void;
}

export const SortableTodoList = SortableContainer((props: ISortableTodoListProps) => {
  const { items, onItemCheck, onItemRemove } = props;

  return (
    <List>
      {items.map((todo, idx) => (
        <SortableTodo key={`todo-${todo.url}`} index={idx} todos={items} value={todo} onItemCheck={onItemCheck} onItemRemove={onItemRemove} />
      ))}
    </List>
  );
});

export default SortableTodoList;
