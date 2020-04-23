import React, { useEffect, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { SortEnd } from 'react-sortable-hoc';

import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { TodoSlice } from '../../store/';
import { useEndpointMethod } from '../../endpoint';
import { ApplicationState } from '../../store';
import { ITodoItem } from '../../models';

// TODO: Use the todoAdapter selectors to query the items
// TODO: Add a loading spinner
const { actions: Todos } = TodoSlice;

export const List: React.FunctionComponent = () => {
  const getAllTodos = useEndpointMethod(Todos.GetAll);
  const addTodo = useEndpointMethod(Todos.Add);
  const deleteTodo = useEndpointMethod(Todos.Delete);
  const updateTodo = useEndpointMethod(Todos.Update);

  const todos = useSelector((state: ApplicationState) => state.Todo.ids.map(id => state.Todo.entities[id]), shallowEqual);

  const onDeleteItem = useCallback((item: ITodoItem) => {
    deleteTodo(item);
  }, [deleteTodo]);

  const onCheckedItem = useCallback((item: ITodoItem) => {
    updateTodo({ ...item, completed: !item.completed });
  }, [updateTodo]);

  const onItemSorted = useCallback((result: SortEnd, items: ITodoItem[]) => {
    const { newIndex, oldIndex } = result;
    if (newIndex === oldIndex) { return; }

    const sortable = [...items];
    moveArray(sortable, oldIndex, newIndex);

    let startIndex = newIndex, endIndex = oldIndex;
    if (newIndex > oldIndex) {
      startIndex = oldIndex;
      endIndex = newIndex;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      sortable[i] = { ...sortable[i], order: i + 1 };
      updateTodo(sortable[i]);
    }
  }, [updateTodo]);

  useEffect(() => {
    getAllTodos();

  }, [getAllTodos]);

  return (
    <React.Fragment>
      <AddTodoForm addTodoItem={addTodo} />
      <TodoList
        items={todos as ITodoItem[]}
        onItemCheck={onCheckedItem}
        onItemRemove={onDeleteItem}
        onItemSorted={onItemSorted}
      />
    </React.Fragment>
  );
}

export default List;


function moveArray(array: Array<any>, fromIndex: number, toIndex: number) {
  var element = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, element);
}
