import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DocCardGroup from "./DocCardGroup";

const meta = {
  component: DocCardGroup,
  title: "Docs/DocCardGroup",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock card component for demonstration
const MockCard = ({ title }: { title: string }) => (
  <div className="p-4 border rounded-lg bg-card">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2">
      This is a sample card content to demonstrate the grid layout.
    </p>
  </div>
);

// Single Card
export const SingleCard: Story = {
  args: {
    children: <MockCard title="Single Card" />,
  },
};

// Two Cards
export const TwoCards: Story = {
  args: {
    children: (
      <>
        <MockCard title="First Card" />
        <MockCard title="Second Card" />
      </>
    ),
  },
};

// Three Cards
export const ThreeCards: Story = {
  args: {
    children: (
      <>
        <MockCard title="First Card" />
        <MockCard title="Second Card" />
        <MockCard title="Third Card" />
      </>
    ),
  },
};

// Four Cards
export const FourCards: Story = {
  args: {
    children: (
      <>
        <MockCard title="First Card" />
        <MockCard title="Second Card" />
        <MockCard title="Third Card" />
        <MockCard title="Fourth Card" />
      </>
    ),
  },
};

// Six Cards
export const SixCards: Story = {
  args: {
    children: (
      <>
        <MockCard title="First Card" />
        <MockCard title="Second Card" />
        <MockCard title="Third Card" />
        <MockCard title="Fourth Card" />
        <MockCard title="Fifth Card" />
        <MockCard title="Sixth Card" />
      </>
    ),
  },
}; 