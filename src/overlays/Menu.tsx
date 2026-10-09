'use client';

import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type ElementType,
    type FocusEvent,
    type KeyboardEvent,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import { buttonKeyboardHandlers } from '@/buttons/ButtonBase';
import { cn } from '@/utils/cn';
import type { BivariantCallback } from '@/theme/types';
import { ListContext } from '@/layout/List';
import { Popover, type PopoverProps } from './Popover';
import { useForkRef } from '@/hooks/use-fork-ref';

export type MenuCloseReason = 'backdropClick' | 'escapeKeyDown' | 'tabKeyDown';

interface ListContextValue {
    dense: boolean;
    role: 'menuitem' | 'option';
    activeItem: HTMLElement | null;
    roving: boolean;
}

export const MenuListContext = createContext<ListContextValue>({
    dense: false,
    role: 'menuitem',
    activeItem: null,
    roving: false,
});

function getItems(list: HTMLElement): HTMLElement[] {
    return Array.from(list.querySelectorAll<HTMLElement>('[data-menu-item]')).filter(
        item => item.closest('[data-menu-list]') === list
    );
}

function isFocusable(item: HTMLElement, disabledItemsFocusable: boolean): boolean {
    return disabledItemsFocusable || !item.hasAttribute('data-disabled');
}

export interface MenuListProps extends ComponentPropsWithoutRef<'ul'> {
    autoFocus?: boolean;
    autoFocusItem?: boolean;
    disableListWrap?: boolean;
    disabledItemsFocusable?: boolean;
    dense?: boolean;
    variant?: 'menu' | 'selectedMenu';
    itemRole?: 'menuitem' | 'option';
    component?: ElementType;
}

export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(function MenuList(
    {
        autoFocus = false,
        autoFocusItem = false,
        disableListWrap = false,
        disabledItemsFocusable = false,
        dense = false,
        variant = 'selectedMenu',
        itemRole = 'menuitem',
        component,
        className,
        onKeyDown,
        onFocus,
        children,
        role = 'menu',
        ...other
    },
    ref
) {
    const Component = component ?? 'ul';
    const listRef = useRef<HTMLUListElement | null>(null);
    const handleRef = useForkRef(listRef, ref);
    const typeahead = useRef({ keys: [] as string[], last: 0 });
    const [activeItem, setActiveItem] = useState<HTMLElement | null>(null);
    const roving = variant === 'selectedMenu';

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list || !roving) return;
        const items = getItems(list);
        if (
            activeItem &&
            items.includes(activeItem) &&
            isFocusable(activeItem, disabledItemsFocusable)
        )
            return;
        const next =
            items.find(
                item =>
                    item.hasAttribute('data-selected') &&
                    isFocusable(item, disabledItemsFocusable)
            ) ??
            items.find(item => isFocusable(item, disabledItemsFocusable)) ??
            null;
        if (next !== activeItem) setActiveItem(next);
    }, [roving, activeItem, disabledItemsFocusable, children]);

    const handleFocus = (event: FocusEvent<HTMLUListElement>) => {
        onFocus?.(event);
        const list = listRef.current;
        const target = event.target as HTMLElement;
        if (roving && list && target !== list && getItems(list).includes(target))
            setActiveItem(target);
    };

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        if (autoFocusItem) {
            const items = getItems(list);
            const selected =
                variant === 'selectedMenu'
                    ? items.find(item => item.hasAttribute('data-selected'))
                    : undefined;
            const target =
                (selected && isFocusable(selected, disabledItemsFocusable)
                    ? selected
                    : undefined) ?? items.find(item => isFocusable(item, disabledItemsFocusable));
            (target ?? list).focus({ preventScroll: true });
        } else if (autoFocus) {
            list.focus({ preventScroll: true });
        }
    }, [autoFocus, autoFocusItem, variant, disabledItemsFocusable]);

    const move = (
        list: HTMLElement,
        current: Element | null,
        direction: 1 | -1,
        from?: 'start' | 'end'
    ) => {
        const items = getItems(list);
        if (!items.length) return;
        let index =
            from === 'start'
                ? -1
                : from === 'end'
                  ? items.length
                  : items.indexOf(current as HTMLElement);
        for (let attempts = 0; attempts < items.length; attempts += 1) {
            index += direction;
            if (index >= items.length) {
                if (disableListWrap) return;
                index = 0;
            }
            if (index < 0) {
                if (disableListWrap) return;
                index = items.length - 1;
            }
            const item = items[index];
            if (item && isFocusable(item, disabledItemsFocusable)) {
                item.focus();
                if (roving) setActiveItem(item);
                return;
            }
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        const list = listRef.current;
        if (!list) return;
        const current = document.activeElement;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            move(list, current, 1, current === list ? 'start' : undefined);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            move(list, current, -1, current === list ? 'end' : undefined);
        } else if (event.key === 'Home') {
            event.preventDefault();
            move(list, null, 1, 'start');
        } else if (event.key === 'End') {
            event.preventDefault();
            move(list, null, -1, 'end');
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const now = performance.now();
            const state = typeahead.current;
            if (now - state.last > 500) state.keys = [];
            state.last = now;
            state.keys.push(event.key.toLowerCase());
            const query = state.keys.join('');
            const items = getItems(list).filter(item => isFocusable(item, disabledItemsFocusable));
            const start = items.indexOf(current as HTMLElement);
            const ordered = [...items.slice(start + 1), ...items.slice(0, start + 1)];
            const match = ordered.find(item =>
                (item.innerText || item.textContent || '').trim().toLowerCase().startsWith(query)
            );
            if (match) {
                event.preventDefault();
                match.focus();
                if (roving) setActiveItem(match);
            }
        }
        onKeyDown?.(event);
    };

    return (
        <MenuListContext.Provider value={{ dense, role: itemRole, activeItem, roving }}>
            <Component
                ref={handleRef}
                role={role}
                tabIndex={-1}
                data-menu-list=""
                data-slot="menu-list"
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                className={cn('relative m-0 list-none py-2 outline-0', className)}
                {...other}
            >
                {children}
            </Component>
        </MenuListContext.Provider>
    );
});

