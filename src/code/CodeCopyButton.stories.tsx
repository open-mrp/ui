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
            <div className="group relative h-32 w-[480px] rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-100">
                <code>console.log('Hello, world!');</code>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CodeCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// The button reveals itself on hover/focus of the surrounding `group` container
// (and stays visible on touch devices). Hover the preview to see it.
export const Idle: Story = {
    args: {
        copied: false,
        onCopy: () => undefined,
    },
};

export const Copied: Story = {
    args: {
        copied: true,
        onCopy: () => undefined,
    },
};

export const Interactive: Story = {
    render: () => {
        const [copied, setCopied] = useState(false);
        return (
            <CodeCopyButton
                copied={copied}
                onCopy={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }}
            />
        );
    },
};
