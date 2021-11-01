import React from "react";
import _ from "lodash/fp";
import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useAppDispatch, setNextTaskState } from "state";
import type { Task as TaskEntity } from "common";
import { UserAvatar } from "ui/components/user-avatar";
import { getStatusDisplayName } from "ui/common";
import { TaskType } from "./task.types";
import "./task.scss";


type TaskProps = {
  task: TaskEntity;
  taskType: TaskType;
  style: any;
};

export const Task: React.FC<TaskProps> = ({ task, taskType, style }) => {
  const dispatch = useAppDispatch();

  const handleChangeStatus: () => void = _.flow([
    () => setNextTaskState(task.id),
    dispatch,
  ]);

  const isFullTask = taskType === TaskType.FULL;

  return (
    <ListItem className="task" onClick={handleChangeStatus} style={style}>
      <ListItemAvatar>
        <UserAvatar userId={task.userId} />
      </ListItemAvatar>
      <ListItemText primary={task.title} className="task-title" />
      {isFullTask ? (
        <ListItemText
          primary={getStatusDisplayName(task.status)}
          className="task-status"
        />
      ) : null}
    </ListItem>
  );
};
