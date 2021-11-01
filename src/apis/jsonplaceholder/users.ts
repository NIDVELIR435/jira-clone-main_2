import { User } from "common";

import { validateFormatAxiosResponse } from "apis/utils";

import { getAllUsersSchema } from "schemas";

import { jsonplaceholderClient } from "./common";

export const getAllUsers = async (): Promise<Array<User>> =>
  jsonplaceholderClient
    .get<Array<User>>("/users")
    .then(validateFormatAxiosResponse(getAllUsersSchema()));
