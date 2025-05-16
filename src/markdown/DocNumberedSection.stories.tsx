import InlineCode from "@/code/InlineCode";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import DocNumberedSection from "./DocNumberedSection";

const meta = {
  component: DocNumberedSection,
  title: "Docs/DocNumberedSection",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocNumberedSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple Text Content
export const SimpleText: Story = {
  args: {
    number: 1,
    title: "Introduction",
    children: "Welcome to our documentation. This section provides an overview of the key features.",
  },
};

// With Multiple Paragraphs
export const WithMultipleParagraphs: Story = {
  args: {
    number: 2,
    title: "Getting Started",
    children: (
      <div className="space-y-4">
        <p>
          To begin using our product, you'll need to follow these simple steps.
          First, make sure you have all the prerequisites installed.
        </p>
        <p>
          Then, you can proceed with the installation process. We'll guide you
          through each step of the way.
        </p>
      </div>
    ),
  },
};

// With Code Example
export const WithCodeExample: Story = {
  args: {
    number: 3,
    title: "Installation",
    children: (
      <div className="space-y-4">
        <p>Install the package using npm:</p>
        <InlineCode>npm install my-package</InlineCode>
        <p>Or using yarn:</p>
        <InlineCode>yarn add my-package</InlineCode>
      </div>
    ),
  },
};

// With List
export const WithList: Story = {
  args: {
    number: 4,
    title: "Features",
    children: (
      <div className="space-y-4">
        <p>Our product includes the following features:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Easy to use interface</li>
          <li>Advanced customization options</li>
          <li>Real-time updates</li>
          <li>Cross-platform support</li>
        </ul>
      </div>
    ),
  },
};

// Multiple Sections
export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-4">
      <DocNumberedSection
        number={1}
        title="First Section"
      >
        <p>This is the content of the first section.</p>
      </DocNumberedSection>
      <DocNumberedSection
        number={2}
        title="Second Section"
      >
        <p>This is the content of the second section.</p>
      </DocNumberedSection>
      <DocNumberedSection
        number={3}
        title="Third Section"
      >
        <p>This is the content of the third section.</p>
      </DocNumberedSection>
    </div>
  ),
  args: {
    number: 1,
    title: "First Section",
    children: <p>This is the content of the first section.</p>,
  },
};

// Custom Styled
export const CustomStyled: Story = {
  args: {
    number: 5,
    title: "Custom Styled Section",
    className: "border-primary-500/20",
    children: (
      <div className="space-y-4">
        <p className="text-primary-500">
          This section has custom styling applied to it.
        </p>
        <p>
          You can customize the appearance using the className prop.
        </p>
      </div>
    ),
  },
}; 