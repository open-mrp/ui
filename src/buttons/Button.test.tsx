import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import userEvent from "@testing-library/user-event";

import Button from "./Button";

describe("Button", () => {
  test("renders the Button component with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary-500"); // Default contained primary style
  });

  test("renders different variants correctly", () => {
    const { rerender } = render(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-primary-100");

    rerender(<Button variant="text">Text</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-primary-500");
  });

  test("renders different colors correctly", () => {
    const { rerender } = render(<Button color="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary-500");

    rerender(<Button color="gray">Gray</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-500");

    rerender(<Button color="blur">Blur</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-white/10");
  });

  test("renders different sizes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-xs");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-base");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("p-2");
  });

  test("handles disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-700/50");
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  test("handles click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not trigger click events when disabled", async () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
