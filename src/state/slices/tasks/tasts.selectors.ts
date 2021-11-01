import { Status, Id, Task } from "common";

import type { RootState } from "state/types";

const statusOrder = {
  [Status.TODO]: 1,
  [Status.IN_PROGRESS]: 2,
  [Status.DONE]: 3,
} as const;

export const selectTasksLoading = ({
  tasks: { loading },
}: RootState): boolean => loading;

export const selectTaskById =
  (taskId: Id) =>
  ({ tasks }: RootState): Task =>
    tasks.entities[taskId];

export const selectAllTasks = ({ tasks }: RootState): Array<Task> =>
  Object.values(tasks.entities).sort(
    ({ status: statusA }, { status: statusB }) =>
      statusOrder[statusA as Status] - statusOrder[statusB as Status]
  );

export const selectTasksWithStatus =
  (status: Status) =>
  ({ tasks }: RootState): Array<Task> =>
    Object.values(tasks.entities).filter((task) => task.status === status);
