import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Flowchart from "./Flowchart";
import { createSequenceDiagram } from "./FlowchartHelpers";

const meta = {
  component: Flowchart,
  title: "Flowchart",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4 dark:bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Flowchart>;

export default meta;
type Story = StoryObj<typeof meta>;

const simpleApiFlow = createSequenceDiagram({
  actors: [
    {
      id: "frontend",
      label: "Frontend",
      color: "rgb(62, 165, 11)", // Green
    },
    {
      id: "backend",
      label: "Backend API",
      color: "rgb(0, 85, 188)", // Blue
    },
    {
      id: "database",
      label: "Database",
      color: "rgb(99, 91, 255)", // Purple
    },
  ],
  actions: [
    {
      source: "frontend",
      target: "backend",
      label: "GET /api/users",
      row: 2,
    },
    {
      source: "backend",
      target: "database",
      label: "Query users table",
      row: 2,
    },
    {
      source: "database",
      target: "backend",
      label: "Return user records",
      row: 4,
    },
    {
      source: "backend",
      target: "frontend",
      label: "Return JSON response",
      row: 4,
      event: "api.response.success",
    },
    {
      source: "database",
      target: "frontend",
      label: "Polling",
      row: 6,
      event: "api.response.success",
    },
    {
      source: "database",
      target: "database",
      label: "Update user record",
      row: 7,
    },
  ],
});
// Simple API Request Flow
export const SimpleApiFlow: Story = {
  args: {
    height: 500,
    nodes: simpleApiFlow.nodes,
    edges: simpleApiFlow.edges,
    isPro: true,
  },
};
const complexFlow = createSequenceDiagram({
  actors: [
    {
      id: "user",
      label: "User",
      color: "rgb(255, 99, 71)",
    },
    {
      id: "client",
      label: "Client App",
      color: "rgb(62, 165, 11)",
    },
    {
      id: "auth",
      label: "Auth Service",
      color: "rgb(0, 85, 188)",
    },
    {
      id: "api",
      label: "API Gateway",
      color: "rgb(99, 91, 255)",
    },
  ],
  actions: [
    {
      source: "user",
      target: "client", 
      label: "Login Request",
      row: 2,
    },
    {
      source: "client",
      target: "auth",
      label: "Authenticate", 
      row: 2,
    },
    {
      source: "auth",
      target: "client",
      label: "JWT Token",
      row: 4,
    },
    {
      source: "client",
      target: "api",
      label: "API Request with Token",
      row: 6,
    },
    {
      source: "api", 
      target: "auth",
      label: "Validate Token",
      row: 8,
    },
    {
      source: "auth",
      target: "api",
      label: "Token Valid",
      row: 10,
    },
    {
      source: "api",
      target: "client",
      label: "API Response", 
      row: 12,
    },
  ],
});
// Complex Flow with Multiple Interactions
export const ComplexFlow: Story = {
  args: {
    height: 600,
    nodes: complexFlow.nodes,
    edges: complexFlow.edges,
    isPro: true,
  },
};

const customViewport = createSequenceDiagram({
  actors: [
    {
      id: "service1",
      label: "Service 1",
      color: "rgb(62, 165, 11)",
    },
    {
      id: "service2",
      label: "Service 2",
      color: "rgb(0, 85, 188)",
    },
  ],
  actions: [
    {
      source: "service1",
      target: "service2",
      label: "Request",
      row: 2,
    },
    {
      source: "service2",
      target: "service1",
      label: "Response",
      row: 4,
    },
  ],
});
// Custom Viewport
export const CustomViewport: Story = {
  args: {
    height: 400,
    defaultViewport: { x: 100, y: 100, zoom: 0.8 },
    nodes: customViewport.nodes,
    edges: customViewport.edges,
    isPro: true,
  },
};
