import type { Meta, StoryObj } from '@storybook/react-vite';

import DocChecklist, { DocChecklistItem } from './DocChecklist';

const meta = {
    title: 'Markdown/DocChecklist',
    component: DocChecklist,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-2xl px-6 py-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DocChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <DocChecklist storageKey="storybook-getting-started">
            <DocChecklistItem id="install">
                <strong>Install the CLI.</strong> Run <code>npm install -g openmrp</code> to get
                started.
            </DocChecklistItem>
            <DocChecklistItem id="auth">
                <strong>Authenticate.</strong> Run <code>openmrp login</code> and paste your API
                token when prompted.
            </DocChecklistItem>
            <DocChecklistItem id="create">
                <strong>Create a warehouse.</strong> Add your first inventory location from
                the dashboard.
            </DocChecklistItem>
            <DocChecklistItem id="sku">
                <strong>Add your first SKU.</strong> Import from CSV or create one manually.
            </DocChecklistItem>
        </DocChecklist>
    ),
};

export const ShortList: Story = {
    render: () => (
        <DocChecklist storageKey="storybook-short">
            <DocChecklistItem id="one">First step</DocChecklistItem>
            <DocChecklistItem id="two">Second step</DocChecklistItem>
        </DocChecklist>
    ),
};

export const LongList: Story = {
    render: () => (
        <DocChecklist storageKey="storybook-long">
            {Array.from({ length: 8 }).map((_, i) => (
                <DocChecklistItem key={i} id={`item-${i}`}>
                    Milestone {i + 1}: do the thing described in step {i + 1}.
                </DocChecklistItem>
            ))}
        </DocChecklist>
    ),
};
