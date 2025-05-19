import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";

import Button from "./Button";

describe("Button", () => {
  test("renders the Button component with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
