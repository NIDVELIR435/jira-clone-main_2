import { shallow } from "enzyme";
import { CircularProgress } from "@mui/material";

import { Spinner } from "./spinner.component";

describe("UI", () => {
  describe("<Spinner />", () => {
    describe("Render", () => {
      it("Should render <div /> with spinner-wrapper class", () => {
        const spinnerWrapper = shallow(<Spinner />).find("div.spinner-wrapper");

        expect(spinnerWrapper).toHaveLength(1);
      });

      it("Should render <CircularProgress />", () => {
        const progress = shallow(<Spinner />).find(CircularProgress);

        expect(progress).toHaveLength(1);
      });
    });
  });
});
