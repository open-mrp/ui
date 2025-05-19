import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { WaveShader } from "../shaders/wave-shader";
import BlurSearchBar from "./BlurSearchBar";

const meta = {
  component: BlurSearchBar,
  title: "BlurSearchBar",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 dark:bg-background h-[200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlurSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shader decorator
const shaderDecorator = (Story: any) => (
  <div className="w-full p-8 rounded-lg overflow-hidden relative">
    <div className="absolute inset-0">
      <WaveShader
        colorConfiguration="crazy"
        height={800}
        width={window.innerWidth}
        animate={true}
      />
    </div>
    <div className="relative">
      <Story />
    </div>
  </div>
);

// Default story
export const Default: Story = {
  decorators: [shaderDecorator],
};

// With custom width
export const CustomWidth: Story = {
  args: {
    className: "w-full",
  },
  decorators: [shaderDecorator],
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    className: "w-full",
  },
  decorators: [shaderDecorator],
};
