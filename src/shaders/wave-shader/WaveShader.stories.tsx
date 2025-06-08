import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ColorConfiguration,
  colorConfigurations,
} from "../colorConfigurations";
import { WaveShader } from "./WaveShader";

// Get available color schemes from colorConfigurations
const colorSchemeOptions = Object.keys(
  colorConfigurations
) as ColorConfiguration[];

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
  argTypes: {
    colorConfiguration: {
      control: "select",
      options: colorSchemeOptions,
      description: "Color scheme to use for the wave effect",
    },
    animate: {
      control: "boolean",
      description: "Whether to animate the wave effect",
    },
    height: {
      control: { type: "range", min: 100, max: 800, step: 50 },
      description: "Height of the wave effect in pixels",
    },
    minWidth: {
      control: { type: "range", min: 200, max: 1200, step: 50 },
      description: "Minimum width of the wave effect",
    },
    skew: {
      control: "select",
      options: ["none", "bottom", "full"],
      description: "Type of skew effect to apply",
    },
    skewDegree: {
      control: { type: "range", min: 0, max: 45, step: 1 },
      description: "Degree of skew to apply",
    },
    seed: {
      control: "number",
      description: "Seed for deterministic pattern generation",
    },
    numWaves: {
      control: { type: "range", min: 1, max: 20, step: 1 },
      description: "Number of waves to render",
    },
  },
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

export const Dusk: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "dusk",
  },
};

export const ElectricWave: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "electric_wave",
  },
};

export const RtH: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "rosolane_to_helvetia",
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
