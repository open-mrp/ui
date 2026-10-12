'use client';

import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';

import { GlassButton, type GlassButtonProps } from '@/buttons/GlassButton';
import { useForkRef } from '@/hooks/use-fork-ref';
import { cn } from '@/utils/cn';
import { Slot } from '@/utils/slot';
import { AnchoredPanel, type AnchoredPanelAlign, type AnchoredPanelSide } from './AnchoredPanel';

type FocusTarget = 'content' | 'first' | 'last';

interface RootContextValue {
    open: boolean;
    setOpen: (open: boolean, focus?: FocusTarget) => void;
    focusOnOpen: FocusTarget;
    trigger: HTMLElement | null;
    setTrigger: (element: HTMLElement | null) => void;
    triggerId: string;
    contentId: string;
    modal: boolean;
}

const RootContext = React.createContext<RootContextValue | null>(null);

function useRoot(component: string): RootContextValue {
    const context = React.useContext(RootContext);
    if (!context) throw new Error(`<${component}> must be used within <DropdownMenu>`);
    return context;
}

interface MenuContextValue {
    closeAll: () => void;
    activeSub: string | null;
    setActiveSub: (id: string | null) => void;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

const itemSelector =
    '[role=menuitem]:not([data-disabled]), [role=menuitemcheckbox]:not([data-disabled]), [role=menuitemradio]:not([data-disabled])';

function getItems(content: HTMLElement): HTMLElement[] {
    return Array.from(content.querySelectorAll<HTMLElement>(itemSelector)).filter(
        (item) => item.closest('[data-menu-content]') === content,
    );
}

function focusItem(content: HTMLElement | null, target: FocusTarget) {
    if (!content) return;
    const items = getItems(content);
    const item = target === 'first' ? items[0] : target === 'last' ? items.at(-1) : undefined;
    (item ?? content).focus({ preventScroll: true });
}

export interface DropdownMenuProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    dir?: 'ltr' | 'rtl';
    children?: React.ReactNode;
}

function DropdownMenu({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    children,
}: DropdownMenuProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [focusOnOpen, setFocusOnOpen] = React.useState<FocusTarget>('content');
    const [trigger, setTrigger] = React.useState<HTMLElement | null>(null);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : uncontrolledOpen;
    const id = React.useId();
    const setOpen = React.useCallback(
        (next: boolean, focus: FocusTarget = 'content') => {
            if (next) setFocusOnOpen(focus);
            if (!controlled) setUncontrolledOpen(next);
            onOpenChange?.(next);
        },
        [controlled, onOpenChange],
    );
    const context = React.useMemo(
        () => ({
            open,
            setOpen,
            focusOnOpen,
            trigger,
            setTrigger,
            triggerId: `${id}-trigger`,
            contentId: `${id}-content`,
            modal,
        }),
        [open, setOpen, focusOnOpen, trigger, id, modal],
    );
    return <RootContext.Provider value={context}>{children}</RootContext.Provider>;
}

function DropdownMenuPortal({ children }: { children?: React.ReactNode; container?: Element }) {
    return <>{children}</>;
}

type TriggerProps = React.ComponentProps<'button'> & { asChild?: boolean };

function DropdownMenuTrigger({
    asChild = false,
    disabled = false,
    onPointerDown,
    onKeyDown,
    ref,
    ...props
}: TriggerProps) {
    const root = useRoot('DropdownMenuTrigger');
    const handleRef = useForkRef<HTMLButtonElement>(ref, root.setTrigger);
    const Component = asChild ? Slot : 'button';
    return (
        <Component
            ref={handleRef}
            type={asChild ? undefined : 'button'}
            id={root.triggerId}
            aria-haspopup="menu"
            aria-expanded={root.open}
            aria-controls={root.open ? root.contentId : undefined}
            data-state={root.open ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            disabled={disabled}
            data-slot="dropdown-menu-trigger"
            onPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => {
                onPointerDown?.(event);
                if (disabled || event.defaultPrevented) return;
                if (event.button !== 0 || event.ctrlKey) return;
                root.setOpen(!root.open);
                if (!root.open) event.preventDefault();
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                onKeyDown?.(event);
                if (disabled || event.defaultPrevented) return;
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    root.setOpen(!root.open, 'first');
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    root.setOpen(true, 'first');
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    root.setOpen(true, 'last');
                }
            }}
            {...props}
        />
    );
}

