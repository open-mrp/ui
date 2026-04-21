import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Button from '../buttons/Button';
import { Input } from '../forms/Input';
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './Dialog';

const meta: Meta<typeof Dialog> = {
    title: 'Overlays/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="contained">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col gap-3">
                        <Input label="Name" defaultValue="Ada Lovelace" />
                        <Input label="Email" type="email" defaultValue="ada@example.com" />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outlined">Cancel</Button>
                    </DialogClose>
                    <Button variant="contained">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Confirmation: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outlined">Delete warehouse</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete this warehouse?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. All inventory must be transferred
                        before the warehouse can be deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outlined">Cancel</Button>
                    </DialogClose>
                    <Button variant="contained">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const LongContent: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="contained">View terms</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Terms of service</DialogTitle>
                    <DialogDescription>Effective April 21, 2026</DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col gap-3 text-sm">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <p key={i}>
                                Section {i + 1}. Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        ))}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="contained">I agree</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <div className="flex flex-col items-center gap-3">
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Open from external button
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Controlled dialog</DialogTitle>
                            <DialogDescription>
                                Opened and closed by external state.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="contained" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    },
};
