import React from "react";
import { SortableElement } from 'react-sortable-hoc';

import { ITodoItem } from "../models";
import TodoListItem from "./TodoListItem";

import './SortableTodo.scss';

export interface ISortableTodoProps {
  value: ITodoItem;
  index: number;
  todos: ITodoItem[];
  onItemRemove: (item: ITodoItem) => void;
  onItemCheck: (item: ITodoItem) => void;
}

export const SortableTodo = SortableElement((props: ISortableTodoProps) => {
  const { index, todos, value, onItemRemove, onItemCheck } = props;

  return (
    <TodoListItem
      item={value}
      divider={index !== todos.length - 1}
      onButtonClick={onItemRemove}
      onCheckBoxToggle={onItemCheck}
    />
  );
});

export default SortableTodo;
