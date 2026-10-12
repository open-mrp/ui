import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

import { Dialog } from './Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './DropdownMenu';
import { isInsideOverlay } from './overlay';
import { Popover } from './Popover';
import { Popper } from './Popper';
import { Selector } from './Selector';
import { Tooltip } from './Tooltip';

beforeAll(() => {
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

describe('isInsideOverlay', () => {
    it('is false for page content and non-elements', () => {
        render(<button type="button">page</button>);
        expect(isInsideOverlay(screen.getByRole('button', { name: 'page' }))).toBe(false);
        expect(isInsideOverlay(null)).toBe(false);
        expect(isInsideOverlay(document)).toBe(false);
    });

    it('is true inside a Popper', () => {
        const anchor = document.createElement('div');
        document.body.appendChild(anchor);
        render(
            <Popper open anchorEl={anchor}>
                <button type="button">in popper</button>
            </Popper>
        );
        expect(isInsideOverlay(screen.getByRole('button', { name: 'in popper' }))).toBe(true);
        anchor.remove();
    });

    it('is true inside a Popover', () => {
        render(
            <Popover open anchorEl={document.body}>
                <button type="button">in popover</button>
            </Popover>
        );
        expect(isInsideOverlay(screen.getByRole('button', { name: 'in popover' }))).toBe(true);
    });

    it('is true inside a Dialog', () => {
        render(
            <Dialog open>
                <button type="button">in dialog</button>
            </Dialog>
        );
        expect(isInsideOverlay(screen.getByRole('button', { name: 'in dialog' }))).toBe(true);
    });

    it('is true inside a Tooltip', async () => {
        render(
            <Tooltip title="tip text" open>
                <button type="button">anchor</button>
            </Tooltip>
        );
        expect(isInsideOverlay(await screen.findByText('tip text'))).toBe(true);
    });

    it('is true inside a DropdownMenu', async () => {
        render(
            <DropdownMenu open>
                <DropdownMenuTrigger>menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>menu item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(isInsideOverlay(await screen.findByText('menu item'))).toBe(true);
    });

    it('is true inside a Selector listbox', async () => {
        function Harness() {
            const [value, setValue] = useState<string | null>(null);
            return (
                <Selector
                    options={[{ label: 'Apple', value: 'apple' }]}
                    value={value}
                    onChange={setValue}
                />
            );
        }
        render(<Harness />);
        fireEvent.pointerDown(screen.getByRole('combobox'), { button: 0, pointerType: 'mouse' });
        fireEvent.click(screen.getByRole('combobox'));
        expect(isInsideOverlay(await screen.findByRole('listbox'))).toBe(true);
    });
});
