import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import CodeCopyButton from './CodeCopyButton';

const meta = {
    title: 'Code/CodeCopyButton',
    component: CodeCopyButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="relative h-32 w-[480px] rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-100">
                <code>console.log('Hello, world!');</code>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CodeCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
    args: {
        isHovering: true,
        copied: false,
        onCopy: () => undefined,
    },
};

export const Hidden: Story = {
    args: {
        isHovering: false,
        copied: false,
        onCopy: () => undefined,
    },
};

export const Copied: Story = {
    args: {
        isHovering: true,
        copied: true,
        onCopy: () => undefined,
    },
};

export const Interactive: Story = {
    render: () => {
        const [copied, setCopied] = useState(false);
        return (
            <CodeCopyButton
                isHovering
                copied={copied}
                onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }}
            />
        );
    },
};
