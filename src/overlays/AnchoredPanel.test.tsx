import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { AnchoredPanel } from './AnchoredPanel';

jest.mock('@floating-ui/react-dom', () => ({
    ...jest.requireActual('@floating-ui/react-dom'),
    autoUpdate: () => () => {},
}));

function Example({ onDismiss }: { onDismiss: (reason: string) => void }) {
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    return (
        <>
            <button ref={setAnchor} type="button" onClick={() => setOpen((value) => !value)}>
                Account
            </button>
            <button type="button">Elsewhere</button>
            <AnchoredPanel
                open={open}
                anchor={anchor}
                side="bottom"
                align="start"
                collisionPadding={8}
                role="dialog"
                aria-label="Accounts"
                onDismiss={(_, reason) => {
                    onDismiss(reason);
                    setOpen(false);
                }}
            >
                <input aria-label="Search accounts" />
            </AnchoredPanel>
        </>
    );
}

describe('AnchoredPanel', () => {
    it('dismisses on Escape and returns focus to the anchor', async () => {
        const onDismiss = jest.fn();
        render(<Example onDismiss={onDismiss} />);
        await userEvent.click(screen.getByRole('button', { name: 'Account' }));
        const panel = screen.getByRole('dialog', { name: 'Accounts' });
        expect(panel).toHaveAttribute('data-side', 'bottom');
        expect(panel).toHaveAttribute('data-align', 'start');
        await userEvent.click(screen.getByRole('textbox', { name: 'Search accounts' }));

        await userEvent.keyboard('{Escape}');

        expect(onDismiss).toHaveBeenCalledWith('escapeKeyDown');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Account' })).toHaveFocus();
    });

    it('dismisses on outside pointer down but not on the anchor', async () => {
        const onDismiss = jest.fn();
        render(<Example onDismiss={onDismiss} />);
        const anchor = screen.getByRole('button', { name: 'Account' });
        await userEvent.click(anchor);
        await userEvent.click(anchor);
        expect(onDismiss).not.toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        await userEvent.click(anchor);
        await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));

        expect(onDismiss).toHaveBeenCalledWith('outsidePointer');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
