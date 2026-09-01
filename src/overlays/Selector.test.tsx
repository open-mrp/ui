import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Selector } from './Selector';

const OPTIONS = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
];

function ClearableSelector() {
    const [value, setValue] = useState<string | null>('apple');
    return <Selector options={OPTIONS} value={value} onChange={setValue} clearable />;
}

function ClearableMultiSelector() {
    const [value, setValue] = useState<string[]>(['apple']);
    return <Selector mode="multi" options={OPTIONS} value={value} onChange={setValue} clearable />;
}

describe('Selector', () => {
    it('does not nest the clear button inside a button', () => {
        render(<ClearableSelector />);

        const combobox = screen.getByRole('combobox');
        const clear = screen.getByRole('button', { name: 'Clear selection' });

        expect(combobox.tagName).not.toBe('BUTTON');
        expect(clear.parentElement?.closest('button')).toBeNull();
    });

    it('does not nest pill remove buttons inside a button', () => {
        render(<ClearableMultiSelector />);

        const combobox = screen.getByRole('combobox');
        const remove = screen.getByRole('button', { name: 'Remove Apple' });

        expect(combobox.tagName).not.toBe('BUTTON');
        expect(remove.parentElement?.closest('button')).toBeNull();
    });

    it('clears the selection without opening the list', async () => {
        const user = userEvent.setup();
        render(<ClearableSelector />);

        await user.click(screen.getByRole('button', { name: 'Clear selection' }));

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
        expect(screen.getByText('Select...')).toBeInTheDocument();
    });
});
