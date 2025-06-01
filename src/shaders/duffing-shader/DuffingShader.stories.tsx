import type { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { DuffingShader } from "./DuffingShader";

const meta = {
  title: "shaders/DuffingShader",
  component: DuffingShader,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DuffingShader>;

export default meta;

const Template: StoryFn<typeof DuffingShader> = (args) => (
  <DuffingShader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  width: 600,
  height: 275,
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  width: 600,
  height: 275,
  config: {
    BACK_COLOR: { r: 0.1, g: 0.1, b: 0.15 },
    COLOR_SCHEME: "sunset",
  },
};

export const HighPerformance = Template.bind({});
HighPerformance.args = {
  width: 600,
  height: 275,
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
    SUNRAYS_WEIGHT: 0.1,
  },
};

export const ArtisticEffects = Template.bind({});
ArtisticEffects.args = {
  width: 600,
  height: 275,
  config: {
    SIM_RESOLUTION: 512,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.5,
    VELOCITY_DISSIPATION: 0.95,
    PRESSURE_ITERATIONS: 25,
    CURL: 0.2,
    SPLAT_RADIUS: 0.0002,
    SPLAT_FORCE: 6000,
    BLOOM_ITERATIONS: 12,
    BLOOM_RESOLUTION: 512,
    BLOOM_INTENSITY: 0.25,
    BLOOM_THRESHOLD: 0.1,
    BLOOM_SOFT_KNEE: 0.9,
    SUNRAYS_RESOLUTION: 256,
    SUNRAYS_WEIGHT: 0.2,
  },
};

export const BigBois = Template.bind({});
BigBois.args = {
  width: 600,
  height: 275,
  config: {
    SIM_RESOLUTION: 512,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.5,
    VELOCITY_DISSIPATION: 0.95,
    PRESSURE_ITERATIONS: 25,
    CURL: 0.2,
    SPLAT_RADIUS: 0.02,
    SPLAT_FORCE: 700,
    BLOOM_ITERATIONS: 12,
    BLOOM_RESOLUTION: 512,
    BLOOM_INTENSITY: 0.05,
    BLOOM_THRESHOLD: 6.9,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS_RESOLUTION: 256,
    SUNRAYS_WEIGHT: 0.15,
    DUFFING: {
      NUM_OSCILLATORS: 3,
    },
    COLOR_SCHEME: "rosolane_to_helvetia",
  },
};

export const WithFullSkew = Template.bind({});
WithFullSkew.args = {
  width: 600,
  height: 275,
  skew: "full",
  skewDegree: 6,
  config: {
    SIM_RESOLUTION: 512,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.5,
    VELOCITY_DISSIPATION: 0.95,
    PRESSURE_ITERATIONS: 25,
    CURL: 0.2,
    SPLAT_RADIUS: 0.02,
    SPLAT_FORCE: 700,
    BLOOM_ITERATIONS: 12,
    BLOOM_RESOLUTION: 512,
    BLOOM_INTENSITY: 0.05,
    BLOOM_THRESHOLD: 6.9,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS_RESOLUTION: 256,
    SUNRAYS_WEIGHT: 0.15,
    DUFFING: {
      NUM_OSCILLATORS: 3,
    },
    COLOR_SCHEME: "rosolane_to_helvetia",
  },
};

export const WithBottomSkew = Template.bind({});
WithBottomSkew.args = {
  width: 600,
  height: 275,
  skew: "bottom",
  skewDegree: 6,
  config: {
    SIM_RESOLUTION: 512,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.5,
    VELOCITY_DISSIPATION: 0.95,
    PRESSURE_ITERATIONS: 25,
    CURL: 0.2,
    SPLAT_RADIUS: 0.02,
    SPLAT_FORCE: 700,
    BLOOM_ITERATIONS: 12,
    BLOOM_RESOLUTION: 512,
    BLOOM_INTENSITY: 0.05,
    BLOOM_THRESHOLD: 6.9,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS_RESOLUTION: 256,
    SUNRAYS_WEIGHT: 0.15,
    DUFFING: {
      NUM_OSCILLATORS: 3,
    },
    COLOR_SCHEME: "rosolane_to_helvetia",
  },
};
