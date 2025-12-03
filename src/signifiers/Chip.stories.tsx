import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Chip from "./Chip";

const meta = {
  component: Chip,
  title: "Signifiers/Chip",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Chip (Medium)
export const Default: Story = {
  args: {
    children: "Default",
  },
};

// Size Variants
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

// Custom Styled Chip
export const CustomStyled: Story = {
  args: {
    children: "Custom",
    className: "bg-secondary-500 text-secondary-50",
  },
};

// Multiple Chips Example
export const MultipleChips: Story = {
  args: {
    children: "Default",
  },
  render: () => (
    <div className="flex gap-2 items-center">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

// Long Text Chip
export const LongText: Story = {
  args: {
    children: "This is a longer chip text example",
  },
};

// With Icon Example
export const WithIcon: Story = {
  args: {
    children: (
      <div className="flex items-center gap-1.5">
        <span className="text-[0.9em]">⭐</span>
        <span>Premium</span>
      </div>
    ),
  },
};
