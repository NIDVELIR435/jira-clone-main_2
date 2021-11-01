import { Status } from "common";

const statusDisplayNames = {
  [Status.TODO]: "Todo",
  [Status.IN_PROGRESS]: "In progress",
  [Status.DONE]: "Done",
} as const;

export const getStatusDisplayName = (status: Status): string =>
  statusDisplayNames[status];
