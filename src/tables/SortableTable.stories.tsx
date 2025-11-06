import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  SortableTableHead,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  type SortDirection,
} from "./index";
import { TablePagination } from "./TablePagination";
import { generateSampleData, sortData } from "./TableStories.utils";

const meta: Meta<typeof Table> = {
  title: "Components/Table/Sortable",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const SortableTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [sortKey, setSortKey] = React.useState<
      keyof ReturnType<typeof generateSampleData>[0] | null
    >(null);
    const [sortDirection, setSortDirection] =
      React.useState<SortDirection>(null);

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
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleSort = (key: string) => {
      const typedKey = key as keyof ReturnType<typeof generateSampleData>[0];

      if (sortKey === typedKey) {
        // Cycle through: asc -> desc -> null
        if (sortDirection === "asc") {
          setSortDirection("desc");
        } else if (sortDirection === "desc") {
          setSortDirection(null);
          setSortKey(null);
        }
      } else {
        // New column, start with ascending
        setSortKey(typedKey);
        setSortDirection("asc");
      }
      setCurrentPage(1); // Reset to first page when sorting
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sortable Employee Directory</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Click column headers to sort. Showing {startIndex + 1}-
              {Math.min(endIndex, sortedData.length)} of {sortedData.length}{" "}
              employees
            </p>
            {/* {sortKey && sortDirection && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Sorted by {sortKey} (
                {sortDirection === "asc" ? "ascending" : "descending"})
              </p>
            )} */}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                sortKey="id"
                sortable
                sortDirection={sortKey === "id" ? sortDirection : null}
                onSort={handleSort}
              >
                ID
              </SortableTableHead>
              <SortableTableHead
                sortKey="name"
                sortable
                sortDirection={sortKey === "name" ? sortDirection : null}
                onSort={handleSort}
              >
                Name
              </SortableTableHead>
              <SortableTableHead
                sortKey="email"
                sortable
                sortDirection={sortKey === "email" ? sortDirection : null}
                onSort={handleSort}
              >
                Email
              </SortableTableHead>
              <SortableTableHead
                sortKey="department"
                sortable
                sortDirection={sortKey === "department" ? sortDirection : null}
                onSort={handleSort}
              >
                Department
              </SortableTableHead>
              <SortableTableHead
                sortKey="role"
                sortable
                sortDirection={sortKey === "role" ? sortDirection : null}
                onSort={handleSort}
              >
                Role
              </SortableTableHead>
              <SortableTableHead
                sortKey="status"
                sortable
                sortDirection={sortKey === "status" ? sortDirection : null}
                onSort={handleSort}
              >
                Status
              </SortableTableHead>
              <SortableTableHead
                sortKey="joinDate"
                sortable
                sortDirection={sortKey === "joinDate" ? sortDirection : null}
                onSort={handleSort}
              >
                Join Date
              </SortableTableHead>
              <SortableTableHead
                sortKey="salary"
                sortable
                sortDirection={sortKey === "salary" ? sortDirection : null}
                onSort={handleSort}
                className="text-right"
              >
                Salary
              </SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : row.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell>{row.joinDate}</TableCell>
                <TableCell className="text-right">{row.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
