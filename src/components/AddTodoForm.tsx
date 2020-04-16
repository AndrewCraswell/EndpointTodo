import React, { memo } from "react";
import { TextField, Paper, Button, Grid } from "@material-ui/core";
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';

import { ITodoItem } from '../models';
import { ApplicationState } from '../store';

interface IAddTodoForm {
  addTodoItem: (item: ITodoItem, props: void) => void
}

type TodoForm = {
  title: string;
}

const AddTodoForm: React.FunctionComponent<IAddTodoForm> = memo((props) => {
  const { addTodoItem } = props;
  const { register, handleSubmit, reset, formState } = useForm<TodoForm>();

  const nextOrderNum = useSelector((state: ApplicationState) => {
    const lastId = state.Todo.ids.slice(-1).pop();
    if (lastId) {
      return state.Todo.items[lastId].order + 1;
    }
    return 1;
  });

  const onSubmit = (data: TodoForm) => {
    const id = nanoid();
    addTodoItem({
      id,
      title: data.title,
      completed: false,
      order: nextOrderNum
    } as ITodoItem);

    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper style={{ margin: 16, padding: 16 }}>
        <Grid container>
          <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
            <TextField
              name="title"
              placeholder="Todo description..."
              fullWidth
              inputRef={register}
            />
          </Grid>
          <Grid xs={2} md={1} item>
            <Button
              type="submit"
              fullWidth
              color="secondary"
              variant="outlined"
              disabled={!formState.dirty}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
});

export default AddTodoForm;
