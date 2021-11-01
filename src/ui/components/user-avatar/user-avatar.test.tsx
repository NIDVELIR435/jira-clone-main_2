import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import { Skeleton, Tooltip, Avatar } from "@mui/material";
import ColorHash from "color-hash";

import { User } from "common";

import { selectUsersLoading, selectUserById } from "state";

import { UserAvatar } from "./user-avatar.component";
import * as userAvatarUtils from "./user-avatar.utils";

jest.mock("react-redux");
jest.mock("state");
jest.mock("color-hash");

describe("UI", () => {
  describe("<UserAvatar />", () => {
    const getMockedUser = (): User => ({
      id: 1,
      name: "John Doe",
    });
    const mockedIsLoading = false;

    const useSelectorMock = useSelector as jest.Mock;
    const selectUsersLoadingMock = selectUsersLoading as jest.Mock;
    const selectUserByIdMock = selectUserById as jest.Mock;
    const selectorUserByIdMock = jest.fn();

    beforeEach(() => {
      useSelectorMock.mockImplementation((f: () => unknown) => f());
      selectorUserByIdMock.mockReturnValue(getMockedUser());
      selectUserByIdMock.mockReturnValue(selectorUserByIdMock);
      selectUsersLoadingMock.mockReturnValue(mockedIsLoading);
    });

    describe("Render", () => {
      describe("<Skeleton />", () => {
        it("Should render <Skeleton /> with user-avatar class on loading", () => {
          selectUsersLoadingMock.mockReturnValue(true);

          const skeleton = shallow(<UserAvatar userId={getMockedUser().id} />)
            .find(Skeleton)
            .find(".user-avatar");

          expect(skeleton).toHaveLength(1);
        });

        it("Should not render <Skeleton /> with user-avatar class on loading", () => {
          selectUsersLoadingMock.mockReturnValue(false);

          const skeleton = shallow(<UserAvatar userId={getMockedUser().id} />)
            .find(Skeleton)
            .find(".user-avatar");

          expect(skeleton).toHaveLength(0);
        });
      });

      describe("<Tooltip />", () => {
        it("Should not render <Tooltip /> on loading", () => {
          selectUsersLoadingMock.mockReturnValue(true);

          const tooltip = shallow(
            <UserAvatar userId={getMockedUser().id} />
          ).find(Tooltip);

          expect(tooltip).toHaveLength(0);
        });

        it("Should render <Tooltip /> on loading", () => {
          selectUsersLoadingMock.mockReturnValue(false);

          const tooltip = shallow(
            <UserAvatar userId={getMockedUser().id} />
          ).find(Tooltip);

          expect(tooltip).toHaveLength(1);
        });

        describe("<Tooltip /> should have user name as value of title property title", () => {
          ["foo", "bar", "baz"].forEach((mockedUserName) => {
            const mockedUser = getMockedUser();
            mockedUser.name = mockedUserName;

            it(`User name: ${mockedUserName}`, () => {
              selectorUserByIdMock.mockReturnValue(mockedUser);

              const tooltip = shallow(
                <UserAvatar userId={getMockedUser().id} />
              )
                .find(Tooltip)
                .find({ title: mockedUserName });

              expect(tooltip).toHaveLength(1);
            });
          });
        });
      });

      describe("<Avatar />", () => {
        const stringAvatarSpy = jest.spyOn(
          userAvatarUtils,
          "stringAvatar"
        ) as jest.SpyInstance;

        beforeEach(() => {
          stringAvatarSpy.mockReturnValue({});
        });

        afterAll(() => {
          stringAvatarSpy.mockRestore();
        });

        it("Should not render <Avatar /> with user-avatar class on loading", () => {
          selectUsersLoadingMock.mockReturnValue(true);

          const avatar = shallow(<UserAvatar userId={getMockedUser().id} />)
            .find(Avatar)
            .find(".user-avatar");

          expect(avatar).toHaveLength(0);
        });

        it("Should render <Avatar /> with user-avatar class on loading", () => {
          selectUsersLoadingMock.mockReturnValue(false);

          const avatar = shallow(<UserAvatar userId={getMockedUser().id} />)
            .find(Avatar)
            .find(".user-avatar");

          expect(avatar).toHaveLength(1);
        });

        it("stringAvatar spy should be called with user name", () => {
          const mockedUser = getMockedUser();
          shallow(<UserAvatar userId={mockedUser.id} />);
          expect(stringAvatarSpy).toHaveBeenCalledWith(mockedUser.name);
        });

        describe("<Avatar /> should have mocked props from stringAvatar", () => {
          ["mockedProp1", "mockedProp2"].forEach((mockedProp) => {
            it(mockedProp, () => {
              stringAvatarSpy.mockReturnValue({ [mockedProp]: mockedProp });

              const props = shallow(<UserAvatar userId={getMockedUser().id} />)
                .find(Avatar)
                .find(".user-avatar")
                .props();

              expect(
                // @ts-expect-error: mocked prop
                props[mockedProp]
              ).toStrictEqual(mockedProp);
            });
          });
        });
      });
    });

    describe("Utils", () => {
      describe("stringAvatar", () => {
        const mockedHexColor = "MOCKED_HEX_COLOR";
        const ColorHashMock = ColorHash as jest.Mock;
        const hexHashMock = jest.fn();

        beforeEach(() => {
          ColorHashMock.mockImplementation(() => ({
            hex: hexHashMock,
          }));
          hexHashMock.mockImplementation(() => mockedHexColor);
        });

        describe("Result object shape", () => {
          it("Should have sx property", () => {
            const stringAvatarProps = userAvatarUtils.stringAvatar("");
            expect(stringAvatarProps.sx).toBeDefined();
          });

          it("Should have sx.bgcolor property", () => {
            const stringAvatarProps = userAvatarUtils.stringAvatar("");
            expect(stringAvatarProps.sx.bgcolor).toBeDefined();
          });

          it("Should have children", () => {
            const stringAvatarProps = userAvatarUtils.stringAvatar("");
            expect(stringAvatarProps.children).toBeDefined();
          });
        });

        describe("Should call hex mock with mocked name", () => {
          ["foo", "bar", "baz"].forEach((mockedName) => {
            hexHashMock.mockReturnValue("");

            it(`Name: ${mockedName}`, () => {
              userAvatarUtils.stringAvatar(mockedName);
              expect(hexHashMock).toHaveBeenCalledWith(mockedName);
            });
          });
        });

        it("sx.bgcolor should have mocked value", () => {
          const stringAvatarProps = userAvatarUtils.stringAvatar("");
          expect(stringAvatarProps.sx.bgcolor).toStrictEqual(mockedHexColor);
        });

        describe("Letters to display", () => {
          [
            ["Haskell Curry", "HC"],
            ["Albert Einstein", "AE"],
            ["Gvido van Rossum", "GV"],
            ["Bjarne Stroustrup", "BS"],
            ["Marti Odersky", "MO"],
            ["just_me", "J"],
            ["", ""],
            [undefined, ""],
          ].forEach(([name, expectedResult]) => {
            it(`"${name}" -> "${expectedResult}"`, () => {
              const stringAvatarProps = userAvatarUtils.stringAvatar(name);
              expect(stringAvatarProps.children).toStrictEqual(expectedResult);
            });
          });
        });
      });
    });
  });
});