function DropdownMenuButton({
    children,
    variant = 'text',
    size = 'md',
    color,
    disabled = false,
    blur = false,
    className,
    ...props
}: GlassButtonProps & Omit<TriggerProps, 'color'>) {
    return (
        <DropdownMenuTrigger asChild disabled={disabled} {...props}>
            <GlassButton
                data-slot="dropdown-menu-button"
                variant={variant}
                size={size}
                color={color}
                disabled={disabled}
                blur={blur}
                className={cn(
                    'outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0',
                    className,
                )}
            >
                {children}
            </GlassButton>
        </DropdownMenuTrigger>
    );
}

function useMenuKeyboard() {
    const typeahead = React.useRef({ query: '', last: 0 });
    return (event: React.KeyboardEvent<HTMLDivElement>) => {
        const content = event.currentTarget;
        if ((event.target as HTMLElement).closest('[data-menu-content]') !== content) return;
        const items = getItems(content);
        const index = items.indexOf(document.activeElement as HTMLElement);
        let next: HTMLElement | undefined;
        if (event.key === 'ArrowDown') next = items[Math.min(index + 1, items.length - 1)];
        else if (event.key === 'ArrowUp')
            next = index === -1 ? items.at(-1) : items[Math.max(index - 1, 0)];
        else if (event.key === 'Home' || event.key === 'PageUp') next = items[0];
        else if (event.key === 'End' || event.key === 'PageDown') next = items.at(-1);
        else if (event.key === 'Tab') {
            event.preventDefault();
            return;
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const now = performance.now();
            const state = typeahead.current;
            state.query = now - state.last > 1000 ? event.key : state.query + event.key;
            state.last = now;
            const query = state.query.toLowerCase();
            const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
            next = ordered.find((item) =>
                (item.textContent ?? '').trim().toLowerCase().startsWith(query),
            );
            if (event.key === ' ' && !next) return;
        }
        if (next) {
            event.preventDefault();
            next.focus({ preventScroll: false });
        }
    };
}

const contentClasses =
    'z-50 max-h-(--available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-hidden';

type ContentProps = React.ComponentProps<'div'> & {
    side?: AnchoredPanelSide;
    align?: AnchoredPanelAlign;
    sideOffset?: number;
    alignOffset?: number;
    loop?: boolean;
    forceMount?: boolean;
    onCloseAutoFocus?: (event: Event) => void;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
};

function DropdownMenuContent({
    className,
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    onKeyDown,
    children,
    ref,
    loop: _loop,
    forceMount: _forceMount,
    onCloseAutoFocus,
    onEscapeKeyDown: _onEscapeKeyDown,
    ...props
}: ContentProps) {
    const root = useRoot('DropdownMenuContent');
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(contentRef, ref);
    const [activeSub, setActiveSub] = React.useState<string | null>(null);
    const handleKeyDown = useMenuKeyboard();
    const { open, focusOnOpen, setOpen } = root;
    React.useLayoutEffect(() => {
        if (open && focusOnOpen !== 'content') focusItem(contentRef.current, focusOnOpen);
    }, [open, focusOnOpen]);
    const [previousOpen, setPreviousOpen] = React.useState(open);
    const [restoreFocus, setRestoreFocus] = React.useState(false);
    if (previousOpen !== open) {
        setPreviousOpen(open);
        if (!open) {
            setActiveSub(null);
            setRestoreFocus(true);
        }
    }
    const { trigger } = root;
    React.useEffect(() => {
        if (!restoreFocus) return;
        setRestoreFocus(false);
        const event = new Event('menu.closeAutoFocus', { cancelable: true });
        onCloseAutoFocus?.(event);
        if (event.defaultPrevented) return;
        const active = document.activeElement;
        if (trigger?.isConnected && (active === null || active === document.body)) {
            trigger.focus({ preventScroll: true });
        }
    }, [restoreFocus, trigger, onCloseAutoFocus]);
    const menu = React.useMemo(
        () => ({ closeAll: () => setOpen(false), activeSub, setActiveSub }),
        [setOpen, activeSub],
    );
    return (
        <MenuContext.Provider value={menu}>
            <AnchoredPanel
                ref={handleRef}
                open={open}
                anchor={root.trigger}
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                modal={root.modal}
                returnFocus={false}
                onDismiss={() => setOpen(false)}
                id={root.contentId}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby={root.triggerId}
                tabIndex={-1}
                data-menu-content=""
                data-slot="dropdown-menu-content"
                className={cn(
                    contentClasses,
                    'bg-gray-50/70 backdrop-blur-sm text-gray-900',
                    'dark:bg-gray-800/70 dark:text-gray-100',
                    className,
                )}
                onKeyDown={(event) => {
                    onKeyDown?.(event);
                    if (!event.defaultPrevented) handleKeyDown(event);
                }}
                {...props}
            >
                {children}
            </AnchoredPanel>
        </MenuContext.Provider>
    );
}

