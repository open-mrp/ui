import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LinkButton from "./LinkButton";

// Mock the next/link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  );
});

describe("LinkButton", () => {
  it("renders with correct href", () => {
    render(<LinkButton href="/test">Click me</LinkButton>);
    const link = screen.getByTestId("mock-link");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders children correctly", () => {
    render(<LinkButton href="/test">Test Button</LinkButton>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("passes additional button props correctly", () => {
    render(
      <LinkButton href="/test" variant="contained" size="lg">
        Test Button
      </LinkButton>
    );
    const button = screen.getByText("Test Button");
    // Check for base styles
    expect(button).toHaveClass("inline-flex");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    // Check for size classes
    expect(button).toHaveClass("px-6");
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("text-base");
    // Check for variant classes (contained primary by default)
    expect(button).toHaveClass("bg-primary-500");
    expect(button).toHaveClass("text-primary-50");
  });

  it("renders with default button props when not specified", () => {
    render(<LinkButton href="/test">Test Button</LinkButton>);
    const button = screen.getByText("Test Button");
    expect(button).toBeInTheDocument();
  });
});
