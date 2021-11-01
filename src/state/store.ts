import { configureStore } from "@reduxjs/toolkit";

import { tasksReducer } from "state/slices/tasks";
import { usersReducer } from "state/slices/users";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    users: usersReducer,
  },
});
