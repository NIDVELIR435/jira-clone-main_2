import { shallow, mount } from "enzyme";
import { ListItemText } from "@mui/material";
import { useSelector } from "react-redux";

import { Status, Task as TaskEntity } from "common";

import { setNextTaskState, useAppDispatch } from "state";

import { UserAvatar } from "ui/components/user-avatar";
import { getStatusDisplayName } from "ui/common";

import { Task } from "./task.component";
import { TaskType } from "./task.types";

jest.mock("react-redux");
jest.mock("ui/common");
jest.mock("state");

describe("UI", () => {
  describe("<Task />", () => {
    const getMockedTask = (): TaskEntity => ({
      id: 1,
      title: "Mocked task",
      userId: 1,
      status: Status.DONE,
    });
    const mockedStatusDisplayName = "MOCKED_DISPLAY_NAME";
    const mockedSetNextTaskAction = { type: "MOCKED_SET_NEXT_TASK_ACTION" };

    const getDefaultTaskComponent = (): JSX.Element => (
      <Task task={getMockedTask()} taskType={TaskType.FULL} />
    );

    const getStatusDisplayNameMock = getStatusDisplayName as jest.Mock;
    const useAppDispatchMock = useAppDispatch as jest.Mock;
    const setNextTaskStateMock = setNextTaskState as unknown as jest.Mock;

    const dispatchMock = jest.fn();

    beforeEach(() => {
      getStatusDisplayNameMock.mockReturnValue(mockedStatusDisplayName);
      useAppDispatchMock.mockReturnValue(dispatchMock);
      setNextTaskStateMock.mockReturnValue(mockedSetNextTaskAction);
    });

    describe("Render", () => {
      it("Should render <ListItem /> with task class", () => {
        const listItem = shallow(getDefaultTaskComponent()).find(".task");

        expect(listItem).toHaveLength(1);
      });

      describe("<UserAvatar />", () => {
        it("Should render <UserAvatar />", () => {
          const avatar = shallow(getDefaultTaskComponent()).find(UserAvatar);
          expect(avatar).toHaveLength(1);
        });

        describe("<UserAvatar /> userId", () => {
          [1, 3, 10, 1000].forEach((mockedUserId) => {
            const mockedTask = getMockedTask();
            mockedTask.userId = mockedUserId;

            it(`Should render <UserAvatar /> with user id ${mockedUserId}`, () => {
              const avatar = shallow(
                <Task task={mockedTask} taskType={TaskType.FULL} />
              )
                .find(UserAvatar)
                .find({ userId: mockedUserId });

              expect(avatar).toHaveLength(1);
            });
          });
        });
      });

      describe("Task title", () => {
        it("Should render <ListItemText /> with list-title class", () => {
          const taskTitle = shallow(getDefaultTaskComponent())
            .find(ListItemText)
            .find(".task-title");

          expect(taskTitle).toHaveLength(1);
        });

        describe("<ListItemText /> text", () => {
          ["foo", "bar", "baz"].forEach((mockedTitle) => {
            const mockedTask = getMockedTask();
            mockedTask.title = mockedTitle;

            it(`Should render <ListItemText /> with ${mockedTitle} primary property`, () => {
              const taskTitle = shallow(
                <Task task={mockedTask} taskType={TaskType.FULL} />
              )
                .find(ListItemText)
                .find({ primary: mockedTitle });

              expect(taskTitle).toHaveLength(1);
            });
          });
        });
      });

      describe("Task status", () => {
        describe("By task type", () => {
          it("Should not render task-status if task type is short", () => {
            const status = shallow(
              <Task task={getMockedTask()} taskType={TaskType.SHORT} />
            )
              .find(ListItemText)
              .find(".task-status");

            expect(status).toHaveLength(0);
          });

          it("Should render task-status if task type is short", () => {
            const status = shallow(
              <Task task={getMockedTask()} taskType={TaskType.FULL} />
            )
              .find(ListItemText)
              .find(".task-status");

            expect(status).toHaveLength(1);
          });
        });

        describe("Text", () => {
          describe("Should pass mocked status to getStatusDisplayNameMock", () => {
            (["foo", "bar", "baz"] as unknown as Status[]).forEach(
              (mockedStatus) => {
                const mockedTaskEntity = getMockedTask();
                mockedTaskEntity.status = mockedStatus;

                it(mockedStatus, () => {
                  shallow(
                    <Task task={mockedTaskEntity} taskType={TaskType.FULL} />
                  );

                  expect(getStatusDisplayNameMock).toBeCalledWith(mockedStatus);
                });
              }
            );
          });

          it("Should render status with mocked status display name", () => {
            const status = shallow(getDefaultTaskComponent())
              .find(ListItemText)
              .find({ primary: mockedStatusDisplayName });

            expect(status).toHaveLength(1);
          });
        });
      });
    });

    describe("Actions", () => {
      const mockedUser = {};
      const useSelectorMock = useSelector as jest.Mock;

      beforeEach(() => {
        useSelectorMock.mockReturnValue(mockedUser);
      });

      it("useAppDispatch mock should be called", () => {
        shallow(getDefaultTaskComponent());
        expect(useAppDispatchMock).toHaveBeenCalled();
      });

      describe("Set next task status", () => {
        describe("setNextTaskStatus should be called with task id", () => {
          [1, 3, 10, 1000].forEach((mockedTaskId) => {
            const mockedTaskEntity = getMockedTask();
            mockedTaskEntity.id = mockedTaskId;

            it(`Task id: ${mockedTaskId}`, () => {
              mount(<Task task={mockedTaskEntity} taskType={TaskType.FULL} />)
                .find("li.task")
                .simulate("click");

              expect(setNextTaskStateMock).toHaveBeenCalledWith(mockedTaskId);
            });
          });
        });

        it("dispatch mock should be called with mockedSetNextTaskAction", () => {
          mount(getDefaultTaskComponent()).find("li.task").simulate("click");

          expect(dispatchMock).toHaveBeenCalledWith(mockedSetNextTaskAction);
        });
      });
    });
  });
});
