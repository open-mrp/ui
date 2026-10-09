import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
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
            <caption>A list of your recent invoices.</caption>
            <TableHead>
                <TableRow>
                    <TableCell className="w-[100px]">Invoice</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell className="text-right">Amount</TableCell>
                </TableRow>
            </TableHead>
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
            <caption>A list of your recent invoices.</caption>
            <TableHead>
                <TableRow>
                    <TableCell className="w-[100px]">Invoice</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell className="text-right">Amount</TableCell>
                </TableRow>
            </TableHead>
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
            <TableHead>
                <TableRow>
                    <TableCell className="w-[100px]">Invoice</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell className="text-right">Amount</TableCell>
                </TableRow>
            </TableHead>
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
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                </TableRow>
            </TableHead>
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
                    <caption className="text-green-600 dark:text-green-400">
                        Custom styled table with green border
                    </caption>
                    <TableHead className="bg-green-50 dark:bg-green-900/30">
                        <TableRow className="border-green-200 dark:border-green-700">
                            <TableCell className="w-[100px] text-green-900 dark:text-green-100">
                                Invoice
                            </TableCell>
                            <TableCell className="text-green-900 dark:text-green-100">
                                Status
                            </TableCell>
                            <TableCell className="text-green-900 dark:text-green-100">
                                Method
                            </TableCell>
                            <TableCell className="text-right text-green-900 dark:text-green-100">
                                Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>
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
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-[100px] py-2">Invoice</TableCell>
                            <TableCell className="py-2">Status</TableCell>
                            <TableCell className="py-2">Method</TableCell>
                            <TableCell className="text-right py-2">Amount</TableCell>
                        </TableRow>
                    </TableHead>
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
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-[100px]">Invoice</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell className="text-right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
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
