import { getAllTasks } from "./tasks";
import { getAllUsers } from "./users";

import { jsonplaceholderClient } from "apis/jsonplaceholder/common";
import {
  getAllUsersSchema,
  getAllTasksSchema,
} from "schemas/apis/jsonplaceholder";

jest.mock("apis/jsonplaceholder/common", () => ({
  jsonplaceholderClient: {
    get: jest.fn(),
  },
}));
jest.mock("schemas/apis/jsonplaceholder");

describe("Apis", () => {
  describe("Jsonplaceholder", () => {
    const schemaParseMock = jest.fn();
    const getAllUsersSchemaMock = getAllUsersSchema as unknown as jest.Mock;
    const getAllTasksSchemaMock = getAllTasksSchema as unknown as jest.Mock;
    const jsonplaceholderClientGetMock =
      jsonplaceholderClient.get as unknown as jest.Mock;

    const axiosResponseMock = {
      data: ["SOME TEST DATA"],
    };

    beforeEach(() => {
      schemaParseMock.mockImplementation(async (x) => x);
      getAllTasksSchemaMock.mockReturnValue({
        parseAsync: schemaParseMock,
      });
      getAllUsersSchemaMock.mockReturnValue({
        parseAsync: schemaParseMock,
      });
      jsonplaceholderClientGetMock.mockResolvedValue(axiosResponseMock);
    });

    describe("Tasks", () => {
      it("Should return mocked data", async () => {
        const tasks = await getAllTasks();
        expect(tasks).toStrictEqual(axiosResponseMock.data);
      });

      it("Should call jsonplaceholderClient.get with '/todos' uri", async () => {
        await getAllTasks();
        expect(jsonplaceholderClientGetMock).toHaveBeenCalledWith("/todos");
      });
    });

    describe("Users", () => {
      it("Should return mocked data", async () => {
        const users = await getAllUsers();
        expect(users).toStrictEqual(axiosResponseMock.data);
      });

      it("Should call jsonplaceholderClient.get with '/users' uri", async () => {
        await getAllUsers();
        expect(jsonplaceholderClientGetMock).toHaveBeenCalledWith("/users");
      });
    });
  });
});
