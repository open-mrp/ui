import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./index";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";
import { TablePagination } from "./TablePagination";
import { generateSampleData } from "./TableStories.utils";

const meta: Meta<typeof Table> = {
  title: "Table/Pagination",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const PaginationComponents: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(3);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Table Pagination</h3>
          <TablePagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            maxVisiblePages={5}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            Large Dataset Pagination
          </h3>
          <TablePagination
            currentPage={15}
            totalPages={50}
            onPageChange={(page) => console.log("Page changed to:", page)}
            maxVisiblePages={7}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Compact Pagination</h3>
          <TablePagination
            currentPage={2}
            totalPages={5}
            onPageChange={(page) => console.log("Page changed to:", page)}
            showFirstLast={false}
            maxVisiblePages={3}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            Basic Pagination Components
          </h3>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Previous");
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 1");
                  }}
                  isActive
                  size="icon"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 2");
                  }}
                  size="icon"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 3");
                  }}
                  size="icon"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 10");
                  }}
                  size="icon"
                >
                  10
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Next");
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            Pagination with Custom Button Styling (Primary Color)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Use the buttonClassName prop to apply consistent styling to all
            pagination buttons. This example shows primary-colored borders.
          </p>
          <Pagination buttonClassName="!border !border-primary hover:!border-primary/80">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Previous");
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 1");
                  }}
                  isActive
                  size="icon"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 2");
                  }}
                  size="icon"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 3");
                  }}
                  size="icon"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 10");
                  }}
                  size="icon"
                >
                  10
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Next");
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            Pagination with Input-like Styling
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Match the styling of input components like Select and
            ColumnToggleDropdown.
          </p>
          <Pagination buttonClassName="!border !border-input bg-background hover:bg-accent dark:!bg-input/30 dark:!border-input dark:hover:!bg-input/50">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Previous");
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 1");
                  }}
                  isActive
                  size="icon"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 2");
                  }}
                  size="icon"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 3");
                  }}
                  size="icon"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Page 10");
                  }}
                  size="icon"
                >
                  10
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Next");
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  },
};

export const PaginatedTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    // Generate 100 sample records
    const allData = generateSampleData(100);
    const totalPages = Math.ceil(allData.length / itemsPerPage);

    // Calculate current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = allData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Employee Directory</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} employees
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : employee.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : employee.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell className="text-right">{employee.salary}</TableCell>
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

export const LargePaginatedTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(20);

    // Generate 1000 sample records for a large dataset
    const allData = generateSampleData(1000);
    const totalPages = Math.ceil(allData.length / itemsPerPage);

    // Calculate current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = allData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Large Dataset Table</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} records
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[240px]">Email</TableHead>
              <TableHead className="min-w-[180px]">Department</TableHead>
              <TableHead className="min-w-[160px]">Role</TableHead>
              <TableHead className="min-w-[140px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Join Date</TableHead>
              <TableHead className="text-right min-w-[140px]">Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : employee.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : employee.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell className="text-right">{employee.salary}</TableCell>
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
          itemsPerPageOptions={[10, 20, 50, 100]}
          maxVisiblePages={7}
        />
      </div>
    );
  },
};

export const TableWithItemsPerPageSelector: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);

    // Generate 1000 sample records to demonstrate pagination
    const allData = generateSampleData(1000);
    const totalPages = Math.ceil(allData.length / itemsPerPage);

    // Calculate current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = allData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Employee Directory</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} employees
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[240px]">Email</TableHead>
              <TableHead className="min-w-[180px]">Department</TableHead>
              <TableHead className="min-w-[160px]">Role</TableHead>
              <TableHead className="min-w-[140px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Join Date</TableHead>
              <TableHead className="text-right min-w-[140px]">Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : employee.status === "Inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : employee.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell className="text-right">{employee.salary}</TableCell>
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
          itemsPerPageOptions={[5, 10, 20, 50, 100]}
          maxVisiblePages={5}
          className="text-gray-900 dark:text-blue-200 outline-gray-800 dark:outline-amber-200"
          buttonClassName="text-gray-900 dark:text-blue-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          selectClassName="text-gray-900 dark:text-blue-200  hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
        />
      </div>
    );
  },
};
