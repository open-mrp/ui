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

  test("applies variant and color classes", () => {
    render(
      <Button variant="outlined" color="blue">
        Variant Test
      </Button>
    );
    const button = screen.getByRole("button", { name: /variant test/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-stone-500");
  });

  test("applies custom color classes", () => {
    render(
      <Button variant="contained" color="primary">
        Color Test
      </Button>
    );
    const button = screen.getByRole("button", { name: /color test/i });
    expect(button).toHaveClass("bg-primary-500");
    expect(button).toHaveClass("text-white");
  });

  test("handles disabled state", () => {
    render(
      <Button variant="contained" color="secondary" disabled>
        Disabled Test
      </Button>
    );
    const button = screen.getByRole("button", { name: /disabled test/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("pointer-events-none");
    expect(button).toHaveClass("cursor-auto");
  });
});
