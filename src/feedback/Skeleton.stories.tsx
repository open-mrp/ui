import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './Skeleton';

const meta = {
    title: 'Feedback/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[360px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
    args: {
        variant: 'text',
    },
};

export const Rect: Story = {
    args: {
        variant: 'rect',
        className: 'h-24 w-full',
    },
};

export const Circle: Story = {
    args: {
        variant: 'circle',
        className: 'h-12 w-12',
    },
};

export const CardSkeleton: Story = {
    render: () => (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/3" />
                </div>
            </div>
            <Skeleton variant="rect" className="h-32 w-full" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-4/5" />
        </div>
    ),
};

export const ListSkeleton: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton variant="circle" className="h-8 w-8" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton variant="text" className="w-2/3" />
                        <Skeleton variant="text" className="w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    ),
};
