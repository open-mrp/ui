import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { WaveShader } from "./WaveShader";

const meta = {
  component: WaveShader,
  title: "Shaders/WaveShader",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full h-[400px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WaveShader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with large dimensions
export const Default: Story = {
  args: {
    animate: true,
    colorConfiguration: "default",
    height: 400,
    minWidth: 300,
  },
};

// Color Configurations
export const Fire: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "fire",
  },
};

export const RedToPurple: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "red_to_purple",
  },
};

export const BlueToYellow: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "blue_to_yellow",
  },
};

export const RedToBlue: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "red_to_blue",
  },
};

export const Sunset: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "sunset",
  },
};

export const BlueToPurple: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "blue_to_purple",
  },
};

export const BlueToPink: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "blue_to_pink",
  },
};

export const Crazy: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "crazy",
  },
};

// Different sizes
export const Small: Story = {
  args: {
    animate: true,
    colorConfiguration: "default",
    height: 150,
    minWidth: 300,
  },
};

export const Large: Story = {
  args: {
    animate: true,
    colorConfiguration: "default",
    height: 400,
    minWidth: 800,
  },
};

// Skewed variants
export const BottomSkewed: Story = {
  args: {
    ...Default.args,
    skew: "bottom",
    skewDegree: 6,
  },
};

export const FullSkewed: Story = {
  args: {
    ...Default.args,
    skew: "full",
    skewDegree: 6,
    height: 200,
  },
};

// Static (non-animated) variant
export const Static: Story = {
  args: {
    ...Default.args,
    animate: false,
  },
};

// Custom seed for deterministic pattern
export const CustomSeed: Story = {
  args: {
    ...Default.args,
    seed: 12345,
  },
};
