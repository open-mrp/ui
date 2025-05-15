import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { fn } from "@storybook/test";

import Button from "./Button";

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

const meta = {
  component: Button,
  title: "Button",
  tags: ["autodocs"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    children: "Button",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Blur variant decorator
const blurDecorator = (Story: any) => (
  <div className="inline-block p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
    <Story />
  </div>
);

// Contained Variant Stories
export const ContainedPrimary: Story = {
  args: {
    variant: "contained",
    color: "primary",
    children: "Contained Primary",
  },
};

export const ContainedSecondary: Story = {
  args: {
    variant: "contained",
    color: "secondary",
    children: "Contained Secondary",
  },
};

export const ContainedGray: Story = {
  args: {
    variant: "contained",
    color: "gray",
    children: "Contained Gray",
  },
};

export const ContainedBlur: Story = {
  args: {
    variant: "contained",
    color: "blur",
    children: "Contained Blur",
  },
  decorators: [blurDecorator],
};

// Outlined Variant Stories
export const OutlinedPrimary: Story = {
  args: {
    variant: "outlined",
    color: "primary",
    children: "Outlined Primary",
  },
};

export const OutlinedSecondary: Story = {
  args: {
    variant: "outlined",
    color: "secondary",
    children: "Outlined Secondary",
  },
};

export const OutlinedGray: Story = {
  args: {
    variant: "outlined",
    color: "gray",
    children: "Outlined Gray",
  },
};

export const OutlinedBlur: Story = {
  args: {
    variant: "outlined",
    color: "blur",
    children: "Outlined Blur",
  },
  decorators: [blurDecorator],
};

// Text Variant Stories
export const TextPrimary: Story = {
  args: {
    variant: "text",
    color: "primary",
    children: "Text Primary",
  },
};

export const TextSecondary: Story = {
  args: {
    variant: "text",
    color: "secondary",
    children: "Text Secondary",
  },
};

export const TextGray: Story = {
  args: {
    variant: "text",
    color: "gray",
    children: "Text Gray",
  },
};

export const TextBlur: Story = {
  args: {
    variant: "text",
    color: "blur",
    children: "Text Blur",
  },
  decorators: [blurDecorator],
};

// Size Stories (using primary color as default)
export const SmallButton: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const DefaultButton: Story = {
  args: {
    size: "default",
    children: "Default Button",
  },
};

export const LargeButton: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const IconButton: Story = {
  args: {
    size: "icon",
    children: "🔍",
  },
};

// Disabled State
export const DisabledButton: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};
