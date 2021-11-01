import { shallow } from "enzyme";
import { useSelector } from "react-redux";

import { Status, Task as TaskEntity } from "common";

import { selectTasksWithStatus } from "state";

import { getStatusDisplayName } from "ui/common";
import { Task, TaskType } from "ui/components/task";

import { TasksBoardColumn } from "./tasks-board-column.component";
import { List, Typography } from "@mui/material";

jest.mock("react-redux");
jest.mock("state");
jest.mock("ui/common");

describe("UI", () => {
  describe("<TasksBoardColumn />", () => {
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
    ];
    const mockedStatusDisplayName = "MOCKED_STATUS_DISPLAY_NAME";

    const useSelectorMock = useSelector as jest.Mock;
    const selectTasksWithStatusMock = selectTasksWithStatus as jest.Mock;
    const getStatusDisplayNameMock = getStatusDisplayName as jest.Mock;

    const getDefaultTasksBoardColumn = () => (
      <TasksBoardColumn status={Status.TODO} />
    );

    beforeEach(() => {
      useSelectorMock.mockImplementation((f: () => unknown) => f());
      selectTasksWithStatusMock.mockReturnValue(() => mockedTasks);
      getStatusDisplayNameMock.mockReturnValue(mockedStatusDisplayName);
    });

    describe("Render", () => {
      it("Should render <div /> with tasks-board-column-wrapper class", () => {
        const wrapper = shallow(getDefaultTasksBoardColumn()).find(
          "div.tasks-board-column-wrapper"
        );

        expect(wrapper).toHaveLength(1);
      });

      describe("Title", () => {
        it("Should render <Typography /> with tasks-board-column-title class", () => {
          const title = shallow(getDefaultTasksBoardColumn())
            .find(Typography)
            .find(".tasks-board-column-title");

          expect(title).toHaveLength(1);
        });

        it("<Typography /> h4 as value of variant property", () => {
          const title = shallow(getDefaultTasksBoardColumn())
            .find(Typography)
            .find({ variant: "h4" });

          expect(title).toHaveLength(1);
        });

        describe("getStatusDisplayNameMock should be called with status", () => {
          (["foo", "bar", "baz"] as unknown as Status[]).forEach(
            (mockedStatus) => {
              it(`Status: ${mockedStatus}`, () => {
                shallow(<TasksBoardColumn status={mockedStatus} />);
                expect(getStatusDisplayNameMock).toHaveBeenCalledWith(
                  mockedStatus
                );
              });
            }
          );
        });

        it("<Typography /> should have mockedStatusDisplayName as content", () => {
          const title = shallow(getDefaultTasksBoardColumn())
            .find(Typography)
            .find(".tasks-board-column-title")
            .text();

          expect(title).toStrictEqual(mockedStatusDisplayName);
        });
      });

      describe("<List />", () => {
        it("Should render <List /> with tasks-board-column-list class", () => {
          const list = shallow(getDefaultTasksBoardColumn())
            .find(List)
            .find(".tasks-board-column-list");

          expect(list).toHaveLength(1);
        });
      });

      describe("Tasks", () => {
        it("Should render all <Task /> for each task", () => {
          const tasks = shallow(getDefaultTasksBoardColumn())
            .find(Task)
            .map((taskComponent) => taskComponent.props())
            .map(({ task }) => task);

          expect(tasks).toStrictEqual(mockedTasks);
        });

        it("Each <Task /> should have short type", () => {
          const allTypesAreShort = shallow(getDefaultTasksBoardColumn())
            .find(Task)
            .map((taskComponent) => taskComponent.props())
            .map(({ taskType }) => taskType)
            .every((type) => type === TaskType.SHORT);

          expect(allTypesAreShort).toStrictEqual(true);
        });
      });
    });
  });
});
