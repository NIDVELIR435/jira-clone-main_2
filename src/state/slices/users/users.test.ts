import _ from "lodash";
import { Action } from "@reduxjs/toolkit";

import { getAllUsers } from "apis/jsonplaceholder";

import { User } from "common";

import { store } from "state/store";
import { RootState } from "state/types";

import { selectUsersLoading, selectUserById } from "./users.selectors";
import { fetchUsers, usersReducer, UsersState } from "./users.slice";

jest.mock("apis/jsonplaceholder");

describe("State", () => {
  describe("Users", () => {
    const getAllUsersMock = getAllUsers as jest.Mock;

    const getMockedGetAllUsersResponse = (): Array<User> => [
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Doe",
      },
    ];

    const getMockedInitialState = (): UsersState => ({
      entities: {},
      loading: true,
    });

    const getMockedLoadedState = (): UsersState => {
      const initialState = getMockedInitialState();

      initialState.entities = _.keyBy(getMockedGetAllUsersResponse(), "id");
      initialState.loading = false;

      return initialState;
    };

    const getMockedLoadedRootState = (): RootState =>
      ({
        users: getMockedLoadedState(),
      } as RootState);

    beforeEach(() => {
      getAllUsersMock.mockResolvedValue(getMockedGetAllUsersResponse());
    });

    describe("Slice", () => {
      describe("Initial state", () => {
        it("Should set initial state", () => {
          const initialState = usersReducer(undefined, {} as Action);

          expect(initialState).toStrictEqual(getMockedInitialState());
        });
      });

      describe("Users fetching", () => {
        it("getAllUsersMock should be called", async () => {
          await store.dispatch(fetchUsers());
          expect(getAllUsersMock).toHaveBeenCalled();
        });

        it("Should set loaded state", async () => {
          const loadedState = usersReducer(
            undefined,
            await store.dispatch(fetchUsers())
          );
          expect(loadedState).toStrictEqual(getMockedLoadedState());
        });
      });
    });
    describe("Selectors", () => {
      describe("Select users loading", () => {
        [true, false].forEach((isLoading) => {
          const state = getMockedLoadedRootState();
          state.users.loading = isLoading;

          it(`Should select users loading while it is ${isLoading}`, () => {
            const selectorResult = selectUsersLoading(state);
            expect(selectorResult).toStrictEqual(isLoading);
          });
        });
      });

      describe("Select user by id", () => {
        const state = getMockedLoadedRootState();

        [1, 2].forEach((id) => {
          it(`Should select user with id ${id}`, () => {
            const selectorResult = selectUserById(id)(state);
            expect(selectorResult.id).toStrictEqual(id);
          });
        });
      });
    });
  });
});
