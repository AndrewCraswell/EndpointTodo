import React, { useEffect } from 'react';

import { TodoMethods } from './slices/todo/';
import { useEndpointMethod } from './endpoint';

// TODO: Build example Todo UI

function App() {
  const getAllTodos = useEndpointMethod(TodoMethods.GetAll);
  const getTodosById = useEndpointMethod(TodoMethods.GetById);
  const addTodo = useEndpointMethod(TodoMethods.Add);

  useEffect(() => {
    getAllTodos();
  }, [getAllTodos]);

  return (
    <div className="App">
      <button onClick={() => getAllTodos()}>Get Todos</button>
      <button onClick={() => getTodosById(5264)}>Get Todo By Id</button>
      <button onClick={() => addTodo({
        completed: false,
        title: 'Clean my room',
        order: 1
      })}>Add Todo</button>
    </div>
  );
}

export default App;
