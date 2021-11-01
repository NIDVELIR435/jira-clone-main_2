import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import { List, Paper, Typography } from "@mui/material";

import { selectAllTasks, selectTasksLoading } from "state";

import { Status, Task as TaskEntity } from "common";

import { Task, TaskType } from "ui/components/task";
import { Spinner } from "ui/components/spinner";

import { TasksList } from "./tasks-list.component";

jest.mock("react-redux");
jest.mock("state");

describe("UI", () => {
  const useSelectorMock = useSelector as jest.Mock;
  const selectAllTasksMock = selectAllTasks as jest.Mock;
  const selectTasksLoadingMock = selectTasksLoading as jest.Mock;

  const mockedTasks: Array<TaskEntity> = [
    {
      id: 1,
      title: "1",
      userId: 1,
      status: Status.TODO,
    },
    {
      id: 2,
      title: "2",
      userId: 1,
      status: Status.TODO,
    },
    {
      id: 3,
      title: "3",
      userId: 1,
      status: Status.TODO,
    },
  ];

  const mockedLoading = false;

  beforeEach(() => {
    useSelectorMock.mockImplementation((f: () => unknown) => f());
    selectAllTasksMock.mockReturnValue(mockedTasks);
    selectTasksLoadingMock.mockReturnValue(mockedLoading);
  });

  describe("<TasksList />", () => {
    describe("Render", () => {
      it("Should render <Paper /> with tasks-list-wrapper class", () => {
        const paper = shallow(<TasksList />)
          .find(Paper)
          .find(".tasks-list-wrapper");

        expect(paper).toHaveLength(1);
      });

      it("Shou render <Typography /> with h3 in variant property", () => {
        const title = shallow(<TasksList />).find(Typography);
        expect(title).toHaveLength(1);
      });

      describe("Loader", () => {
        it("Should render <Spinner /> if tasks are loading", () => {
          selectTasksLoadingMock.mockReturnValue(true);

          const loader = shallow(<TasksList />).find(Spinner);

          expect(loader).toHaveLength(1);
        });

        it("Should not render <Spinner /> if tasks are loading", () => {
          selectTasksLoadingMock.mockReturnValue(false);

          const loader = shallow(<TasksList />).find(Spinner);

          expect(loader).toHaveLength(0);
        });
      });

      describe("List", () => {
        it("Should render <List /> with tasks-list class", () => {
          const list = shallow(<TasksList />)
            .find(List)
            .find(".tasks-list");
          expect(list).toHaveLength(0);
        });

        describe("Loading", () => {
          it("Should not render <List /> if tasks are loading", () => {
            selectTasksLoadingMock.mockReturnValue(true);

            const loader = shallow(<TasksList />).find(List);

            expect(loader).toHaveLength(0);
          });

          it("Should render <List /> if tasks are loading", () => {
            selectTasksLoadingMock.mockReturnValue(false);

            const loader = shallow(<TasksList />).find(List);

            expect(loader).toHaveLength(0);
          });
        });

        describe("Tasks", () => {
          describe("Should render all tasks", () => {
            const tasksIds = mockedTasks.map(({ id }) => id);

            tasksIds.forEach((taskId) => {
              const taskEntity = mockedTasks.find(({ id }) => id === taskId);

              it("Should render <Task /> with task entity as task property", () => {
                const task = shallow(<TasksList />)
                  .find(Task)
                  .find({ task: taskEntity });
                expect(task).toHaveLength(0);
              });
            });
          });

          it("All tasks should have type full", () => {
            const allTasksAreFull = shallow(<TasksList />)
              .find(Task)
              .map((task) => task.props())
              .map(({ taskType }) => taskType)
              .every((type) => type === TaskType.FULL);

            expect(allTasksAreFull).toStrictEqual(true);
          });
        });
      });
    });
  });
});
