import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from './Dialog';

function Example({
    mountOnOpen,
    autoFocus = false,
}: {
    mountOnOpen: boolean;
    autoFocus?: boolean;
}) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open
            </button>
            {(!mountOnOpen || open) && (
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Details</DialogTitle>
                    <DialogContent>
                        <input aria-label="Name" autoFocus={autoFocus} />
                        <button type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

describe.each([
    ['always mounted', false, false, false],
    ['always mounted in StrictMode', true, false, false],
    ['mounted when opened', false, true, false],
    ['mounted when opened in StrictMode', true, true, false],
    ['with an autoFocus field', false, false, true],
    ['mounted when opened with an autoFocus field in StrictMode', true, true, true],
])('Modal focus restore (%s)', (_, strict, mountOnOpen, autoFocus) => {
    function renderExample() {
        const example = <Example mountOnOpen={mountOnOpen} autoFocus={autoFocus} />;
        return render(strict ? <StrictMode>{example}</StrictMode> : example);
    }

    it('returns focus to the opener after Escape', async () => {
        renderExample();
        const opener = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(opener);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(opener).toHaveFocus();
    });

    it('returns focus to the opener after closing from inside', async () => {
        renderExample();
        const opener = screen.getByRole('button', { name: 'Open' });
        await userEvent.click(opener);

        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(opener).toHaveFocus();
    });
});
