import { Id, User } from "common";

import { RootState } from "state/types";

export const selectUserById =
  (id: Id) =>
  ({ users: { entities } }: RootState): User =>
    entities[id];

export const selectUsersLoading = ({
  users: { loading },
}: RootState): boolean => loading;
