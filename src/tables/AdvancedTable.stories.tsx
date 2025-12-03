import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  SettingsIcon,
} from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../overlays/DropdownMenu";
import {
  ItemsPerPageSelector,
  PaginationControls,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
  ToggleableTableHead,
  type SortDirection,
} from "./index";
import { generateSampleData, sortData } from "./TableStories.utils";

interface ColumnConfig {
  id: string;
  label: string;
  isVisible: boolean;
  isRequired?: boolean;
}

const meta: Meta<typeof Table> = {
  title: "Table/Advanced",
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
            <p className="text-gray-600 dark:text-gray-300">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                title="Column settings"
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon className="size-4" />
                  <span>
                    Columns (
                    {columnConfig.filter((col) => col.isVisible).length}/
                    {columnConfig.length})
                  </span>
                </div>
                <ChevronDownIcon className="size-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Column Visibility</span>
                {handleResetColumns && (
                  <button
                    onClick={handleResetColumns}
                    className="text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1 py-0.5"
                  >
                    Reset
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-48 overflow-y-auto">
                {columnConfig.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.isVisible}
                    onCheckedChange={() => handleToggleColumn(column.id)}
                    disabled={column.isRequired}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1">
                      {column.label}
                      {column.isRequired && " (required)"}
                    </span>
                    {column.isVisible ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4 opacity-50" />
                    )}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TableContainer>
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
        </TableContainer>

        <div className="flex items-center justify-between w-full">
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={[5, 10, 20, 50]}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
          />
        </div>
      </div>
    );
  },
};

export const CustomStyledAdvancedTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [sortKey, setSortKey] = React.useState<
      keyof ReturnType<typeof generateSampleData>[0] | null
    >(null);
    const [sortDirection, setSortDirection] =
      React.useState<SortDirection>(null);

    const [columnConfig, setColumnConfig] = React.useState<ColumnConfig[]>([
      { id: "id", label: "ID", isVisible: true, isRequired: true },
      { id: "name", label: "Name", isVisible: true },
      { id: "email", label: "Email", isVisible: true },
      { id: "department", label: "Department", isVisible: true },
      { id: "status", label: "Status", isVisible: true },
    ]);

    const [columnOrder, setColumnOrder] = React.useState([
      "id",
      "name",
      "email",
      "department",
      "status",
    ]);

    const allData = generateSampleData(50);
    const sortedData =
      sortKey && sortDirection
        ? sortData(allData, sortKey, sortDirection)
        : allData;

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
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

    const visibleColumns = columnOrder.filter(
      (columnId) => columnConfig.find((col) => col.id === columnId)?.isVisible
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Custom Styled Advanced Table</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Custom teal color scheme with advanced features
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 border-teal-300 dark:border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                title="Column settings"
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon className="size-4" />
                  <span>
                    Columns (
                    {columnConfig.filter((col) => col.isVisible).length}/
                    {columnConfig.length})
                  </span>
                </div>
                <ChevronDownIcon className="size-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-teal-50/90 dark:bg-teal-900/90 border-teal-300 dark:border-teal-600"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Column Visibility</span>
                {handleResetColumns && (
                  <button
                    onClick={handleResetColumns}
                    className="text-xs transition-colors focus:outline-none focus:ring-2 rounded px-1 py-0.5"
                  >
                    Reset
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-48 overflow-y-auto">
                {columnConfig.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.isVisible}
                    onCheckedChange={() => handleToggleColumn(column.id)}
                    disabled={column.isRequired}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1">
                      {column.label}
                      {column.isRequired && " (required)"}
                    </span>
                    {column.isVisible ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4 opacity-50" />
                    )}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TableContainer className="bg-teal-50/30 dark:bg-teal-950/50 border-2 border-teal-300 dark:border-teal-600 shadow-xl rounded-xl">
          <Table>
            <TableHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-xl">
              <TableRow className="border-teal-600">
                {visibleColumns.map((columnId) => {
                  const config = columnConfig.find(
                    (col) => col.id === columnId
                  );
                  if (!config) return null;

                  return (
                    <ToggleableTableHead
                      key={columnId}
                      className={`text-white hover:bg-teal-600 dark:hover:bg-teal-700 ${
                        columnId === "id" ? "w-[100px]" : ""
                      }`}
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
            <TableBody className="bg-teal-50/20 dark:bg-teal-950/30">
              {currentData.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  className={`border-teal-200 dark:border-teal-700 ${
                    index % 2 === 0
                      ? "bg-teal-100/50 dark:bg-teal-900/20"
                      : "bg-teal-100/30 dark:bg-teal-900/40"
                  } hover:bg-teal-100 dark:hover:bg-teal-900/30`}
                >
                  {visibleColumns.map((columnId) => {
                    const config = columnConfig.find(
                      (col) => col.id === columnId
                    );
                    if (!config) return null;

                    const value = employee[columnId as keyof typeof employee];

                    return (
                      <TableCell
                        key={columnId}
                        className={columnId === "id" ? "font-medium" : ""}
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
        </TableContainer>

        <div className="flex items-center justify-between w-full">
          <div className="[&>div>span]:text-teal-900 [&>div>span]:dark:text-teal-100 [&_button[data-slot='select-trigger']]:border-teal-300 [&_button[data-slot='select-trigger']]:dark:border-teal-600 [&_button[data-slot='select-trigger']]:bg-teal-50 [&_button[data-slot='select-trigger']]:dark:bg-teal-900/30 [&_button[data-slot='select-trigger']]:text-teal-900 [&_button[data-slot='select-trigger']]:dark:text-teal-100 [&_button[data-slot='select-trigger']:hover]:bg-teal-100 [&_button[data-slot='select-trigger']:hover]:dark:bg-teal-900/50">
            <ItemsPerPageSelector
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
          <div className="[&_button[data-slot='pagination-link']]:border-teal-300 [&_button[data-slot='pagination-link']]:dark:border-teal-600 [&_button[data-slot='pagination-link']]:bg-teal-50 [&_button[data-slot='pagination-link']]:dark:bg-teal-900/30 [&_button[data-slot='pagination-link']]:text-teal-900 [&_button[data-slot='pagination-link']]:dark:text-teal-100 [&_button[data-slot='pagination-link']:hover]:bg-teal-100 [&_button[data-slot='pagination-link']:hover]:dark:bg-teal-900/50 [&_span[data-slot='pagination-ellipsis']]:text-teal-900 [&_span[data-slot='pagination-ellipsis']]:dark:text-teal-100">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxVisiblePages={5}
            />
          </div>
        </div>
      </div>
    );
  },
};
