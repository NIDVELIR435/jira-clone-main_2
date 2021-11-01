import { shallow } from "enzyme";
import { Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { selectTasksLoading } from "state";

import { Status } from "common";

import { TasksBoardColumn } from "ui/components/tasks-board-column";
import { Spinner } from "ui/components/spinner";

import { TasksBoard } from "./tasks-board.component";

jest.mock("react-redux");
jest.mock("state");

describe("UI", () => {
  describe("<TasksBoard />", () => {
    const mockedIsLoading = false;

    const useSelectorMock = useSelector as jest.Mock;
    const selectTasksLoadingMock = selectTasksLoading as jest.Mock;

    beforeEach(() => {
      selectTasksLoadingMock.mockReturnValue(mockedIsLoading);
      useSelectorMock.mockImplementation((f: () => unknown) => f());
    });

    describe("Render", () => {
      describe("Wrapper", () => {
        it("Should render <Papper /> with tasks-board-wrapper class", () => {
          const wrapper = shallow(<TasksBoard />)
            .find(Paper)
            .find(".tasks-board-wrapper");

          expect(wrapper).toHaveLength(1);
        });
      });

      describe("Title", () => {
        it("Should render h3 <Typography />", () => {
          const title = shallow(<TasksBoard />)
            .find(Typography)
            .find({ variant: "h3" });

          expect(title).toHaveLength(1);
        });
      });

      describe("<Spinner />", () => {
        it("Should render <Spinner /> on loading=true", () => {
          selectTasksLoadingMock.mockReturnValue(true);

          const spinner = shallow(<TasksBoard />).find(Spinner);

          expect(spinner).toHaveLength(1);
        });

        it("Should not render <Spinner /> on loading=false", () => {
          selectTasksLoadingMock.mockReturnValue(false);

          const spinner = shallow(<TasksBoard />).find(Spinner);

          expect(spinner).toHaveLength(0);
        });
      });

      describe("Board", () => {
        describe("Loading", () => {
          it("Should not render <div /> with tasks-board class on loading=true", () => {
            selectTasksLoadingMock.mockReturnValue(true);

            const spinner = shallow(<TasksBoard />).find("div.tasks-board");

            expect(spinner).toHaveLength(0);
          });

          it("Should render <div /> with tasks-board class on loading=false", () => {
            selectTasksLoadingMock.mockReturnValue(false);

            const spinner = shallow(<TasksBoard />).find("div.tasks-board");

            expect(spinner).toHaveLength(1);
          });
        });

        it("Should render one <TasksBoardColumn /> for each status", () => {
          const tasksBoardStatuses = shallow(<TasksBoard />)
            .find(TasksBoardColumn)
            .map((tasksBoardColumnComponent) =>
              tasksBoardColumnComponent.props()
            )
            .map(({ status }) => status);

          const allStatusesSet = new Set(Object.values(Status));

          const eachStatusRendered = tasksBoardStatuses.every(
            (renderedStatus) => allStatusesSet.has(renderedStatus)
          );

          expect(eachStatusRendered).toStrictEqual(true);
        });
      });
    });
  });
});
