import React, { useEffect, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { SortEnd } from 'react-sortable-hoc';
import { useSnackbar } from 'notistack';

import Layout from "./components/Layout";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { TodoSlice } from './store/slices/todo';
import { useEndpointMethod } from './endpoint';
import { ApplicationState } from './store';
import { ITodoItem } from './models';

// TODO: Use the todoAdapter selectors to query the items
// TODO: Add a loading spinner

function App() {
  const getAllTodos = useEndpointMethod(TodoSlice.Actions.GetAll);
  const addTodo = useEndpointMethod(TodoSlice.Actions.Add);
  const deleteTodo = useEndpointMethod(TodoSlice.Actions.Delete);
  const updateTodo = useEndpointMethod(TodoSlice.Actions.Update);

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
    <Layout>
      <AddTodoForm addTodoItem={addTodo} />
      <TodoList
        items={todos as ITodoItem[]}
        onItemCheck={onCheckedItem}
        onItemRemove={onDeleteItem}
        onItemSorted={onItemSorted}
      />
    </Layout>
  );
}

export default App;


function moveArray(array: Array<any>, fromIndex: number, toIndex: number) {
  var element = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, element);
}
