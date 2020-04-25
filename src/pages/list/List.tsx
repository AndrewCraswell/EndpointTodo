import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SortEnd } from 'react-sortable-hoc';
import { Alert } from '@material-ui/lab';

import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { TodoSlice, TodoSelectors } from '../../store/';
import { useEndpointMethod, useMethodRequests, useEndpointRequests, RequestStatus } from '../../endpoint';
import { ApplicationState } from '../../store';
import { ITodoItem } from '../../models';
import { TodosSkeleton } from './components/TodosSkeleton';

const { actions: Todos } = TodoSlice;

export const List: React.FunctionComponent = () => {
  const { requests: todoEndpointRequests, flushRequests } = useEndpointRequests(TodoSlice);
  const { isFetching: isTodosFetching } = useMethodRequests(Todos.GetAll);
  const getAllTodos = useEndpointMethod(Todos.GetAll);
  const addTodo = useEndpointMethod(Todos.Add);
  const deleteTodo = useEndpointMethod(Todos.Delete);
  const updateTodo = useEndpointMethod(Todos.Update);

  const requestErrorIds = todoEndpointRequests.filter(r => r.status === RequestStatus.FAILURE).map(r => r.id);
  const todos = useSelector((state: ApplicationState) => TodoSelectors.selectAll(state.Todo));

  const dismissError = useCallback((id: string) => {
    flushRequests(id);
  }, [flushRequests]);

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
      const order = i + 1;
      if (sortable[i].order !== order) {
        updateTodo({ ...sortable[i], order });
      }
    }
  }, [updateTodo]);

  useEffect(() => {
    getAllTodos();
  }, [getAllTodos]);

  return (
    <React.Fragment>
      {
        requestErrorIds.map((id) => (
          <Alert onClose={() => dismissError(id)} severity="error" style={{ marginBottom: 16 }}>
            We encountered an error trying to save your selection.
          </Alert>
        ))
      }
      <AddTodoForm addTodoItem={addTodo} />
      {isTodosFetching ? (
        <TodosSkeleton />
      ) : (
        <TodoList
          items={todos as ITodoItem[]}
          onItemCheck={onCheckedItem}
          onItemRemove={onDeleteItem}
          onItemSorted={onItemSorted}
        />
      )}
    </React.Fragment>
  );
}

export default List;


function moveArray(array: Array<any>, fromIndex: number, toIndex: number) {
  var element = array[fromIndex];
  array.splice(fromIndex, 1);
  array.splice(toIndex, 0, element);
}
