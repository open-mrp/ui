import type { Meta, StoryObj } from '@storybook/react-vite';

import BlendText from './BlendText';

const meta = {
    title: 'Home/BlendText',
    component: BlendText,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div
                className="relative flex h-64 w-[640px] items-center justify-center overflow-hidden rounded-lg"
                style={{
                    background:
                        'radial-gradient(circle at 30% 30%, #ff9a00 0%, #ff2d55 40%, #111 100%)',
                }}
            >
                <div className="relative text-6xl font-black tracking-tight">
                    <Story />
                </div>
            </div>
        ),
    ],
} satisfies Meta<typeof BlendText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => <BlendText {...args}>AUGNO</BlendText>,
    args: {},
};

export const Overlay: Story = {
    render: (args) => <BlendText {...args}>OVERLAY</BlendText>,
    args: {
        blendMode: 'overlay',
        color: '#ffffff',
        revertColor: '#000000',
    },
};

export const Difference: Story = {
    render: (args) => <BlendText {...args}>DIFFERENCE</BlendText>,
    args: {
        blendMode: 'difference',
        color: '#ffffff',
        revertColor: '#ffffff',
    },
};

export const Lighten: Story = {
    render: (args) => <BlendText {...args}>LIGHTEN</BlendText>,
    args: {
        blendMode: 'lighten',
        color: '#5a5a5a',
        revertColor: '#fff',
        revertOpacity: 0.5,
    },
};

export const SoftLight: Story = {
    render: (args) => <BlendText {...args}>SOFT</BlendText>,
    args: {
        blendMode: 'soft-light',
        color: '#ffffff',
        revertColor: '#000000',
        revertOpacity: 0.6,
    },
};
