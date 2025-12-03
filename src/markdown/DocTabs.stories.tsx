import InlineCode from "@/code/InlineCode";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DocTab from "./DocTab";
import DocTabs from "./DocTabs";

const meta = {
  component: DocTabs,
  title: "Docs/DocTabs",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Tabs
export const Basic: Story = {
  args: {
    children: (
      <>
        <DocTab label="Overview">
          <p>This is the overview content.</p>
        </DocTab>
        <DocTab label="Details">
          <p>This is the details content.</p>
        </DocTab>
        <DocTab label="Settings">
          <p>This is the settings content.</p>
        </DocTab>
      </>
    ),
  },
  render: () => (
    <DocTabs>
      <DocTab label="Overview">
        <p>This is the overview content.</p>
      </DocTab>
      <DocTab label="Details">
        <p>This is the details content.</p>
      </DocTab>
      <DocTab label="Settings">
        <p>This is the settings content.</p>
      </DocTab>
    </DocTabs>
  ),
};

// Code Examples
export const CodeExamples: Story = {
  args: {
    children: (
      <>
        <DocTab label="JavaScript">
          <div className="space-y-4">
            <p>Install using npm:</p>
            <InlineCode>npm install my-package</InlineCode>
          </div>
        </DocTab>
        <DocTab label="TypeScript">
          <div className="space-y-4">
            <p>Install with TypeScript support:</p>
            <InlineCode>npm install my-package @types/my-package</InlineCode>
          </div>
        </DocTab>
        <DocTab label="Python">
          <div className="space-y-4">
            <p>Install using pip:</p>
            <InlineCode>pip install my-package</InlineCode>
          </div>
        </DocTab>
      </>
    ),
  },
  render: () => (
    <DocTabs>
      <DocTab label="JavaScript">
        <div className="space-y-4">
          <p>Install using npm:</p>
          <InlineCode>npm install my-package</InlineCode>
        </div>
      </DocTab>
      <DocTab label="TypeScript">
        <div className="space-y-4">
          <p>Install with TypeScript support:</p>
          <InlineCode>npm install my-package @types/my-package</InlineCode>
        </div>
      </DocTab>
      <DocTab label="Python">
        <div className="space-y-4">
          <p>Install using pip:</p>
          <InlineCode>pip install my-package</InlineCode>
        </div>
      </DocTab>
    </DocTabs>
  ),
};

// Long Content
export const LongContent: Story = {
  args: {
    children: (
      <>
        <DocTab label="Introduction">
          <div className="space-y-4">
            <p>
              Welcome to our comprehensive guide. This section provides an overview
              of the key concepts and features you'll need to understand.
            </p>
            <p>
              We'll cover everything from basic setup to advanced configuration
              options, ensuring you have all the information you need to succeed.
            </p>
          </div>
        </DocTab>
        <DocTab label="Features">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Easy to use interface</li>
              <li>Advanced customization options</li>
              <li>Real-time updates</li>
              <li>Cross-platform support</li>
            </ul>
          </div>
        </DocTab>
        <DocTab label="Configuration">
          <div className="space-y-4">
            <p>
              This section covers all configuration options available in the system.
              You can customize various aspects of the application to match your
              specific requirements.
            </p>
            <p>
              Each setting is documented with examples and best practices to help
              you make the most of the available options.
            </p>
          </div>
        </DocTab>
      </>
    ),
  },
  render: () => (
    <DocTabs>
      <DocTab label="Introduction">
        <div className="space-y-4">
          <p>
            Welcome to our comprehensive guide. This section provides an overview
            of the key concepts and features you'll need to understand.
          </p>
          <p>
            We'll cover everything from basic setup to advanced configuration
            options, ensuring you have all the information you need to succeed.
          </p>
        </div>
      </DocTab>
      <DocTab label="Features">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Easy to use interface</li>
            <li>Advanced customization options</li>
            <li>Real-time updates</li>
            <li>Cross-platform support</li>
          </ul>
        </div>
      </DocTab>
      <DocTab label="Configuration">
        <div className="space-y-4">
          <p>
            This section covers all configuration options available in the system.
            You can customize various aspects of the application to match your
            specific requirements.
          </p>
          <p>
            Each setting is documented with examples and best practices to help
            you make the most of the available options.
          </p>
        </div>
      </DocTab>
    </DocTabs>
  ),
};

// Default Tab
export const DefaultTab: Story = {
  args: {
    defaultTab: "Advanced",
    children: (
      <>
        <DocTab label="Basic">
          <p>Basic configuration options.</p>
        </DocTab>
        <DocTab label="Advanced">
          <p>Advanced configuration options.</p>
        </DocTab>
        <DocTab label="Expert">
          <p>Expert-level configuration options.</p>
        </DocTab>
      </>
    ),
  },
  render: () => (
    <DocTabs defaultTab="Advanced">
      <DocTab label="Basic">
        <p>Basic configuration options.</p>
      </DocTab>
      <DocTab label="Advanced">
        <p>Advanced configuration options.</p>
      </DocTab>
      <DocTab label="Expert">
        <p>Expert-level configuration options.</p>
      </DocTab>
    </DocTabs>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  args: {
    className: "border border-primary-500/20 rounded-lg p-4",
    children: (
      <>
        <DocTab label="Design">
          <p>Design system and components.</p>
        </DocTab>
        <DocTab label="Development">
          <p>Development guidelines and best practices.</p>
        </DocTab>
        <DocTab label="Deployment">
          <p>Deployment strategies and configurations.</p>
        </DocTab>
      </>
    ),
  },
  render: () => (
    <DocTabs className="border border-primary-500/20 rounded-lg p-4">
      <DocTab label="Design">
        <p>Design system and components.</p>
      </DocTab>
      <DocTab label="Development">
        <p>Development guidelines and best practices.</p>
      </DocTab>
      <DocTab label="Deployment">
        <p>Deployment strategies and configurations.</p>
      </DocTab>
    </DocTabs>
  ),
}; 