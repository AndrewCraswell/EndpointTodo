import React from 'react';
import { useDispatch } from 'react-redux';

import { TodoSlice } from './slices/todo/';

function App() {
  const dispatch = useDispatch();

  return (
    <div className="App">
      <button onClick={() => dispatch(TodoSlice.Methods.GET.request('5264'))}>Get Todos</button>
      <button onClick={() => dispatch(TodoSlice.Methods.POST.request({
        completed: false,
        title: 'Clean my room',
        order: 1
      }))}>Add Todo</button>
    </div>
  );
}

export default App;
