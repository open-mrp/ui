import '@/styles/atom-one-dark.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import InlineCode from './InlineCode';

const meta = {
    component: InlineCode,
    title: 'Code/InlineCode',
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-4 dark:bg-background text-white">
                <p className="text-lg">
                    This is a paragraph with <Story /> inline code.
                </p>
            </div>
        ),
    ],
} satisfies Meta<typeof InlineCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'const x = 42',
    },
};

export const FunctionName: Story = {
    args: {
        children: 'useState()',
    },
};

export const VariableName: Story = {
    args: {
        children: 'userData',
    },
};

export const Command: Story = {
    args: {
        children: 'npm install',
    },
};

export const TemplateLiteral: Story = {
    args: {
        children: '`Hello ${name}`',
    },
};

export const TypeAnnotation: Story = {
    args: {
        children: 'string | number',
    },
};
