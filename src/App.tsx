import React, { useEffect, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { SortEnd } from 'react-sortable-hoc';

import Layout from "./components/Layout";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { TodoMethods } from './store/slices/todo';
import { useEndpointMethod } from './endpoint';
import { ApplicationState } from './store';
import { ITodoItem } from './models';

function App() {
  const getAllTodos = useEndpointMethod(TodoMethods.GetAll);
  const addTodo = useEndpointMethod(TodoMethods.Add);
  const deleteTodo = useEndpointMethod(TodoMethods.Delete);
  const updateTodo = useEndpointMethod(TodoMethods.Update);

  const todos = useSelector((state: ApplicationState) => state.Todo.ids.map(id => state.Todo.items[id]), shallowEqual);

  const onDeleteItem = useCallback((item: ITodoItem) => {
    deleteTodo(item);
  }, [deleteTodo]);

  const onCheckedItem = useCallback((item: ITodoItem) => {
    updateTodo({
      ...item,
      completed: !item.completed
    });
  }, [updateTodo]);

  const onItemSorted = useCallback((result: SortEnd, items: ITodoItem[]) => {
    const { newIndex, oldIndex } = result;
    if (newIndex === oldIndex) { return; }

    const sortable = [...items];
    moveArray(sortable, oldIndex, newIndex);

    for (let i = newIndex; i <= oldIndex; i++) {
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
        items={todos}
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
