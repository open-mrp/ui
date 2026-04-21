import type { Meta, StoryObj } from '@storybook/react-vite';

import HomeTextLayer from './HomeTextLayer';

const meta = {
    title: 'Home/HomeTextLayer',
    component: HomeTextLayer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="relative h-48 w-[480px] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof HomeTextLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        style: {
            top: '1.5rem',
            left: '1.5rem',
            fontSize: '3rem',
            fontWeight: 900,
            color: 'var(--primary)',
        },
        children: 'AUGNO',
    },
};

export const Centered: Story = {
    args: {
        style: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#111',
        },
        children: 'Positioned absolutely',
    },
};

export const Tinted: Story = {
    args: {
        style: {
            top: '1rem',
            left: '1rem',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#ff2d55',
            mixBlendMode: 'multiply',
        },
        children: 'TINTED',
    },
};
