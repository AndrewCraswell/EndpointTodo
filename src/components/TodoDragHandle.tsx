import React from "react";
import { IconButton } from "@material-ui/core";
import DragHandleRounded from "@material-ui/icons/DragHandleRounded";
import { SortableHandle } from 'react-sortable-hoc';

export const TodoDragHandle = SortableHandle(() => (
  <IconButton aria-label="Reorder Todo">
    <DragHandleRounded />
  </IconButton>
));

export default TodoDragHandle;



