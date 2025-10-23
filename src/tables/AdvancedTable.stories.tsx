import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  ColumnToggleDropdown,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  ToggleableTableHead,
  type ColumnConfig,
  type SortDirection,
} from "./index";
import { TablePagination } from "./TablePagination";
import { generateSampleData, sortData } from "./TableStories.utils";

const meta: Meta<typeof Table> = {
  title: "Components/Table/Advanced",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const ToggleableTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [sortKey, setSortKey] = React.useState<
      keyof ReturnType<typeof generateSampleData>[0] | null
    >(null);
    const [sortDirection, setSortDirection] =
      React.useState<SortDirection>(null);

    // Define column configuration with visibility state
    const [columnConfig, setColumnConfig] = React.useState<ColumnConfig[]>([
      { id: "id", label: "ID", isVisible: true, isRequired: true },
      { id: "name", label: "Name", isVisible: true },
      { id: "email", label: "Email", isVisible: true },
      { id: "department", label: "Department", isVisible: true },
      { id: "role", label: "Role", isVisible: true },
      { id: "status", label: "Status", isVisible: true },
      { id: "joinDate", label: "Join Date", isVisible: false },
      { id: "salary", label: "Salary", isVisible: true },
    ]);

    // Define column order
    const [columnOrder, setColumnOrder] = React.useState([
      "id",
      "name",
      "email",
      "department",
      "role",
      "status",
      "joinDate",
      "salary",
    ]);

    // Generate 100 sample records
    const allData = generateSampleData(100);

    // Sort data if sorting is applied
    const sortedData =
      sortKey && sortDirection
        ? sortData(allData, sortKey, sortDirection)
        : allData;

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Calculate current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    };

    const handleSort = (key: string) => {
      const typedKey = key as keyof ReturnType<typeof generateSampleData>[0];

      if (sortKey === typedKey) {
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else if (sortDirection === "desc") {
          setSortDirection(null);
          setSortKey(null);
        }
      } else {
        setSortKey(typedKey);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    };

    const handleColumnReorder = (fromColumnId: string, toColumnId: string) => {
      const fromIndex = columnOrder.indexOf(fromColumnId);
      const toIndex = columnOrder.indexOf(toColumnId);

      if (fromIndex !== -1 && toIndex !== -1) {
        const newColumnOrder = [...columnOrder];
        const [removed] = newColumnOrder.splice(fromIndex, 1);
        newColumnOrder.splice(toIndex, 0, removed);
        setColumnOrder(newColumnOrder);
      }
    };

    const handleToggleColumn = (columnId: string) => {
      setColumnConfig((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
        )
      );
    };

    const handleResetColumns = () => {
      setColumnConfig((prev) =>
        prev.map((col) => ({ ...col, isVisible: true }))
      );
    };

    // Get visible columns in the correct order
    const visibleColumns = columnOrder.filter(
      (columnId) => columnConfig.find((col) => col.id === columnId)?.isVisible
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Advanced Table with Column Controls
            </h2>
            <p className="text-muted-foreground">
              Drag to reorder, click to sort, toggle visibility. Showing{" "}
              {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of{" "}
              {sortedData.length} employees
            </p>
            {sortKey && sortDirection && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Sorted by {sortKey} (
                {sortDirection === "asc" ? "ascending" : "descending"})
              </p>
            )}
          </div>
          <ColumnToggleDropdown
            columns={columnConfig}
            onToggleColumn={handleToggleColumn}
            onResetColumns={handleResetColumns}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((columnId) => {
                  const config = columnConfig.find(
                    (col) => col.id === columnId
                  );
                  if (!config) return null;

                  return (
                    <ToggleableTableHead
                      key={columnId}
                      className={
                        columnId === "id"
                          ? "w-[100px]"
                          : columnId === "salary"
                          ? "text-right"
                          : ""
                      }
                      columnId={columnId}
                      sortKey={columnId}
                      sortDirection={
                        sortKey === columnId ? sortDirection : null
                      }
                      onSort={handleSort}
                      onColumnReorder={handleColumnReorder}
                      isVisible={config.isVisible}
                      showDragHandle={true}
                    >
                      {config.label}
                    </ToggleableTableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((employee) => (
                <TableRow key={employee.id}>
                  {visibleColumns.map((columnId) => {
                    const config = columnConfig.find(
                      (col) => col.id === columnId
                    );
                    if (!config) return null;

                    const value = employee[columnId as keyof typeof employee];

                    return (
                      <TableCell
                        key={columnId}
                        className={
                          columnId === "id"
                            ? "font-medium"
                            : columnId === "salary"
                            ? "text-right"
                            : ""
                        }
                      >
                        {columnId === "status" ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              value === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : value === "Inactive"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : value === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 20, 50]}
          maxVisiblePages={5}
        />
      </div>
    );
  },
};
