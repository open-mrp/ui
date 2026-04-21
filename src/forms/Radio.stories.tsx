import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Radio, RadioGroup } from './Radio';

const meta = {
    title: 'Forms/Radio',
    component: Radio,
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
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="standard">
            <Radio value="standard" label="Standard shipping" />
            <Radio value="express" label="Express shipping" />
            <Radio value="overnight" label="Overnight shipping" />
        </RadioGroup>
    ),
};

export const WithDescriptions: Story = {
    render: () => (
        <RadioGroup defaultValue="standard">
            <Radio
                value="standard"
                label="Standard"
                description="Arrives in 5–7 business days. Free."
            />
            <Radio
                value="express"
                label="Express"
                description="Arrives in 2–3 business days. $9.99."
            />
            <Radio
                value="overnight"
                label="Overnight"
                description="Arrives the next business day. $24.99."
            />
        </RadioGroup>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <RadioGroup defaultValue="a">
                <Radio size="sm" value="a" label="Small radio" />
                <Radio size="sm" value="b" label="Another small radio" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
                <Radio size="md" value="a" label="Medium radio (default)" />
                <Radio size="md" value="b" label="Another medium radio" />
            </RadioGroup>
        </div>
    ),
};

export const ErrorState: Story = {
    render: () => (
        <RadioGroup>
            <Radio value="a" label="Option A" error />
            <Radio value="b" label="Option B" error />
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue="b">
            <Radio value="a" label="Enabled option" />
            <Radio value="b" label="Locked choice" disabled />
            <Radio value="c" label="Another locked option" disabled />
        </RadioGroup>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState('monthly');
        return (
            <div className="flex flex-col gap-2">
                <RadioGroup value={value} onValueChange={setValue}>
                    <Radio
                        value="monthly"
                        label="Monthly"
                        description="$10/month, billed every month"
                    />
                    <Radio
                        value="yearly"
                        label="Yearly"
                        description="$96/year, saves 20%"
                    />
                </RadioGroup>
                <p className="text-xs text-gray-500">Selected: {value}</p>
            </div>
        );
    },
};
