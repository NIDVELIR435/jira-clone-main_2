import React from "react";
import { Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTasksLoading, selectAllTasks } from "state";
import { TaskType, Task } from "ui/components/task";
import { Spinner } from "ui/components/spinner";
import "./tasks-list.scss";
import { Virtuoso } from "react-virtuoso";

export const TasksList: React.FC = () => {
  const isTasksLoading = useSelector(selectTasksLoading);
  const tasks = useSelector(selectAllTasks);

  return (
    <Paper className="tasks-list-wrapper">
      <Typography variant="h3">Ticket list</Typography>
      {isTasksLoading ? (
        <Spinner />
      ) : (
        <Virtuoso
          data={tasks}
          itemContent={(index) => (
            <Task
              key={tasks[index].id}
              task={tasks[index]}
              taskType={TaskType.FULL}
              style={{}}
            />
          )}
        />
      )}
    </Paper>
  );
};
