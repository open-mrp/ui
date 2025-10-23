import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./TableComponents";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

// This file serves as the main entry point for all table stories.
// Individual story categories are organized in separate files:
// - BaseTable.stories.tsx - Basic table components
// - PaginationTable.stories.tsx - Pagination-related stories
// - SortableTable.stories.tsx - Sortable table functionality
// - AdvancedTable.stories.tsx - Advanced features like column toggling
