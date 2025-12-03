import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const meta = {
  component: Breadcrumbs,
  title: "Breadcrumbs",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with simple navigation
export const Default: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Current Page" },
    ],
  },
};

// Deep navigation path
export const DeepNavigation: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Electronics", href: "/products/electronics" },
      { label: "Smartphones", href: "/products/electronics/smartphones" },
      { label: "iPhone 13" },
    ],
  },
};

// Custom separator
export const CustomSeparator: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Current Page" },
    ],
    renderSeparator: () => <span className="mx-2 text-text-secondary">→</span>,
  },
};

// Custom link rendering
export const CustomLinks: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Current Page" },
    ],
    renderLink: (crumb) => (
      <a
        href={crumb.href}
        className="text-sm hover:text-primary transition-colors"
      >
        {crumb.label}
      </a>
    ),
  },
};

// Single crumb
export const SingleCrumb: Story = {
  args: {
    crumbs: [{ label: "Home" }],
  },
};
