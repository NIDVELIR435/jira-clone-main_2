import React from "react";
import { Avatar, Skeleton, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

import { selectUserById, selectUsersLoading } from "state";

import { Id } from "common";

import { stringAvatar } from "./user-avatar.utils";

import "./user-avatar.scss";

export const UserAvatar: React.FC<{ userId: Id }> = ({ userId }) => {
  const isUserLoading = useSelector(selectUsersLoading);
  const user = useSelector(selectUserById(userId));

  return isUserLoading ? (
    <Skeleton variant="circular" className="user-avatar" />
  ) : (
    <Tooltip title={user.name}>
      <Avatar className="user-avatar" {...stringAvatar(user.name)} />
    </Tooltip>
  );
};
