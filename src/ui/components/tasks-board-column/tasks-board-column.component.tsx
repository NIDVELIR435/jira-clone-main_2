import React from "react";
import { List, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Status } from "common";
import { selectTasksWithStatus } from "state";
import { getStatusDisplayName } from "ui/common";
import { Task, TaskType } from "ui/components/task";
import "./tasks-board-column.scss";
import { Virtuoso } from "react-virtuoso";

type Props = {
  status: Status;
};

export const TasksBoardColumn: React.FC<Props> = ({ status }) => {
  const tasks = useSelector(selectTasksWithStatus(status));

  return (
    <div className="tasks-board-column-wrapper">
      <Typography variant="h4" className="tasks-board-column-title">
        {getStatusDisplayName(status)}
      </Typography>
      <List className="tasks-board-column-list">
        <Virtuoso
          data={tasks}
          itemContent={(index) => (
            <Task
              key={tasks[index].id}
              task={tasks[index]}
              taskType={TaskType.SHORT}
              style={{}}
            />
          )}
        />
      </List>
    </div>
  );
};
