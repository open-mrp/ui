import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Switch } from './Switch';

const meta = {
    title: 'Forms/Switch',
    component: Switch,
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Basic
// ---------------------------------------------------------------------------

export const Default: Story = {
    args: {},
};

export const WithLabel: Story = {
    args: {
        label: 'Enable notifications',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Auto-sync',
        helperText: 'Automatically sync changes every 5 minutes',
    },
};

export const LabelLeft: Story = {
    args: {
        label: 'Dark mode',
        labelPosition: 'left',
    },
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Switch size="sm" label="Small" defaultChecked />
            <Switch size="md" label="Medium (default)" defaultChecked />
            <Switch size="lg" label="Large" defaultChecked />
        </div>
    ),
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const ErrorState: Story = {
    args: {
        label: 'Accept terms',
        error: true,
        helperText: 'You must accept the terms to continue',
        defaultChecked: false,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Read-only setting',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Active subscription',
        disabled: true,
        defaultChecked: true,
    },
};

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------

export const Controlled: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="flex flex-col gap-2">
                <Switch
                    checked={checked}
                    onCheckedChange={setChecked}
                    label="Controlled switch"
                />
                <p className="text-xs text-gray-500">
                    State: {checked ? 'on' : 'off'}
                </p>
            </div>
        );
    },
};
