import React, { memo, useCallback } from "react";
import { Paper } from "@material-ui/core";
import { SortEnd } from 'react-sortable-hoc';

import { ITodoItem } from '../models';
import SortableTodoList from "./SortableTodoList";

interface ITodoListProps {
  items: ITodoItem[];
  onItemRemove: (item: ITodoItem) => void;
  onItemCheck: (item: ITodoItem) => void;
  onItemSorted: (result: SortEnd, items: ITodoItem[]) => void
}

const TodoList: React.FunctionComponent<ITodoListProps> = memo(props => {
  const { items, onItemCheck,  onItemRemove, onItemSorted } = props;

  const onSortEnd = useCallback((result: SortEnd) => {
    onItemSorted(result, items);
  }, [items, onItemSorted]);


  return (
    <>
      {items.length > 0 && (
        <Paper style={{ margin: 16 }}>
          <SortableTodoList
            items={items}
            lockAxis="y"
            lockToContainerEdges
            useDragHandle
            lockOffset="0%"
            onItemRemove={onItemRemove}
            onItemCheck={onItemCheck}
            onSortEnd={onSortEnd} />
        </Paper>
      )}
    </>
  );
});

export default TodoList;
