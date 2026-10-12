import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Autocomplete } from './Autocomplete';
import { TextField } from './TextField';

jest.mock('@floating-ui/react-dom', () => ({
    ...jest.requireActual('@floating-ui/react-dom'),
    autoUpdate: () => () => {},
}));

const few = ['Apple', 'Banana', 'Cherry'];
const many = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

function renderAutocomplete(options: string[]) {
    return render(
        <Autocomplete
            options={options}
            renderInput={(params) => <TextField {...params} label="Fruit" />}
        />,
    );
}

describe('Autocomplete', () => {
    const offsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            get: () => 300,
        });
    });
    afterAll(() => {
        if (offsetHeight)
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', offsetHeight);
    });

    it('renders every option for short lists', async () => {
        renderAutocomplete(few);
        await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).not.toHaveAttribute('aria-setsize');
    });

    it('virtualizes long lists and keeps the full size for assistive tech', async () => {
        renderAutocomplete(many);
        await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));

        const options = screen.getAllByRole('option');
        expect(options.length).toBeLessThan(many.length);
        expect(options[0]).toHaveAttribute('aria-setsize', '1000');
        expect(options[0]).toHaveAttribute('aria-posinset', '1');
    });

    it('renders filtered results without virtualization once the list is short', async () => {
        renderAutocomplete(many);
        const input = screen.getByRole('combobox', { name: 'Fruit' });
        await userEvent.type(input, 'Item 99');

        expect(screen.getAllByRole('option')).toHaveLength(11);
    });
});