export interface MenuProps extends Omit<PopoverProps, 'onClose'> {
    onClose?: BivariantCallback<[event: SyntheticEvent | Event, reason: MenuCloseReason]>;
    autoFocus?: boolean;
    variant?: 'menu' | 'selectedMenu';
    disableAutoFocusItem?: boolean;
    listClassName?: string;
    listProps?: Omit<MenuListProps, 'children'>;
    header?: ReactNode;
    children?: ReactNode;
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
    {
        open,
        onClose,
        autoFocus = true,
        variant = 'selectedMenu',
        disableAutoFocusItem = false,
        listClassName,
        listProps,
        paperClassName,
        header,
        children,
        anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
        transformOrigin = { vertical: 'top', horizontal: 'left' },
        ...other
    },
    ref
) {
    const autoFocusItem = autoFocus && !disableAutoFocusItem && open;
    const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            onClose?.(event, 'tabKeyDown');
        }
        listProps?.onKeyDown?.(event);
    };
    return (
        <Popover
            ref={ref}
            open={open}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            disableAutoFocus={autoFocus ? undefined : true}
            paperClassName={cn(
                'max-h-[calc(100%-96px)] [-webkit-overflow-scrolling:touch]',
                paperClassName
            )}
            {...other}
        >
            {header}
            <MenuList
                autoFocusItem={autoFocusItem}
                autoFocus={autoFocus && open}
                variant={variant}
                {...listProps}
                onKeyDown={handleListKeyDown}
                className={cn(listProps?.className, listClassName)}
            >
                {children}
            </MenuList>
        </Popover>
    );
});

export interface MenuItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'value'> {
    dense?: boolean;
    disabled?: boolean;
    selected?: boolean;
    divider?: boolean;
    disableGutters?: boolean;
    autoFocus?: boolean;
    component?: ElementType;
    value?: unknown;
    href?: string;
    to?: string;
    target?: string;
}

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
    {
        dense: denseProp,
        disabled = false,
        selected = false,
        divider = false,
        disableGutters = false,
        autoFocus = false,
        component,
        value: _value,
        className,
        role: roleProp,
        tabIndex,
        onClick,
        onKeyDown,
        onKeyUp,
        ...other
    },
    ref
) {
    const context = useContext(MenuListContext);
    const dense = denseProp ?? context.dense;
    const itemRef = useRef<HTMLLIElement | null>(null);
    const handleRef = useForkRef(itemRef, ref);
    useEffect(() => {
        if (autoFocus) itemRef.current?.focus();
    }, [autoFocus]);
    const Component = component ?? 'li';
    const role = roleProp ?? context.role;
    const isActive = context.activeItem !== null && itemRef.current === context.activeItem;
    const resolvedTabIndex = disabled ? -1 : (tabIndex ?? (context.roving && isActive ? 0 : -1));
    return (
        <ListContext.Provider value={{ dense }}>
            <Component
                ref={handleRef}
                role={role}
                tabIndex={resolvedTabIndex}
                data-menu-item=""
                data-slot="menu-item"
                data-selected={selected ? '' : undefined}
                data-disabled={disabled ? '' : undefined}
                aria-disabled={disabled || undefined}
                aria-selected={role === 'option' ? selected : undefined}
                className={cn(
                    'relative box-border flex cursor-pointer items-center justify-start whitespace-nowrap no-underline outline-0 select-none align-middle [-webkit-tap-highlight-color:transparent]',
                    'font-plex-sans font-normal text-[0.875rem]',
                    dense
                        ? 'min-h-8 py-1 leading-[1.57]'
                        : 'min-h-12 py-1.5 leading-[1.5] screen-sm:min-h-[auto]',
                    !disableGutters && 'px-4',
                    divider && 'border-b border-solid border-divider bg-clip-padding',
                    'hover:bg-action-hover focus-visible:bg-action-focus',
                    selected &&
                        'bg-primary-main/8 hover:bg-primary-main/12 focus-visible:bg-primary-main/20',
                    'data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:opacity-38',
                    '[&+hr]:my-2 [&+[role=separator]]:my-2 [&_[data-list-item-icon]]:min-w-9',
                    className
                )}
                {...buttonKeyboardHandlers<HTMLLIElement>({
                    disabled,
                    onClick,
                    onKeyDown,
                    onKeyUp,
                })}
                {...other}
            />
        </ListContext.Provider>
    );
});
