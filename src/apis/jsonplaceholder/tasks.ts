import { Task } from "common";

import { validateFormatAxiosResponse } from "apis/utils";

import { getAllTasksSchema } from "schemas/apis/jsonplaceholder";

import { jsonplaceholderClient } from "./common";

export const getAllTasks = (): Promise<Array<Task>> =>
  jsonplaceholderClient
    .get<Array<Task>>("/todos")
    .then(validateFormatAxiosResponse(getAllTasksSchema()));
