import type { Meta, StoryObj } from '@storybook/react-vite';

import DocTab from './DocTab';

const meta = {
    title: 'Markdown/DocTab',
    component: DocTab,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[480px] border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                    <Story />
                </div>
            </div>
        ),
    ],
} satisfies Meta<typeof DocTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TabButtonActive: Story = {
    args: {
        label: 'Overview',
        showContent: false,
        isActive: true,
        children: null,
    },
};

export const TabButtonInactive: Story = {
    args: {
        label: 'Details',
        showContent: false,
        isActive: false,
        children: null,
    },
};

export const TabPanelActive: Story = {
    decorators: [
        (Story) => (
            <div className="w-[480px] p-4">
                <Story />
            </div>
        ),
    ],
    args: {
        label: 'Overview',
        showContent: true,
        isActive: true,
        children: (
            <p className="text-sm">
                This panel renders only when the tab is the active tab. For full composition with a
                tab bar, see <code>DocTabs</code>.
            </p>
        ),
    },
};

export const TabPanelInactive: Story = {
    decorators: [
        (Story) => (
            <div className="w-[480px] p-4 text-sm text-gray-500">
                Nothing should render below:
                <Story />
            </div>
        ),
    ],
    args: {
        label: 'Details',
        showContent: true,
        isActive: false,
        children: <p>This will not render.</p>,
    },
};
