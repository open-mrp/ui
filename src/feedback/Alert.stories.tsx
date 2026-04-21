import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rocket } from 'lucide-react';

import { Alert } from './Alert';

const meta = {
    title: 'Feedback/Alert',
    component: Alert,
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
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
    args: {
        variant: 'info',
        title: 'Heads up',
        children: 'This is an informational alert.',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        title: 'Order placed',
        children: 'Your order has been placed successfully.',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        title: 'Low stock',
        children: 'Only 3 units remain in inventory.',
    },
};

export const ErrorVariant: Story = {
    name: 'Error',
    args: {
        variant: 'error',
        title: 'Something went wrong',
        children: 'Failed to fetch the latest data. Please try again.',
    },
};

export const WithoutTitle: Story = {
    args: {
        variant: 'info',
        children: 'A short, standalone message without a bold title.',
    },
};

export const TitleOnly: Story = {
    args: {
        variant: 'success',
        title: 'Saved',
    },
};

export const CustomIcon: Story = {
    args: {
        variant: 'info',
        title: 'New feature',
        icon: <Rocket className="h-4 w-4" />,
        children: 'Ship faster with the new deployment pipeline.',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Alert variant="info" title="Info">
                Informational context for the user.
            </Alert>
            <Alert variant="success" title="Success">
                The action completed successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
                Something needs your attention.
            </Alert>
            <Alert variant="error" title="Error">
                The action could not be completed.
            </Alert>
        </div>
    ),
};
