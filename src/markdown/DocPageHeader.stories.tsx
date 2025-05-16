import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DocPageHeader from "./DocPageHeader";

const meta = {
  component: DocPageHeader,
  title: "Docs/DocPageHeader",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Header
export const Default: Story = {
  args: {
    title: "Getting Started",
    subtitle: "Learn the basics of our product",
  },
};

// Short Title and Subtitle
export const ShortContent: Story = {
  args: {
    title: "Install",
    subtitle: "Quick setup guide",
  },
};

// Long Title and Subtitle
export const LongContent: Story = {
  args: {
    title: "Advanced Configuration and Customization Options",
    subtitle: "Learn how to customize every aspect of the application to match your specific requirements and workflow",
  },
};

// Technical Title
export const TechnicalTitle: Story = {
  args: {
    title: "API Reference",
    subtitle: "Complete documentation of all available endpoints and methods",
  },
};

// Feature Title
export const FeatureTitle: Story = {
  args: {
    title: "Real-time Collaboration",
    subtitle: "Work together with your team in real-time with our powerful collaboration features",
  },
};

// Multiple Headers
export const MultipleHeaders: Story = {
  render: () => (
    <div className="space-y-8">
      <DocPageHeader
        title="Introduction"
        subtitle="Welcome to our documentation"
      />
      <DocPageHeader
        title="Quick Start"
        subtitle="Get up and running in minutes"
      />
      <DocPageHeader
        title="Advanced Topics"
        subtitle="Deep dive into advanced features and concepts"
      />
    </div>
  ),
  args: {
    title: "Introduction",
    subtitle: "Welcome to our documentation",
  },
}; 