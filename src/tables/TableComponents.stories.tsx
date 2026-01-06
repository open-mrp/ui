import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './TableComponents';
import { invoices } from './TableStories.utils';

const meta: Meta<typeof Table> = {
    title: 'Table',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// This file serves as the main entry point for all table stories.
// Individual story categories are organized in separate files:
// - BaseTable.stories.tsx - Basic table components
// - PaginationTable.stories.tsx - Pagination-related stories
// - SortableTable.stories.tsx - Sortable table functionality
// - AdvancedTable.stories.tsx - Advanced features like column toggling

export const CustomStyling: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Container Border and Shadow</h3>
                <Table className="border-2 border-blue-500 shadow-lg">
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
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Header Background Color</h3>
                <Table>
                    <TableHeader className="bg-blue-500 text-white">
                        <TableRow className="border-blue-600">
                            <TableHead className="w-[100px] text-white">Invoice</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Method</TableHead>
                            <TableHead className="text-right text-white">Amount</TableHead>
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
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Row Hover Colors</h3>
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
                        {invoices.slice(0, 4).map((invoice) => (
                            <TableRow
                                key={invoice.invoice}
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Striped Rows</h3>
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
                        {invoices.slice(0, 5).map((invoice, index) => (
                            <TableRow
                                key={invoice.invoice}
                                className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}
                            >
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Border Radius and Padding</h3>
                <Table className="rounded-xl overflow-hidden">
                    <TableHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <TableRow className="border-purple-600">
                            <TableHead className="w-[100px] text-white py-4">Invoice</TableHead>
                            <TableHead className="text-white py-4">Status</TableHead>
                            <TableHead className="text-white py-4">Method</TableHead>
                            <TableHead className="text-right text-white py-4">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.slice(0, 3).map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium py-4">
                                    {invoice.invoice}
                                </TableCell>
                                <TableCell className="py-4">{invoice.paymentStatus}</TableCell>
                                <TableCell className="py-4">{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right py-4">
                                    {invoice.totalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    ),
};
