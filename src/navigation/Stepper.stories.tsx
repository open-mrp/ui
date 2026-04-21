import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Stepper, type StepperStep } from './Stepper';

const steps: StepperStep[] = [
    { label: 'Cart', description: 'Review your items' },
    { label: 'Shipping', description: 'Where it goes' },
    { label: 'Payment', description: 'How you pay' },
    { label: 'Confirm', description: 'Review and submit' },
];

const meta = {
    title: 'Navigation/Stepper',
    component: Stepper,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[640px]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        steps,
        activeIndex: 1,
    },
};

export const FirstStep: Story = {
    args: {
        steps,
        activeIndex: 0,
    },
};

export const LastStep: Story = {
    args: {
        steps,
        activeIndex: steps.length - 1,
    },
};

export const Vertical: Story = {
    args: {
        steps,
        activeIndex: 1,
        orientation: 'vertical',
    },
};

export const Interactive: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(1);
        const [maxReached, setMaxReached] = useState(1);
        return (
            <div className="flex flex-col gap-6">
                <Stepper
                    steps={steps}
                    activeIndex={activeIndex}
                    maxReachableIndex={maxReached}
                    onStepClick={setActiveIndex}
                />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="rounded bg-[var(--primary)] px-3 py-1 text-sm text-white disabled:opacity-50"
                        disabled={activeIndex === steps.length - 1}
                        onClick={() => {
                            const next = Math.min(steps.length - 1, activeIndex + 1);
                            setActiveIndex(next);
                            setMaxReached((m) => Math.max(m, next));
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    },
};
