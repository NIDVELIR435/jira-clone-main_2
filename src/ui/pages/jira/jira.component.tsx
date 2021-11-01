import React, { useEffect } from "react";
import { Container } from "@mui/material";

import { useAppDispatch, fetchUsers, fetchTasks } from "state";

import { TasksBoard } from "ui/components/tasks-board";
import { TasksList } from "ui/components/tasks-list";

import "./jira.scss";

export const Jira: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, []);

  return (
    <Container className="jira-page">
      <TasksList />
      <TasksBoard />
    </Container>
  );
};
