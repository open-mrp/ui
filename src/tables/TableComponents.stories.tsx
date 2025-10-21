import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";
import {
  ColumnToggleDropdown,
  DraggableTableHead,
  SortableTableHead,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToggleableTableHead,
  type ColumnConfig,
  type SortDirection,
} from "./TableComponents";
import { TablePagination } from "./TablePagination";

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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 4).map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithoutCaption: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

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
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Previous");
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
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
                  href="#"
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
                  href="#"
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
                  href="#"
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
                  href="#"
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

// Generate sample data for pagination
const generateSampleData = (count: number) => {
  const statuses = ["Active", "Inactive", "Pending", "Completed"];
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];
  const roles = ["Developer", "Designer", "Manager", "Analyst", "Coordinator"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: departments[i % departments.length],
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    joinDate: new Date(
      2020 + (i % 4),
      i % 12,
      (i % 28) + 1
    ).toLocaleDateString(),
    salary: `$${(50000 + i * 1000).toLocaleString()}`,
  }));
};

// Sorting utility functions
const sortData = <T extends Record<string, any>>(
  data: T[],
  sortKey: keyof T,
  sortDirection: SortDirection
): T[] => {
  if (!sortDirection) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle different data types
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      const comparison = aValue - bValue;
      return sortDirection === "asc" ? comparison : -comparison;
    }

    if (
      aValue &&
      bValue &&
      typeof aValue === "object" &&
      typeof bValue === "object" &&
      "getTime" in aValue &&
      "getTime" in bValue
    ) {
      const comparison =
        (aValue as Date).getTime() - (bValue as Date).getTime();
      return sortDirection === "asc" ? comparison : -comparison;
    }

    // Fallback to string comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    const comparison = aStr.localeCompare(bStr);
    return sortDirection === "asc" ? comparison : -comparison;
  });
};

// Column reordering utility functions
const reorderColumns = <T extends Record<string, any>>(
  columns: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  const result = Array.from(columns);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

const reorderDataColumns = <T extends Record<string, any>>(
  data: T[],
  columnOrder: string[]
): T[] => {
  return data.map((row) => {
    const reorderedRow: Partial<T> = {};
    columnOrder.forEach((key) => {
      if (key in row) {
        reorderedRow[key as keyof T] = row[key as keyof T];
      }
    });
    return reorderedRow as T;
  });
};

export const PaginatedTable: Story = {
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
            <h2 className="text-2xl font-bold">Employee Directory</h2>
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} employees
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="rounded-md border">
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
                  <TableCell className="text-right">
                    {employee.salary}
                  </TableCell>
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
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} records
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="rounded-md border">
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
                  <TableCell className="text-right">
                    {employee.salary}
                  </TableCell>
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
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, allData.length)} of{" "}
              {allData.length} employees
            </p>
          </div>
        </div>

        <div className="rounded-md border">
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
                  <TableCell className="text-right">
                    {employee.salary}
                  </TableCell>
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
          itemsPerPageOptions={[5, 10, 20, 50, 100]}
          maxVisiblePages={5}
        />
      </div>
    );
  },
};

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
            <p className="text-muted-foreground">
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  className="w-[100px]"
                  sortKey="id"
                  sortDirection={sortKey === "id" ? sortDirection : null}
                  onSort={handleSort}
                >
                  ID
                </SortableTableHead>
                <SortableTableHead
                  sortKey="name"
                  sortDirection={sortKey === "name" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Name
                </SortableTableHead>
                <SortableTableHead
                  sortKey="email"
                  sortDirection={sortKey === "email" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Email
                </SortableTableHead>
                <SortableTableHead
                  sortKey="department"
                  sortDirection={
                    sortKey === "department" ? sortDirection : null
                  }
                  onSort={handleSort}
                >
                  Department
                </SortableTableHead>
                <SortableTableHead
                  sortKey="role"
                  sortDirection={sortKey === "role" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Role
                </SortableTableHead>
                <SortableTableHead
                  sortKey="status"
                  sortDirection={sortKey === "status" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Status
                </SortableTableHead>
                <SortableTableHead
                  sortKey="joinDate"
                  sortDirection={sortKey === "joinDate" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Join Date
                </SortableTableHead>
                <SortableTableHead
                  className="text-right"
                  sortKey="salary"
                  sortDirection={sortKey === "salary" ? sortDirection : null}
                  onSort={handleSort}
                >
                  Salary
                </SortableTableHead>
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
                  <TableCell className="text-right">
                    {employee.salary}
                  </TableCell>
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
export const DraggableTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [sortKey, setSortKey] = React.useState<
      keyof ReturnType<typeof generateSampleData>[0] | null
    >(null);
    const [sortDirection, setSortDirection] =
      React.useState<SortDirection>(null);

    // Define column configuration with order
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

    // Column configuration
    const columnConfig = {
      id: { label: "ID", className: "w-[100px]" },
      name: { label: "Name", className: "" },
      email: { label: "Email", className: "" },
      department: { label: "Department", className: "" },
      role: { label: "Role", className: "" },
      status: { label: "Status", className: "" },
      joinDate: { label: "Join Date", className: "" },
      salary: { label: "Salary", className: "text-right" },
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Draggable Employee Directory</h2>
            <p className="text-muted-foreground">
              Drag column headers to reorder. Click to sort. Showing{" "}
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnOrder.map((columnId) => {
                  const config =
                    columnConfig[columnId as keyof typeof columnConfig];
                  return (
                    <DraggableTableHead
                      key={columnId}
                      className={config.className}
                      columnId={columnId}
                      sortKey={columnId}
                      sortDirection={
                        sortKey === columnId ? sortDirection : null
                      }
                      onSort={handleSort}
                      onColumnReorder={handleColumnReorder}
                    >
                      {config.label}
                    </DraggableTableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((employee) => (
                <TableRow key={employee.id}>
                  {columnOrder.map((columnId) => {
                    const config =
                      columnConfig[columnId as keyof typeof columnConfig];
                    const value = employee[columnId as keyof typeof employee];

                    return (
                      <TableCell key={columnId} className={config.className}>
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
                        ) : columnId === "id" ? (
                          <span className="font-medium">{value}</span>
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
