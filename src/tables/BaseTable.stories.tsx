import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from './index';
import { invoices } from './TableStories.utils';

const meta: Meta<typeof Table> = {
    title: 'Table/Base',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

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

export const CustomStyling: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Border and Shadow</h3>
                <Table className="border-2 border-green-500 shadow-xl">
                    <TableCaption className="text-green-600 dark:text-green-400">
                        Custom styled table with green border
                    </TableCaption>
                    <TableHeader className="bg-green-50 dark:bg-green-900/30">
                        <TableRow className="border-green-200 dark:border-green-700">
                            <TableHead className="w-[100px] text-green-900 dark:text-green-100">
                                Invoice
                            </TableHead>
                            <TableHead className="text-green-900 dark:text-green-100">
                                Status
                            </TableHead>
                            <TableHead className="text-green-900 dark:text-green-100">
                                Method
                            </TableHead>
                            <TableHead className="text-right text-green-900 dark:text-green-100">
                                Amount
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.slice(0, 3).map((invoice) => (
                            <TableRow
                                key={invoice.invoice}
                                className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                    {invoice.totalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Compact Table with Custom Spacing</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] py-2">Invoice</TableHead>
                            <TableHead className="py-2">Status</TableHead>
                            <TableHead className="py-2">Method</TableHead>
                            <TableHead className="text-right py-2">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="py-1.5 text-sm">{invoice.invoice}</TableCell>
                                <TableCell className="py-1.5 text-sm">
                                    {invoice.paymentStatus}
                                </TableCell>
                                <TableCell className="py-1.5 text-sm">
                                    {invoice.paymentMethod}
                                </TableCell>
                                <TableCell className="text-right py-1.5 text-sm">
                                    {invoice.totalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Custom Footer Styling</h3>
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
                    <TableFooter className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="font-bold text-blue-900 dark:text-blue-100"
                            >
                                Total
                            </TableCell>
                            <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                                $2,500.00
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    ),
};
