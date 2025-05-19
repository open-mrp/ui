import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DarkModeButton from "./DarkModeButton";

const meta = {
  component: DarkModeButton,
  title: "DarkModeButton",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DarkModeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Icon variant (default)
export const IconVariant: Story = {
  args: {
    variant: "icon",
  },
};

// Outlined variant
export const OutlinedVariant: Story = {
  args: {
    variant: "outlined",
  },
};

// With custom className
export const WithCustomClassName: Story = {
  args: {
    variant: "icon",
    className: "w-12 h-12",
  },
};
