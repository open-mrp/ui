import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
    ItemsPerPageSelector,
    PaginationControls,
    SortableTableHead,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHeader,
    TableRow,
    type SortDirection,
} from './index';
import { generateSampleData, sortData } from './TableStories.utils';

const meta: Meta<typeof Table> = {
    title: 'Table/Sortable',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
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
        const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

        // Generate 100 sample records
        const allData = generateSampleData(100);

        // Sort data if sorting is applied
        const sortedData =
            sortKey && sortDirection ? sortData(allData, sortKey, sortDirection) : allData;

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
                if (sortDirection === 'asc') {
                    setSortDirection('desc');
                } else if (sortDirection === 'desc') {
                    setSortDirection(null);
                    setSortKey(null);
                }
            } else {
                // New column, start with ascending
                setSortKey(typedKey);
                setSortDirection('asc');
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
                            {Math.min(endIndex, sortedData.length)} of {sortedData.length} employees
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
                                sortDirection={sortKey === 'id' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                ID
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="name"
                                sortable
                                sortDirection={sortKey === 'name' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Name
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="email"
                                sortable
                                sortDirection={sortKey === 'email' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Email
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="department"
                                sortable
                                sortDirection={sortKey === 'department' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Department
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="role"
                                sortable
                                sortDirection={sortKey === 'role' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Role
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="status"
                                sortable
                                sortDirection={sortKey === 'status' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Status
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="joinDate"
                                sortable
                                sortDirection={sortKey === 'joinDate' ? sortDirection : null}
                                onSort={handleSort}
                            >
                                Join Date
                            </SortableTableHead>
                            <SortableTableHead
                                sortKey="salary"
                                sortable
                                sortDirection={sortKey === 'salary' ? sortDirection : null}
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
                                            row.status === 'Active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : row.status === 'Inactive'
                                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                  : row.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
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

export const CustomStyledSortable: Story = {
    render: () => {
        const [currentPage, setCurrentPage] = React.useState(1);
        const [itemsPerPage, setItemsPerPage] = React.useState(10);
        const [sortKey, setSortKey] = React.useState<
            keyof ReturnType<typeof generateSampleData>[0] | null
        >(null);
        const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

        const allData = generateSampleData(50);
        const sortedData =
            sortKey && sortDirection ? sortData(allData, sortKey, sortDirection) : allData;

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
                if (sortDirection === 'asc') {
                    setSortDirection('desc');
                } else if (sortDirection === 'desc') {
                    setSortDirection(null);
                    setSortKey(null);
                }
            } else {
                setSortKey(typedKey);
                setSortDirection('asc');
            }
            setCurrentPage(1);
        };

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Custom Styled Sortable Table</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Custom colors and styling applied
                        </p>
                    </div>
                </div>

                <TableContainer className="bg-indigo-50/30 dark:bg-indigo-950/50 border-2 border-indigo-300 dark:border-indigo-600 shadow-xl rounded-xl">
                    <Table>
                        <TableHeader className="bg-indigo-100 dark:bg-indigo-900/40">
                            <TableRow className="border-indigo-200 dark:border-indigo-700">
                                <SortableTableHead
                                    sortKey="id"
                                    sortable
                                    sortDirection={sortKey === 'id' ? sortDirection : null}
                                    onSort={handleSort}
                                    className="text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    ID
                                </SortableTableHead>
                                <SortableTableHead
                                    sortKey="name"
                                    sortable
                                    sortDirection={sortKey === 'name' ? sortDirection : null}
                                    onSort={handleSort}
                                    className="text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    Name
                                </SortableTableHead>
                                <SortableTableHead
                                    sortKey="email"
                                    sortable
                                    sortDirection={sortKey === 'email' ? sortDirection : null}
                                    onSort={handleSort}
                                    className="text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    Email
                                </SortableTableHead>
                                <SortableTableHead
                                    sortKey="department"
                                    sortable
                                    sortDirection={sortKey === 'department' ? sortDirection : null}
                                    onSort={handleSort}
                                    className="text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    Department
                                </SortableTableHead>
                                <SortableTableHead
                                    sortKey="status"
                                    sortable
                                    sortDirection={sortKey === 'status' ? sortDirection : null}
                                    onSort={handleSort}
                                    className="text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                    Status
                                </SortableTableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-indigo-50/20 dark:bg-indigo-950/30">
                            {currentData.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={`border-indigo-200 dark:border-indigo-700 ${
                                        index % 2 === 0
                                            ? 'bg-indigo-100/50 dark:bg-indigo-900/20'
                                            : 'bg-indigo-100/30 dark:bg-indigo-900/40'
                                    } hover:bg-indigo-100 dark:hover:bg-indigo-900/30`}
                                >
                                    <TableCell className="font-medium">{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                row.status === 'Active'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : row.status === 'Inactive'
                                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                      : row.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            }`}
                                        >
                                            {row.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="flex items-center justify-between w-full">
                    <div className="[&>div>span]:text-indigo-900 [&>div>span]:dark:text-indigo-100 [&_button[data-slot='select-trigger']]:border-indigo-300 [&_button[data-slot='select-trigger']]:dark:border-indigo-600 [&_button[data-slot='select-trigger']]:bg-indigo-50 [&_button[data-slot='select-trigger']]:dark:bg-indigo-900/30 [&_button[data-slot='select-trigger']]:text-indigo-900 [&_button[data-slot='select-trigger']]:dark:text-indigo-100 [&_button[data-slot='select-trigger']:hover]:bg-indigo-100 [&_button[data-slot='select-trigger']:hover]:dark:bg-indigo-900/50">
                        <ItemsPerPageSelector
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            itemsPerPageOptions={[5, 10, 20, 50]}
                        />
                    </div>
                    <div className="[&_button[data-slot='pagination-link']]:border-indigo-300 [&_button[data-slot='pagination-link']]:dark:border-indigo-600 [&_button[data-slot='pagination-link']]:bg-indigo-50 [&_button[data-slot='pagination-link']]:dark:bg-indigo-900/30 [&_button[data-slot='pagination-link']]:text-indigo-900 [&_button[data-slot='pagination-link']]:dark:text-indigo-100 [&_button[data-slot='pagination-link']:hover]:bg-indigo-100 [&_button[data-slot='pagination-link']:hover]:dark:bg-indigo-900/50 [&_span[data-slot='pagination-ellipsis']]:text-indigo-900 [&_span[data-slot='pagination-ellipsis']]:dark:text-indigo-100">
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
