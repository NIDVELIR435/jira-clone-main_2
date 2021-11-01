import _ from "lodash";
import { AnyAction } from "@reduxjs/toolkit";

import { getAllTasks } from "apis/jsonplaceholder";
import { store } from "state";
import { Id, Status, Task } from "common";
import { RootState } from "state/types";

import {
  fetchTasks,
  setNextTaskState,
  tasksReducer,
  TasksState,
} from "./tasks.slice";
import {
  selectAllTasks,
  selectTaskById,
  selectTasksWithStatus,
  selectTasksLoading,
} from "./tasts.selectors";
import { getNextStatus } from "./tasks.utils";
import * as tasksUtils from "./tasks.utils";

jest.mock("apis/jsonplaceholder");

describe("State", () => {
  describe("Tasks", () => {
    const getMockedGetAllTasksResponse = (): Array<Task> => [
      {
        id: 1,
        userId: 1,
        title: "foo",
        status: Status.TODO,
      },
      {
        id: 2,
        userId: 1,
        title: "bar",
        status: Status.TODO,
      },
      {
        id: 3,
        userId: 1,
        title: "baz",
        status: Status.TODO,
      },
    ];

    const getMockedInitialState = (): TasksState => ({
      entities: {},
      loading: true,
    });

    const getMockedLoadedState = (): TasksState => {
      const initialState = getMockedInitialState();
      initialState.entities = _.keyBy(
        getMockedGetAllTasksResponse(),
        ({ id }) => id
      );
      initialState.loading = false;
      return initialState;
    };

    const getAllTasksMock = getAllTasks as unknown as jest.Mock;

    beforeEach(() => {
      getAllTasksMock.mockResolvedValue(getMockedGetAllTasksResponse());
    });

    describe("Slice", () => {
      it("Should set initial state", () => {
        const state = tasksReducer(undefined, {} as AnyAction);

        expect(state).toStrictEqual(getMockedInitialState());
      });

      describe("Fetch tasks", () => {
        it("getAllTasks mock should be called", async () => {
          await store.dispatch(fetchTasks());

          expect(getAllTasksMock).toHaveBeenCalled();
        });

        it("Should set tasks state like mocked state", async () => {
          const state = tasksReducer(
            undefined,
            await store.dispatch(fetchTasks())
          );

          expect(state).toStrictEqual(getMockedLoadedState());
        });
      });

      describe("Change status", () => {
        let mockedState: TasksState;
        let taskId: Id;
        let getNextStatusSpy: jest.SpyInstance;
        const mockedStatus = "STATUS MOCK" as Status;

        beforeEach(() => {
          mockedState = getMockedLoadedState();
          taskId = Object.keys(mockedState.entities)[0];
          getNextStatusSpy = jest
            .spyOn(tasksUtils, "getNextStatus")
            .mockReturnValue(mockedStatus);
        });

        afterAll(() => {
          getNextStatusSpy.mockRestore();
        });

        it("getNextStatusMock should be called", () => {
          tasksReducer(mockedState, setNextTaskState(taskId));

          expect(getNextStatusSpy).toHaveBeenCalledTimes(1);
        });

        it("Should not change state if invalid task id provided", () => {
          const invalidTaskId = "invalidTaskId";

          expect(Object.keys(mockedState.entities)).not.toContain(
            invalidTaskId
          );

          const nextState = tasksReducer(
            mockedState,
            setNextTaskState(invalidTaskId)
          );

          expect(nextState).toStrictEqual(mockedState);
        });

        it("Should set mocked task state", () => {
          const nextState = tasksReducer(mockedState, setNextTaskState(taskId));

          expect(nextState.entities[taskId].status).toStrictEqual(mockedStatus);
        });
      });
    });

    describe("Selectors", () => {
      const getMockedTasks = (): Array<Task> => [
        {
          id: 20,
          userId: 1,
          title: "foo",
          status: Status.TODO,
        },
        {
          id: 0,
          userId: 1,
          title: "bar",
          status: Status.IN_PROGRESS,
        },
        {
          id: 19,
          userId: 1,
          title: "baz",
          status: Status.DONE,
        },
      ];

      const getState = (orderedTasks: Array<Task>) => ({
        tasks: {
          loading: false,
          entities: _.keyBy(orderedTasks, "id"),
        },
      });

      describe("Select tasks by id", () => {
        describe("Should select task by provided id", () => {
          const tasks = getMockedTasks();
          const state = getState(tasks) as RootState;

          tasks.forEach(({ id }) => {
            it(`Tash id: ${id}`, () => {
              const selectorResult = selectTaskById(id)(state);

              expect(selectorResult.id).toStrictEqual(id);
            });
          });
        });
      });

      describe("Get all tasks", () => {
        describe("Should return tasks in order of status TODO -> IN_PROGRESS -> DONE", () => {
          const tasks = getMockedTasks();
          [
            [tasks[1], tasks[0], tasks[2]],
            [tasks[2], tasks[0], tasks[1]],
            [tasks[2], tasks[1], tasks[0]],
          ].forEach((orderedTasks: Array<Task>) => {
            const testTitle = `while current is ${orderedTasks
              .map(({ status }) => status)
              .join(" -> ")}`;

            it(testTitle, () => {
              const state = getState(orderedTasks) as RootState;
              const selectorResult = selectAllTasks(state);
              expect(selectorResult).toEqual(getMockedTasks());
            });
          });
        });
      });

      describe("Get tasks by status", () => {
        const tasks = getMockedTasks();
        const state = getState(tasks) as RootState;
        Object.values(Status).forEach((status) => {
          it(status, () => {
            const selectorResult = selectTasksWithStatus(status)(state);

            expect(selectorResult).toHaveLength(1);
            expect(selectorResult[0].status).toStrictEqual(status);
          });
        });
      });

      describe("Select tasks loading status", () => {
        [true, false].forEach((isLoading) => {
          const tasks = getMockedTasks();
          const state = getState(tasks) as RootState;
          state.tasks.loading = isLoading;

          it(`Should return loading when it is ${isLoading}`, () => {
            const selectorResult = selectTasksLoading(state);
            expect(selectorResult).toStrictEqual(isLoading);
          });
        });
      });
    });

    describe("Utils", () => {
      describe("Get next status", () => {
        [
          [Status.TODO, Status.IN_PROGRESS],
          [Status.IN_PROGRESS, Status.DONE],
          [Status.DONE, Status.TODO],
        ].forEach(([currentStatus, nextExpectedStatus]) => {
          it(`Should get ${nextExpectedStatus} if current is ${currentStatus}`, () => {
            const nextStatus = getNextStatus(currentStatus);
            expect(nextStatus).toStrictEqual(nextExpectedStatus);
          });
        });
      });
    });
  });
});
