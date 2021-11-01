import { Status } from "./enums";

export type Id = number | string;

export type User = {
  id: Id;
  name: string;
};

export type Task = {
  id: Id;
  userId: Id;
  title: string;
  status: Status;
};
