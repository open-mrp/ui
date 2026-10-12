import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Button } from '../buttons/Button';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './Sheet';

const meta: Meta<typeof Sheet> = {
    title: 'Overlays/Sheet',
    component: Sheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outlined">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>Manage your application settings here.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Theme</label>
                            <p className="text-sm text-muted-foreground">
                                Choose your preferred theme
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Notifications</label>
                            <p className="text-sm text-muted-foreground">
                                Configure notification preferences
                            </p>
                        </div>
                    </div>
                </SheetBody>
                <SheetFooter>
                    <Button variant="outlined">Cancel</Button>
                    <Button>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const LeftSide: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outlined">Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>Browse through the menu options.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                    <div className="space-y-2">
                        <Button variant="text" className="w-full justify-start">
                            Home
                        </Button>
                        <Button variant="text" className="w-full justify-start">
                            About
                        </Button>
                        <Button variant="text" className="w-full justify-start">
                            Contact
                        </Button>
                    </div>
                </SheetBody>
            </SheetContent>
        </Sheet>
    ),
};

export const TopSide: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outlined">Open Top Sheet</Button>
            </SheetTrigger>
            <SheetContent side="top">
                <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                    <SheetDescription>Access frequently used features.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                    <div className="flex gap-2">
                        <Button size="small">New Document</Button>
                        <Button size="small" variant="outlined">
                            Import
                        </Button>
                        <Button size="small" variant="outlined">
                            Export
                        </Button>
                    </div>
                </SheetBody>
            </SheetContent>
        </Sheet>
    ),
};

export const BottomSide: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outlined">Open Bottom Sheet</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Share</SheetTitle>
                    <SheetDescription>Share this content with others.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                    <div className="flex gap-2">
                        <Button size="small" variant="outlined">
                            Copy Link
                        </Button>
                        <Button size="small" variant="outlined">
                            Email
                        </Button>
                        <Button size="small" variant="outlined">
                            Social Media
                        </Button>
                    </div>
                </SheetBody>
            </SheetContent>
        </Sheet>
    ),
};
