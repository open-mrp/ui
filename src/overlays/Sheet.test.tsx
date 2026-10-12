import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './Sheet';

describe('Sheet', () => {
    const getClientRects = HTMLElement.prototype.getClientRects;
    beforeAll(() => {
        HTMLElement.prototype.getClientRects = function () {
            return [this.getBoundingClientRect()] as unknown as DOMRectList;
        };
    });
    afterAll(() => {
        HTMLElement.prototype.getClientRects = getClientRects;
    });

    it('opens from its trigger as a labelled modal dialog', async () => {
        render(
            <Sheet>
                <SheetTrigger asChild>
                    <button type="button">Edit</button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit address</SheetTitle>
                        <SheetDescription>Update the shipping address.</SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                        <input aria-label="Street" />
                    </SheetBody>
                </SheetContent>
            </Sheet>,
        );
        const trigger = screen.getByRole('button', { name: 'Edit' });
        expect(trigger).toHaveAttribute('data-state', 'closed');

        await userEvent.click(trigger);

        const dialog = screen.getByRole('dialog', { name: 'Edit address' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('data-state', 'open');
        expect(dialog).toHaveAccessibleDescription('Update the shipping address.');
        expect(trigger).toHaveAttribute('data-state', 'open');
        expect(screen.getByRole('textbox', { name: 'Street' })).toHaveFocus();
    });

    it('asks to close on Escape and the close button when controlled', async () => {
        const onOpenChange = jest.fn();
        function Controlled() {
            const [open, setOpen] = useState(true);
            return (
                <Sheet
                    open={open}
                    onOpenChange={(next) => {
                        onOpenChange(next);
                        setOpen(next);
                    }}
                >
                    <SheetContent>
                        <SheetTitle>Details</SheetTitle>
                    </SheetContent>
                </Sheet>
            );
        }
        render(<Controlled />);

        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('stays open when the owner ignores the close request', async () => {
        render(
            <Sheet open onOpenChange={() => {}}>
                <SheetContent>
                    <SheetTitle>Saving</SheetTitle>
                </SheetContent>
            </Sheet>,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.getByRole('dialog', { name: 'Saving' })).toBeInTheDocument();
    });
});
