import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '../buttons/Button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = {
    title: 'Layout/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[420px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card>
            <CardBody>A minimal card with only a body.</CardBody>
        </Card>
    ),
};

export const WithHeaderAndBody: Story = {
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Order #A-10482</CardTitle>
                <CardDescription>Placed on Apr 12, 2026</CardDescription>
            </CardHeader>
            <CardBody>
                Ships from the Austin warehouse. Expected delivery in 3–5 business days.
            </CardBody>
        </Card>
    ),
};

export const WithFooter: Story = {
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Delete warehouse</CardTitle>
                <CardDescription>
                    This action cannot be undone. All inventory must be transferred first.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Delete</Button>
            </CardFooter>
        </Card>
    ),
};

export const Unstyled: Story = {
    render: () => (
        <Card unstyled>
            <CardHeader>
                <CardTitle>Frameless card</CardTitle>
                <CardDescription>
                    Renders without border or shadow — useful when nested inside a larger composite
                    that owns the frame.
                </CardDescription>
            </CardHeader>
            <CardBody>
                The card still applies background, text color, and layout — just no chrome.
            </CardBody>
        </Card>
    ),
};

export const Stack: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <CardTitle>SKU-1001</CardTitle>
                    <CardDescription>In stock · 42 units</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>SKU-1002</CardTitle>
                    <CardDescription>Low stock · 3 units</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>SKU-1003</CardTitle>
                    <CardDescription>Out of stock</CardDescription>
                </CardHeader>
            </Card>
        </div>
    ),
};
