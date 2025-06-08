import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { WaveShader } from "../shaders/wave-shader";
import HomeTitle from "./HomeTitle";

const meta = {
  component: HomeTitle,
  title: "HomeTitle",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HomeTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shader decorator
const shaderDecorator = (Story: any) => (
  <div className="inline-block p-32 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0 z-1">
      <WaveShader height={400} width={400} animate={true} />
    </div>
    <div className="relative">
      <Story />
    </div>
  </div>
);

const skewedShaderDecorator = (Story: any) => (
  <div className="inline-block p-32 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0 z-1">
      <WaveShader height={400} width={400} animate={true} skew="bottom" />
    </div>
    <div className="relative">
      <Story baseZIndex={1} />
    </div>
  </div>
);

// Default story
export const Default: Story = {
  args: {
    title: "Welcome to My Portfolio",
    description: "A showcase of my work and experiences",
  },
  decorators: [shaderDecorator],
};

export const Skewed: Story = {
  args: {
    title: "Welcome to My Portfolio",
    description: "A showcase of my work and experiences",
  },
  decorators: [skewedShaderDecorator],
};

// Long text story
export const LongText: Story = {
  args: {
    title: "Building the Future of Web Development",
    description:
      "Exploring the intersection of design, technology, and user experience to create meaningful digital products",
  },
  decorators: [shaderDecorator],
};

// Short text story
export const ShortText: Story = {
  args: {
    title: "Hello",
    description: "Welcome",
  },
  decorators: [shaderDecorator],
};
