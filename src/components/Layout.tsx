import React, { memo, useCallback } from "react";
import { AppBar, Toolbar, Typography, Paper, FormControlLabel, Switch, IconButton } from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import { useSnackbar } from "notistack";

import { useEndpointMethod } from "../endpoint";
import { TodoSlice } from "../store/slices/todo";
import { useCache } from './UseCacheProvider';

const Layout = memo(props => {
  const { enqueueSnackbar } = useSnackbar();
  const { isCacheEnabled, setCacheEnabled } = useCache();
  const getAllTodos = useEndpointMethod(TodoSlice.Actions.GetAll);

  const onSyncClick = useCallback(() => {
    getAllTodos(undefined, { disableCache: !isCacheEnabled });

    if (isCacheEnabled) {
      enqueueSnackbar('Okay, I got todo tasks from the cache', { variant: 'info' });
    } else {
      enqueueSnackbar('I fetched the latest todo tasks from the server!', { variant: 'info' });
    }

  }, [getAllTodos, enqueueSnackbar, isCacheEnabled]);

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
            value="isCache"
            control={<Switch color="secondary" onChange={onUseCacheToggled} />}
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
