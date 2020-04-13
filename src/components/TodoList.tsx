import React, { memo } from "react";
import { List, Paper } from "@material-ui/core";

import TodoListItem from "./TodoListItem";
import { ITodoItem } from '../models';

interface ITodoListProps {
  items: ITodoItem[];
  onItemRemove: (item: ITodoItem) => void;
  onItemCheck: (item: ITodoItem) => void;
}

const TodoList: React.FunctionComponent<ITodoListProps> = memo(props => (
  <>
    {props.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {props.items.map((todo, idx) => (
            <TodoListItem
              item={todo}
              key={`TodoItem.${idx}`}
              divider={idx !== props.items.length - 1}
              onButtonClick={props.onItemRemove}
              onCheckBoxToggle={props.onItemCheck}
            />
          ))}
        </List>
      </Paper>
    )}
  </>
));

export default TodoList;
