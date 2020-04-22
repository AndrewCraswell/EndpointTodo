import React, { memo, useCallback } from "react";
import { AppBar, Toolbar, Typography, Paper, FormControlLabel, Switch, IconButton } from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';

import { useEndpointMethod } from "../endpoint";
import { TodoSlice } from "../store/slices/todo";
import { useCache } from './UseCacheProvider';

const Layout = memo(props => {
  const { isCacheEnabled, setCacheEnabled } = useCache();
  const getAllTodos = useEndpointMethod(TodoSlice.actions.GetAll);

  const onSyncClick = useCallback(() => {
    getAllTodos(undefined, { disableCache: !isCacheEnabled });

  }, [getAllTodos, isCacheEnabled]);

  const onUseCacheToggled = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCacheEnabled(checked);
  }, [setCacheEnabled]);

  return (
    <Paper elevation={0} style={{ padding: 0, margin: 0, backgroundColor: "#fafafa" }}>
      <AppBar color="primary" position="static" style={{ height: 64, marginBottom: 32 }}>
        <Toolbar style={{ height: 64 }}>
          <Typography color="inherit">RESTUX TODO APP</Typography>

          <div style={{ flexGrow: 1 }} />

          <IconButton aria-label="Refresh the todo list" color="inherit" onClick={onSyncClick}>
            <SyncIcon />
          </IconButton>

          <FormControlLabel
            control={<Switch color="secondary" checked={isCacheEnabled} onChange={onUseCacheToggled} />}
            label="Use cache?"
            labelPlacement="end"
          />
        </Toolbar>
      </AppBar>
      {props.children}
    </Paper>
  );
});

export default Layout;
