import React, { memo, useCallback } from "react";
import {
  ListItem,
  Checkbox,
  IconButton,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

import { ITodoItem } from '../../../models';
import TodoDragHandle from "./TodoDragHandle";

import './TodoListItem.scss';

interface ITodoListItem {
  divider: boolean;
  item: ITodoItem;
  onButtonClick: (item: ITodoItem) => void;
  onCheckBoxToggle: (item: ITodoItem) => void;
}

const TodoListItem: React.FunctionComponent<ITodoListItem> = memo(props => {
  const { item, onButtonClick, onCheckBoxToggle } = props;

  const onCheck = useCallback(() => {
    onCheckBoxToggle(item);
  }, [onCheckBoxToggle, item]);

  const onRemove = useCallback(() => {
    onButtonClick(item);
  }, [onButtonClick, item]);

  return (
      <ListItem>
        <TodoDragHandle />

        <Checkbox
          onClick={onCheck}
          checked={item.completed}
          disableRipple
        />

        { item.completed ? (
          <del><ListItemText primary={item.title} /></del>
        ) : (
          <ListItemText primary={item.title} />
        )}

        <ListItemSecondaryAction>
          <IconButton aria-label="Delete Todo" onClick={onRemove} disabled={!item.url}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
  );
});

export default TodoListItem;