function DropdownMenuGroup(props: React.ComponentProps<'div'>) {
    return <div role="group" data-slot="dropdown-menu-group" {...props} />;
}

const itemClasses = [
    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
    "[&_svg:not([class*='text-'])]:text-gray-500 dark:[&_svg:not([class*='text-'])]:text-gray-400",
    'focus:bg-gray-100 focus:text-gray-900',
    'dark:focus:bg-gray-700 dark:focus:text-gray-100',
];

type ItemBaseProps = Omit<React.ComponentProps<'div'>, 'onSelect'> & {
    disabled?: boolean;
    onSelect?: (event: Event) => void;
    textValue?: string;
    asChild?: boolean;
};

function useMenuItem({
    disabled = false,
    onSelect,
    onClick,
    onKeyDown,
    onPointerMove,
    onPointerLeave,
    onFocus,
    onBlur,
    onSelectExtra,
}: Pick<
    ItemBaseProps,
    | 'disabled'
    | 'onSelect'
    | 'onClick'
    | 'onKeyDown'
    | 'onPointerMove'
    | 'onPointerLeave'
    | 'onFocus'
    | 'onBlur'
> & { onSelectExtra?: () => void }) {
    const menu = React.useContext(MenuContext);
    const [highlighted, setHighlighted] = React.useState(false);
    return {
        tabIndex: -1,
        'data-highlighted': highlighted ? '' : undefined,
        'data-disabled': disabled ? '' : undefined,
        'aria-disabled': disabled || undefined,
        onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
            onFocus?.(event);
            setHighlighted(true);
        },
        onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
            onBlur?.(event);
            setHighlighted(false);
        },
        onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
            onPointerMove?.(event);
            if (disabled || event.pointerType !== 'mouse') return;
            if (document.activeElement !== event.currentTarget) {
                event.currentTarget.focus({ preventScroll: true });
            }
            menu?.setActiveSub(null);
        },
        onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
            onPointerLeave?.(event);
            if (event.pointerType !== 'mouse') return;
            const content = event.currentTarget.closest<HTMLElement>('[data-menu-content]');
            if (document.activeElement === event.currentTarget)
                content?.focus({ preventScroll: true });
        },
        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(event);
            if (disabled) return;
            onSelectExtra?.();
            const selectEvent = new Event('menu.itemSelect', { bubbles: true, cancelable: true });
            onSelect?.(selectEvent);
            if (!selectEvent.defaultPrevented && !event.defaultPrevented) menu?.closeAll();
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(event);
            if (disabled || event.defaultPrevented) return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.currentTarget.click();
            }
        },
    };
}

function DropdownMenuItem({
    className,
    inset,
    variant = 'default',
    disabled,
    onSelect,
    onClick,
    onKeyDown,
    onPointerMove,
    onPointerLeave,
    onFocus,
    onBlur,
    asChild = false,
    textValue: _textValue,
    ...props
}: ItemBaseProps & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}) {
    const itemProps = useMenuItem({
        disabled,
        onSelect,
        onClick,
        onKeyDown,
        onPointerMove,
        onPointerLeave,
        onFocus,
        onBlur,
    });
    const Component = asChild ? Slot : 'div';
    return (
        <Component
            role="menuitem"
            data-slot="dropdown-menu-item"
            data-inset={inset ? '' : undefined}
            data-variant={variant}
            {...itemProps}
            className={cn(
                itemClasses,
                'data-[inset]:pl-8',
                variant === 'destructive' && [
                    'data-[variant=destructive]:text-red-600 dark:data-[variant=destructive]:text-red-400',
                    'data-[variant=destructive]:focus:bg-red-50 dark:data-[variant=destructive]:focus:bg-red-900/20',
                    'data-[variant=destructive]:focus:text-red-600 dark:data-[variant=destructive]:focus:text-red-400',
                    'data-[variant=destructive]:*:[svg]:!text-red-600 dark:data-[variant=destructive]:*:[svg]:!text-red-400',
                ],
                className,
            )}
            {...props}
        />
    );
}

type CheckedState = boolean | 'indeterminate';

