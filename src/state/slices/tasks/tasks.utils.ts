import { Status } from "common";

const statusStateMachine = {
  [Status.TODO]: Status.IN_PROGRESS,
  [Status.IN_PROGRESS]: Status.DONE,
  [Status.DONE]: Status.TODO,
} as const;

export const getNextStatus = (currentStatus: Status): Status =>
  statusStateMachine[currentStatus];
