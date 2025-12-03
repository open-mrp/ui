import InlineCode from "@/code/InlineCode";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DocHeroSection from "./DocHeroSection";

const meta = {
  component: DocHeroSection,
  title: "Docs/DocHeroSection",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocHeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple Text Content
export const SimpleText: Story = {
  args: {
    children: "Welcome to our documentation",
  },
};

// With Heading
export const WithHeading: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use our product effectively
        </p>
      </div>
    ),
  },
};

// With Multiple Elements
export const WithMultipleElements: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Advanced Features</h1>
        <p className="text-lg text-muted-foreground">
          Discover the power of our advanced features
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-md">
            Get Started
          </button>
          <button className="px-4 py-2 border rounded-md">Learn More</button>
        </div>
      </div>
    ),
  },
};

// With Code Example
export const WithCodeExample: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Quick Start</h1>
        <p className="text-lg text-muted-foreground">
          Install and run in minutes
        </p>
        <InlineCode>npm install my-package</InlineCode>
      </div>
    ),
  },
};

// With Image
export const WithImage: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Visual Guide</h1>
        <p className="text-lg text-muted-foreground">See it in action</p>
      </div>
    ),
  },
};
