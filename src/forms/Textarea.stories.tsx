import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Textarea } from './Textarea';

const meta = {
    title: 'Forms/Textarea',
    component: Textarea,
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Type your message…',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Description',
        placeholder: 'Describe the item in detail…',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Notes',
        placeholder: 'Any internal notes to attach to this order…',
        helperText: 'Only visible to your team.',
    },
};

export const Rows: Story = {
    args: {
        label: 'Long-form field',
        rows: 8,
        placeholder: 'Taller textarea for longer content.',
    },
};

export const ErrorState: Story = {
    args: {
        label: 'Feedback',
        error: true,
        helperText: 'Feedback must be at least 10 characters',
        defaultValue: 'Too short',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Read-only note',
        disabled: true,
        defaultValue: 'This content cannot be edited right now.',
    },
};

export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState('');
        const max = 140;
        const over = value.length > max;
        return (
            <Textarea
                label="Short bio"
                placeholder="Tell us about yourself…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={over}
                helperText={`${value.length} / ${max}`}
            />
        );
    },
};
