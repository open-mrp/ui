import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { ProgressBar } from './ProgressBar';

const meta = {
    title: 'Navigation/ProgressBar',
    component: ProgressBar,
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
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 40,
        ariaLabel: 'Upload progress',
    },
};

export const Empty: Story = {
    args: {
        value: 0,
        ariaLabel: 'No progress',
    },
};

export const Full: Story = {
    args: {
        value: 100,
        ariaLabel: 'Complete',
    },
};

export const Indeterminate: Story = {
    args: {
        value: 0,
        indeterminate: true,
        ariaLabel: 'Loading',
    },
};

export const Thick: Story = {
    args: {
        value: 65,
        className: 'h-3',
        ariaLabel: 'Thicker bar',
    },
};

export const Animated: Story = {
    render: () => {
        const [value, setValue] = useState(0);
        useEffect(() => {
            const id = setInterval(() => {
                setValue((v) => (v >= 100 ? 0 : v + 5));
            }, 300);
            return () => clearInterval(id);
        }, []);
        return (
            <div className="flex flex-col gap-2">
                <ProgressBar value={value} ariaLabel="Animated" />
                <p className="text-xs text-gray-500">{value}%</p>
            </div>
        );
    },
};

export const Steps: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">25%</span>
                <ProgressBar value={25} />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">50%</span>
                <ProgressBar value={50} />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">75%</span>
                <ProgressBar value={75} />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">100%</span>
                <ProgressBar value={100} />
            </div>
        </div>
    ),
};
