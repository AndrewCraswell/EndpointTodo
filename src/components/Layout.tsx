import React, { memo, useCallback } from "react";
import { AppBar, Toolbar, Typography, Paper, Tabs, Tab, FormControlLabel, Switch, IconButton, Container } from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import { Link, useLocation } from "react-router-dom";

import { useEndpointMethod } from "../endpoint";
import { TodoSlice } from "../store/slices/todo";
import { useCache } from './UseCacheProvider';

const { actions: Todos } = TodoSlice;

const Layout = memo(props => {
  const { isCacheEnabled, setCacheEnabled } = useCache();
  const getAllTodos = useEndpointMethod(Todos.GetAll);
  const location = useLocation();

  const onSyncClick = useCallback(() => {
    getAllTodos(undefined, { disableCache: !isCacheEnabled });
  }, [getAllTodos, isCacheEnabled]);

  const onUseCacheToggled = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCacheEnabled(checked);
  }, [setCacheEnabled]);

  return (
    <Paper elevation={0} style={{ padding: 0, margin: 0, backgroundColor: "#fafafa" }}>
      <AppBar color="primary" position="static" style={{ marginBottom: 32 }}>
        <Toolbar disableGutters={false} variant="dense">
          <Typography color="inherit" style={{ margin: '0 20px' }}>RESTUX TODO</Typography>

          <Tabs value={location.pathname || '/'} aria-label="Site navigation">
            <Tab label="List" value="/" component={Link} to="/" />
            <Tab label="About" value="/about" component={Link} to="/about" />
          </Tabs>

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
      <Container maxWidth="md" style={{ padding: 16 }}>
        {props.children}
      </Container>
    </Paper>
  );
});

export default Layout;
