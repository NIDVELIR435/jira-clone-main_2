import _ from "lodash";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getAllTasks } from "apis/jsonplaceholder";

import { Task, Id } from "common";
import { LoadingEntitiesState } from "state/types/utils";

import { getNextStatus } from "./tasks.utils";

export type TasksState = LoadingEntitiesState<Task>;

const tasksSliceName = "tasks";

const initialState: TasksState = {
  loading: true,
  entities: {},
};

export const fetchTasks = createAsyncThunk(
  `${tasksSliceName}/fetchTasks`,
  getAllTasks
);

const tasksSlice = createSlice({
  name: tasksSliceName,
  initialState,
  reducers: {
    setNextTaskState(state, { payload: id }: PayloadAction<Id>) {
      const task = state.entities[id];
      if (_.isNil(task)) return;
      task.status = getNextStatus(task.status);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTasks.fulfilled,
      (state: TasksState, { payload: tasks }: PayloadAction<Array<Task>>) => {
        tasks.forEach((task) => {
          state.entities[task.id] = task;
        });
        state.loading = false;
      }
    );
  },
});

export const {
  reducer: tasksReducer,
  actions: { setNextTaskState },
} = tasksSlice;