function DropdownMenuCheckboxItem({
    className,
    children,
    checked = false,
    onCheckedChange,
    disabled,
    onSelect,
    onClick,
    onKeyDown,
    onPointerMove,
    onPointerLeave,
    onFocus,
    onBlur,
    textValue: _textValue,
    asChild: _asChild,
    ...props
}: ItemBaseProps & { checked?: CheckedState; onCheckedChange?: (checked: boolean) => void }) {
    const itemProps = useMenuItem({
        disabled,
        onSelect,
        onClick,
        onKeyDown,
        onPointerMove,
        onPointerLeave,
        onFocus,
        onBlur,
        onSelectExtra: () => onCheckedChange?.(checked === 'indeterminate' ? true : !checked),
    });
    const state = checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
    return (
        <div
            role="menuitemcheckbox"
            aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
            data-state={state}
            data-slot="dropdown-menu-checkbox-item"
            {...itemProps}
            className={cn(itemClasses, className)}
            {...props}
        >
            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                {checked ? <CheckIcon className="size-4" /> : null}
            </span>
            {children}
        </div>
    );
}

const RadioGroupContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
}>({});

function DropdownMenuRadioGroup({
    value,
    onValueChange,
    ...props
}: React.ComponentProps<'div'> & { value?: string; onValueChange?: (value: string) => void }) {
    const context = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
    return (
        <RadioGroupContext.Provider value={context}>
            <div role="group" data-slot="dropdown-menu-radio-group" {...props} />
        </RadioGroupContext.Provider>
    );
}

