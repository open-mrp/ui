import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Button } from '../buttons/ShadButton';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Selector } from './Selector';

const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
];

const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
];

const meta: Meta<typeof Popover> = {
    title: 'Overlays/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                        This is a popover with some content inside.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const WithForm: Story = {
    render: () => {
        const [theme, setTheme] = React.useState<string | null>(null);
        const [language, setLanguage] = React.useState<string | null>(null);

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Settings</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-4">
                        <h4 className="font-medium">Settings</h4>
                        <div className="space-y-2">
                            <Selector
                                label="Theme"
                                placeholder="Select theme"
                                value={theme}
                                onChange={setTheme}
                                options={themeOptions}
                            />
                        </div>
                        <div className="space-y-2">
                            <Selector
                                label="Language"
                                placeholder="Select language"
                                value={language}
                                onChange={setLanguage}
                                options={languageOptions}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                                Cancel
                            </Button>
                            <Button size="sm">Save</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    },
};

export const WithList: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Actions</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                        Edit
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        Duplicate
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        Share
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-600">
                        Delete
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    ),
};
