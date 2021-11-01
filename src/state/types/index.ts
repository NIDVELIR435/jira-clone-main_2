import { Action, ThunkAction } from "@reduxjs/toolkit";
import type { store } from "state/store";

import type { TasksState } from "state/slices/tasks";
import type { UsersState } from "state/slices/users";

export * from "./utils";

export type RootState = {
  tasks: TasksState;
  users: UsersState;
};

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
