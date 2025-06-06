import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ColorConfiguration,
  colorConfigurations,
} from "../colorConfigurations";
import { DuffingShader } from "./DuffingShader";

// Get available color schemes from colorConfigurations
const colorSchemeOptions = Object.keys(
  colorConfigurations
) as ColorConfiguration[];

const meta = {
  title: "shaders/DuffingShader",
  component: DuffingShader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full min-h-[400px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    colorConfiguration: {
      control: "select",
      options: colorSchemeOptions,
      description: "Color scheme to use for the shader effect",
    },
    backgroundColor: {
      control: "object",
      description: "Background color as RGB object with r, g, b values (0-1)",
    },
    height: {
      control: { type: "range", min: 100, max: 800, step: 50 },
      description: "Height of the shader effect in pixels",
    },
    minWidth: {
      control: { type: "range", min: 200, max: 1200, step: 50 },
      description: "Minimum width of the shader effect",
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
  },
} satisfies Meta<typeof DuffingShader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    colorConfiguration: "default",
    height: 400,
    minWidth: 600,
  },
};

export const CustomColors: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "dusk",
    backgroundColor: { r: 0.3, g: 0.3, b: 0.35 },
  },
};

export const HighPerformance: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "organic",
    config: {
      SIM_RESOLUTION: 256,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 3,
      VELOCITY_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 15,
      SPLAT_RADIUS: 0.0005,
      SPLAT_FORCE: 10000,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.15,
      BLOOM_THRESHOLD: 0.0,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 5.0,
    },
  },
};

export const ChaoticOscillators: Story = {
  args: {
    ...Default.args,
    colorConfiguration: "rosolane_to_helvetia",
    config: {
      CURL: 0.9,
      // SPLAT_RADIUS: 0.2,
      // SPLAT_FORCE: 700,
      // BLOOM_INTENSITY: 0.01,
      DUFFING: {
        NUM_OSCILLATORS: 4,
        DELTA: 0.2,
        BETA: 0.08,
        ALPHA: 0.9,
        GAMMA: 0.8,
        OMEGA: 0.4,
      },
    },
  },
};

export const WithBottomSkew: Story = {
  args: {
    ...Default.args,
    skew: "bottom",
    skewDegree: 6,
    height: 300,
    colorConfiguration: "trifecta",
    config: {
      SUNRAYS_WEIGHT: 0.5,
      DUFFING: {
        NUM_OSCILLATORS: 3,
        DELTA: 0.2,
        BETA: 0.08,
        ALPHA: 0.9,
        GAMMA: 0.8,
        OMEGA: 0.4,
      },
    },
  },
};
