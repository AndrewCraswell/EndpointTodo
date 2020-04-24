import React from "react";
import { Paper, ListItem, IconButton, ListItemSecondaryAction } from "@material-ui/core";
import { DragHandleRounded, DeleteOutlined } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";

export const TodosSkeleton: React.FunctionComponent = () => (
  <Paper>
    {[0.8, 0.6, 0.4, 0.2].map((opacity) => (
      <ListItem style={{ opacity }}>
        <IconButton disabled>
          <DragHandleRounded />
        </IconButton>

        <div style={{ width: '100%', maxWidth: 450, display: 'flex' }}>
          <Skeleton variant="rect" width={20} height={20} style={{ margin: '0 12px' }} />
          <Skeleton style={{ flexGrow: 1 }} />
        </div>

        <ListItemSecondaryAction>
          <IconButton disabled>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </Paper>
);
