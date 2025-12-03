import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DocHeading from "./DocHeading";

const meta = {
  component: DocHeading,
  title: "Docs/DocHeading",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Heading (Level 2)
export const Default: Story = {
  args: {
    children: "Default Heading",
  },
};

// Different Heading Levels
export const Level1: Story = {
  args: {
    children: "Level 1 Heading",
    level: 1,
  },
};

export const Level2: Story = {
  args: {
    children: "Level 2 Heading",
    level: 2,
  },
};

export const Level3: Story = {
  args: {
    children: "Level 3 Heading",
    level: 3,
  },
};

export const Level4: Story = {
  args: {
    children: "Level 4 Heading",
    level: 4,
  },
};

export const Level5: Story = {
  args: {
    children: "Level 5 Heading",
    level: 5,
  },
};

export const Level6: Story = {
  args: {
    children: "Level 6 Heading",
    level: 6,
  },
};

// All Levels Example
export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <DocHeading level={1}>Level 1 Heading</DocHeading>
      <DocHeading level={2}>Level 2 Heading</DocHeading>
      <DocHeading level={3}>Level 3 Heading</DocHeading>
      <DocHeading level={4}>Level 4 Heading</DocHeading>
      <DocHeading level={5}>Level 5 Heading</DocHeading>
      <DocHeading level={6}>Level 6 Heading</DocHeading>
    </div>
  ),
  args: {
    children: "Level 1 Heading",
    level: 1,
  },
};

// With Number
export const WithNumber: Story = {
  args: {
    children: "Numbered Heading",
    number: 1,
  },
};

// Multiple Numbered Headings
export const MultipleNumbered: Story = {
  args: {
    children: "First Section",
    number: 1,
  },
  render: () => (
    <div className="space-y-4">
      <DocHeading number={1}>First Section</DocHeading>
      <DocHeading number={2}>Second Section</DocHeading>
      <DocHeading number={3}>Third Section</DocHeading>
    </div>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  args: {
    children: "Custom Styled Heading",
    className: "text-primary-500",
  },
};

// Long Text
export const LongText: Story = {
  args: {
    children: "This is a very long heading that might wrap to multiple lines",
  },
};
