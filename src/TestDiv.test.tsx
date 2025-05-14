import { render } from "@testing-library/react";
import React from "react";

import TestDiv from "./TestDiv";

describe("TestDiv", () => {
  test("renders the TestDiv component", () => {
    render(<TestDiv />);
  });
});