function DropdownMenuRadioItem({
    className,
    children,
    value,
    disabled,
    onSelect,
    onClick,
    onKeyDown,
    onPointerMove,
    onPointerLeave,
    onFocus,
    onBlur,
    textValue: _textValue,
    asChild: _asChild,
    ...props
}: ItemBaseProps & { value: string }) {
    const group = React.useContext(RadioGroupContext);
    const checked = group.value === value;
    const itemProps = useMenuItem({
        disabled,
        onSelect,
        onClick,
        onKeyDown,
        onPointerMove,
        onPointerLeave,
        onFocus,
        onBlur,
        onSelectExtra: () => group.onValueChange?.(value),
    });
    return (
        <div
            role="menuitemradio"
            aria-checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            data-slot="dropdown-menu-radio-item"
            {...itemProps}
            className={cn(itemClasses, className)}
            {...props}
        >
            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                {checked ? <CircleIcon className="size-2 fill-current" /> : null}
            </span>
            {children}
        </div>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<'div'> & {
    inset?: boolean;
}) {
    return (
        <div
            data-slot="dropdown-menu-label"
            data-inset={inset ? '' : undefined}
            className={cn(
                'text-gray-500 dark:text-gray-400 px-2 py-1.5 text-xs data-[inset]:pl-8',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            role="separator"
            aria-orientation="horizontal"
            data-slot="dropdown-menu-separator"
            className={cn('bg-gray-300 dark:bg-gray-700 -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                'text-gray-500 dark:text-gray-400 ml-auto text-xs tracking-widest',
                className,
            )}
            {...props}
        />
    );
}

interface SubContextValue {
    id: string;
    open: boolean;
    setOpen: (open: boolean, focus?: FocusTarget) => void;
    focusOnOpen: FocusTarget;
    trigger: HTMLElement | null;
    setTrigger: (element: HTMLElement | null) => void;
}

const SubContext = React.createContext<SubContextValue | null>(null);

function useSub(component: string): SubContextValue {
    const context = React.useContext(SubContext);
    if (!context) throw new Error(`<${component}> must be used within <DropdownMenuSub>`);
    return context;
}

function DropdownMenuSub({
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}) {
    const menu = React.useContext(MenuContext);
    const id = React.useId();
    const [trigger, setTrigger] = React.useState<HTMLElement | null>(null);
    const [focusOnOpen, setFocusOnOpen] = React.useState<FocusTarget>('content');
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : menu?.activeSub === id;
    const [initialOpen] = React.useState(defaultOpen);
    const setActiveSub = menu?.setActiveSub;
    React.useEffect(() => {
        if (initialOpen) setActiveSub?.(id);
    }, [initialOpen, setActiveSub, id]);
    const setOpen = React.useCallback(
        (next: boolean, focus: FocusTarget = 'content') => {
            if (next) setFocusOnOpen(focus);
            menu?.setActiveSub(next ? id : null);
            onOpenChange?.(next);
        },
        [menu, id, onOpenChange],
    );
    const context = React.useMemo(
        () => ({ id, open, setOpen, focusOnOpen, trigger, setTrigger }),
        [id, open, setOpen, focusOnOpen, trigger],
    );
    return <SubContext.Provider value={context}>{children}</SubContext.Provider>;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    disabled = false,
    onPointerMove,
    onKeyDown,
    onClick,
    onFocus,
    onBlur,
    ref,
    ...props
}: React.ComponentProps<'div'> & {
    inset?: boolean;
    disabled?: boolean;
    textValue?: string;
}) {
    const sub = useSub('DropdownMenuSubTrigger');
    const handleRef = useForkRef<HTMLDivElement>(ref, sub.setTrigger);
    const [highlighted, setHighlighted] = React.useState(false);
    return (
        <div
            ref={handleRef}
            role="menuitem"
            tabIndex={-1}
            aria-haspopup="menu"
            aria-expanded={sub.open}
            data-state={sub.open ? 'open' : 'closed'}
            data-highlighted={highlighted ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            aria-disabled={disabled || undefined}
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset ? '' : undefined}
            className={cn(
                'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
                'data-[inset]:pl-8',
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "[&_svg:not([class*='text-'])]:text-gray-500 dark:[&_svg:not([class*='text-'])]:text-gray-400",
                'focus:bg-gray-100 focus:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900',
                'dark:focus:bg-gray-700 dark:focus:text-gray-100 dark:data-[state=open]:bg-gray-700 dark:data-[state=open]:text-gray-100',
                className,
            )}
            onFocus={(event) => {
                onFocus?.(event);
                setHighlighted(true);
            }}
            onBlur={(event) => {
                onBlur?.(event);
                setHighlighted(false);
            }}
            onPointerMove={(event) => {
                onPointerMove?.(event);
                if (disabled || event.pointerType !== 'mouse') return;
                if (document.activeElement !== event.currentTarget) {
                    event.currentTarget.focus({ preventScroll: true });
                }
                if (!sub.open) sub.setOpen(true);
            }}
            onClick={(event) => {
                onClick?.(event);
                if (!disabled) sub.setOpen(true, 'first');
            }}
            onKeyDown={(event) => {
                onKeyDown?.(event);
                if (disabled || event.defaultPrevented) return;
                if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    sub.setOpen(true, 'first');
                }
            }}
            {...props}
        >
            {children}
            <ChevronRightIcon className="ml-auto size-4" />
        </div>
    );
}

function DropdownMenuSubContent({
    className,
    sideOffset = 0,
    alignOffset = -5,
    onKeyDown,
    children,
    ref,
    loop: _loop,
    forceMount: _forceMount,
    ...props
}: ContentProps) {
    const sub = useSub('DropdownMenuSubContent');
    const menu = React.useContext(MenuContext);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(contentRef, ref);
    const handleKeyDown = useMenuKeyboard();
    const [activeSub, setActiveSub] = React.useState<string | null>(null);
    const { open, focusOnOpen } = sub;
    React.useLayoutEffect(() => {
        if (open && focusOnOpen !== 'content') focusItem(contentRef.current, focusOnOpen);
    }, [open, focusOnOpen]);
    const nested = React.useMemo(
        () => ({ closeAll: menu?.closeAll ?? (() => {}), activeSub, setActiveSub }),
        [menu, activeSub],
    );
    return (
        <MenuContext.Provider value={nested}>
            <AnchoredPanel
                ref={handleRef}
                open={open}
                anchor={sub.trigger}
                side="right"
                align="start"
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                returnFocus={false}
                onDismiss={(_, reason) => {
                    if (reason === 'escapeKeyDown') menu?.closeAll();
                    else if (reason === 'outsidePointer') sub.setOpen(false);
                }}
                role="menu"
                aria-orientation="vertical"
                tabIndex={-1}
                data-menu-content=""
                data-slot="dropdown-menu-sub-content"
                className={cn(
                    'z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg outline-hidden',
                    'bg-gray-50/80 backdrop-blur-sm text-gray-900',
                    'dark:bg-gray-800/80 dark:text-gray-100',
                    className,
                )}
                onKeyDown={(event) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        event.stopPropagation();
                        sub.setOpen(false);
                        sub.trigger?.focus({ preventScroll: true });
                        return;
                    }
                    handleKeyDown(event);
                    event.stopPropagation();
                }}
                {...props}
            >
                {children}
            </AnchoredPanel>
        </MenuContext.Provider>
    );
}

export {
    DropdownMenu,
    DropdownMenuButton,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
};
