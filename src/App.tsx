import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

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

  const todos = useSelector((state: ApplicationState) => Object.values(state.Todo.items));

  const onDeleteItem = useCallback((item: ITodoItem) => {
    deleteTodo(item);
  }, [deleteTodo]);

  const onCheckedItem = useCallback((item: ITodoItem) => {
    updateTodo({
      ...item,
      completed: !item.completed
    });
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
      />
    </Layout>
  );
}

export default App;
