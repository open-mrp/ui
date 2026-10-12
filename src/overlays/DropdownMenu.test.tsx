import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './DropdownMenu';

jest.mock('@floating-ui/react-dom', () => ({
    ...jest.requireActual('@floating-ui/react-dom'),
    autoUpdate: () => () => {},
}));

function BasicMenu({ onSort }: { onSort: (direction: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button type="button">Column menu</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onSort('asc')}>Sort ascending</DropdownMenuItem>
                <DropdownMenuItem disabled onClick={() => onSort('hidden')}>
                    Hide column
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort('desc')}>Sort descending</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function openWithPointer(trigger: HTMLElement) {
    act(() => {
        trigger.dispatchEvent(
            new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
        );
    });
}

describe('DropdownMenu', () => {
    it('opens on pointer down and reflects state on the trigger', () => {
        render(<BasicMenu onSort={() => {}} />);
        const trigger = screen.getByRole('button', { name: 'Column menu' });
        expect(trigger).toHaveAttribute('data-state', 'closed');
        expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

        openWithPointer(trigger);

        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(trigger).toHaveAttribute('data-state', 'open');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('runs the item handler, closes and returns focus to the trigger', async () => {
        const onSort = jest.fn();
        render(<BasicMenu onSort={onSort} />);
        const trigger = screen.getByRole('button', { name: 'Column menu' });
        openWithPointer(trigger);

        await userEvent.click(screen.getByRole('menuitem', { name: 'Sort descending' }));

        expect(onSort).toHaveBeenCalledWith('desc');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it('opens from the keyboard and skips disabled items', async () => {
        const onSort = jest.fn();
        render(<BasicMenu onSort={onSort} />);
        const trigger = screen.getByRole('button', { name: 'Column menu' });
        trigger.focus();

        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Sort ascending' })).toHaveFocus();

        await userEvent.keyboard('{ArrowDown}');
        expect(screen.getByRole('menuitem', { name: 'Sort descending' })).toHaveFocus();

        await userEvent.keyboard('{Enter}');
        expect(onSort).toHaveBeenCalledWith('desc');
        expect(onSort).not.toHaveBeenCalledWith('hidden');
    });

    it('leaves focus alone when onCloseAutoFocus is prevented', async () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Column</DropdownMenuTrigger>
                <DropdownMenuContent onCloseAutoFocus={(event) => event.preventDefault()}>
                    <DropdownMenuItem>Pin</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        const trigger = screen.getByRole('button', { name: 'Column' });
        openWithPointer(trigger);

        await userEvent.click(screen.getByRole('menuitem', { name: 'Pin' }));

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).not.toHaveFocus();
    });

    it('closes on Escape', async () => {
        render(<BasicMenu onSort={() => {}} />);
        const trigger = screen.getByRole('button', { name: 'Column menu' });
        trigger.focus();
        await userEvent.keyboard('{ArrowDown}');

        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it('toggles checkbox and radio items', async () => {
        function Options() {
            const [checked, setChecked] = useState(false);
            const [position, setPosition] = useState('top');
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>Options</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                            Status bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        render(<Options />);
        const trigger = screen.getByRole('button', { name: 'Options' });

        openWithPointer(trigger);
        await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Status bar' }));
        openWithPointer(trigger);
        expect(screen.getByRole('menuitemcheckbox', { name: 'Status bar' })).toHaveAttribute(
            'aria-checked',
            'true',
        );

        await userEvent.click(screen.getByRole('menuitemradio', { name: 'Bottom' }));
        openWithPointer(trigger);
        expect(screen.getByRole('menuitemradio', { name: 'Bottom' })).toHaveAttribute(
            'aria-checked',
            'true',
        );
        expect(screen.getByRole('menuitemradio', { name: 'Top' })).toHaveAttribute(
            'aria-checked',
            'false',
        );
    });

    it('opens a submenu with ArrowRight and closes it with ArrowLeft', async () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Tools</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>New tab</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Developer tools</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Console</DropdownMenuItem>
                            <DropdownMenuItem>Network</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>,
        );
        screen.getByRole('button', { name: 'Tools' }).focus();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        const subTrigger = screen.getByRole('menuitem', { name: 'Developer tools' });
        expect(subTrigger).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        expect(screen.getAllByRole('menu')).toHaveLength(2);
        expect(screen.getByRole('menuitem', { name: 'Console' })).toHaveFocus();

        await userEvent.keyboard('{ArrowLeft}');
        expect(screen.getAllByRole('menu')).toHaveLength(1);
        expect(subTrigger).toHaveFocus();
    });
});
