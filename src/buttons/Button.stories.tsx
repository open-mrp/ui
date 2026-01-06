import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { fn } from 'storybook/test';
import { WaveShader } from '../shaders/wave-shader';
import Button from './Button';

export const ActionsData = {
    onArchiveTask: fn(),
    onPinTask: fn(),
};

const meta = {
    component: Button,
    title: 'Button',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
    args: {
        children: 'Button',
    },
    decorators: [
        (Story) => (
            <div className="p-4 dark:bg-background">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Blur variant decorator
const blurDecorator = (Story: any) => (
    <div className="inline-block p-32 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0">
            <WaveShader colorConfiguration="default" height={400} width={400} animate={true} />
        </div>
        <div className="relative">
            <Story />
        </div>
    </div>
);

// Contained Variant Stories
export const ContainedPrimary: Story = {
    args: {
        variant: 'contained',
        color: 'red',
        children: 'Contained Primary',
    },
};

export const ContainedSecondary: Story = {
    args: {
        variant: 'contained',
        color: 'blue',
        children: 'Contained Secondary',
    },
};

export const ContainedGray: Story = {
    args: {
        variant: 'contained',
        color: 'grey',
        children: 'Contained Gray',
    },
};

export const ContainedBlur: Story = {
    args: {
        variant: 'contained',
        blur: true,
        children: 'Contained Blur',
    },
    decorators: [blurDecorator],
};

// Custom Color Stories
export const ContainedBlue: Story = {
    args: {
        variant: 'contained',
        color: 'blue',
        children: 'Contained Blue (Dynamic)',
    },
};

export const ContainedHex: Story = {
    args: {
        variant: 'contained',
        color: '#5048e5',
        children: 'Contained Hex (Dynamic)',
    },
};

export const ContainedVar: Story = {
    args: {
        variant: 'contained',
        color: 'var(--blue)',
        children: 'Contained Var (Dynamic)',
    },
};

export const OutlinedDynamic: Story = {
    args: {
        variant: 'outlined',
        color: '#10b981',
        children: 'Outlined Dynamic',
    },
};

export const BlurDynamic: Story = {
    args: {
        variant: 'contained',
        blur: true,
        color: '#ff4500',
        children: 'Blur Dynamic',
    },
    decorators: [blurDecorator],
};

// Outlined Variant Stories
export const OutlinedPrimary: Story = {
    args: {
        variant: 'outlined',
        color: 'red',
        children: 'Outlined Primary',
    },
};

export const OutlinedSecondary: Story = {
    args: {
        variant: 'outlined',
        color: 'blue',
        children: 'Outlined Secondary',
    },
};

export const OutlinedGray: Story = {
    args: {
        variant: 'outlined',
        color: 'grey',
        children: 'Outlined Gray',
    },
};

export const OutlinedBlur: Story = {
    args: {
        variant: 'outlined',
        blur: true,
        children: 'Outlined Blur',
    },
    decorators: [blurDecorator],
};

// Text Variant Stories
export const TextPrimary: Story = {
    args: {
        variant: 'text',
        color: 'red',
        children: 'Text Primary',
    },
};

export const TextSecondary: Story = {
    args: {
        variant: 'text',
        color: 'blue',
        children: 'Text Secondary',
    },
};

export const TextGray: Story = {
    args: {
        variant: 'text',
        color: 'grey',
        children: 'Text Gray',
    },
};

export const TextBlur: Story = {
    args: {
        variant: 'text',
        blur: true,
        children: 'Text Blur',
    },
    decorators: [blurDecorator],
};

// Size Stories (using red color as default)
export const SmallButton: Story = {
    args: {
        size: 'sm',
        children: 'Small Button',
    },
};

export const DefaultButton: Story = {
    args: {
        size: 'md',
        children: 'Default Button',
    },
};

export const LargeButton: Story = {
    args: {
        size: 'lg',
        children: 'Large Button',
    },
};

// Icon Variant Stories
export const IconButton: Story = {
    args: {
        variant: 'icon',
        children: '🔍',
    },
};

export const IconButtonBlur: Story = {
    args: {
        variant: 'icon',
        blur: true,
        children: '🔍',
    },
    decorators: [blurDecorator],
};

// Disabled State
export const DisabledButton: Story = {
    args: {
        disabled: true,
        children: 'Disabled Button',
    },
};

// Combined Examples
export const BlurredDynamicButton: Story = {
    args: {
        variant: 'contained',
        color: 'var(--red)',
        blur: true,
        children: 'Blurred Dynamic Button',
    },
    decorators: [blurDecorator],
};
