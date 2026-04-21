import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Checkbox } from './Checkbox';

const meta = {
    title: 'Forms/Checkbox',
    component: Checkbox,
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithLabel: Story = {
    args: {
        label: 'Accept terms and conditions',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Subscribe to newsletter',
        helperText: 'We send updates once a month',
    },
};

export const Checked: Story = {
    args: {
        label: 'Pre-selected option',
        defaultChecked: true,
    },
};

export const Indeterminate: Story = {
    render: () => {
        const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');
        return (
            <Checkbox
                checked={checked}
                onCheckedChange={(v) => setChecked(v)}
                label="Partial selection"
                helperText="Click to toggle through indeterminate → checked → unchecked"
            />
        );
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Checkbox size="sm" label="Small" defaultChecked />
            <Checkbox size="md" label="Medium (default)" defaultChecked />
        </div>
    ),
};

export const ErrorState: Story = {
    args: {
        label: 'Accept terms',
        error: true,
        helperText: 'You must accept the terms to continue',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Locked option',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Locked selected option',
        disabled: true,
        defaultChecked: true,
    },
};

export const Group: Story = {
    render: () => {
        const [selected, setSelected] = useState<Record<string, boolean>>({
            email: true,
            sms: false,
            push: false,
        });
        const toggle = (k: string) => setSelected((s) => ({ ...s, [k]: !s[k] }));
        return (
            <div className="flex flex-col gap-2">
                <Checkbox
                    label="Email notifications"
                    checked={selected.email}
                    onCheckedChange={() => toggle('email')}
                />
                <Checkbox
                    label="SMS notifications"
                    checked={selected.sms}
                    onCheckedChange={() => toggle('sms')}
                />
                <Checkbox
                    label="Push notifications"
                    checked={selected.push}
                    onCheckedChange={() => toggle('push')}
                />
            </div>
        );
    },
};
