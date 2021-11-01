import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getAllUsers } from "apis/jsonplaceholder";

import { User } from "common";

import { LoadingEntitiesState } from "state/types";

const usersSliceName = "users";

export type UsersState = LoadingEntitiesState<User>;

export const fetchUsers = createAsyncThunk(
  `${usersSliceName}/fetchUsers`,
  getAllUsers
);

const initialState: UsersState = {
  entities: {},
  loading: true,
};

const usersSlice = createSlice({
  name: usersSliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state: UsersState, { payload: users }: PayloadAction<Array<User>>) => {
        users.forEach((user) => {
          state.entities[user.id] = user;
          state.loading = false;
        });
      }
    );
  },
});

export const { reducer: usersReducer } = usersSlice;
