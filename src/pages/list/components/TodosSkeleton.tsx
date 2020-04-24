import React from "react";
import { Paper, ListItem, IconButton, ListItemSecondaryAction } from "@material-ui/core";
import { DragHandleRounded, DeleteOutlined } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";

import './TodosSkeleton.scss';

export const TodosSkeleton: React.FunctionComponent = () => (
  <Paper>
    {[0.8, 0.6, 0.4, 0.2].map((opacity, index) => (
      <ListItem key={index} style={{ opacity }}>
        <IconButton disabled>
          <DragHandleRounded />
        </IconButton>

        <div className="todo-skeleton-container">
          <Skeleton className="todo-checkbox-skeleton" variant="rect" width={20} height={20} />
          <Skeleton className="todo-text-skeleton" />
        </div>

        <ListItemSecondaryAction>
          <IconButton disabled style={{ opacity }}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </Paper>
);
