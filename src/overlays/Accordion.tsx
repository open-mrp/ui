'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

interface AccordionContextValue {
    isOpen: (value: string) => boolean;
    toggle: (value: string) => void;
    disabled: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
    value: string;
    open: boolean;
    disabled: boolean;
    triggerId: string;
    contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useRequiredContext<T>(context: React.Context<T | null>, component: string): T {
    const value = React.useContext(context);
    if (!value) throw new Error(`<${component}> must be used within <Accordion>`);
    return value;
}

interface AccordionSingleProps {
    type: 'single';
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    collapsible?: boolean;
}

interface AccordionMultipleProps {
    type: 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
}

export type AccordionProps = Omit<React.ComponentProps<'div'>, 'defaultValue' | 'dir'> & {
    disabled?: boolean;
} & (AccordionSingleProps | AccordionMultipleProps);

function toList(value: string | string[] | undefined): string[] {
    if (value === undefined || value === '') return [];
    return Array.isArray(value) ? value : [value];
}

function Accordion(props: AccordionProps) {
    const {
        type,
        value,
        defaultValue,
        onValueChange,
        disabled = false,
        onKeyDown,
        ...rest
    } = props;
    const { collapsible: collapsibleProp, ...divProps } = rest as typeof rest & {
        collapsible?: boolean;
    };
    const collapsible = type === 'multiple' || (collapsibleProp ?? false);
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(() => toList(defaultValue));
    const controlled = value !== undefined;
    const openValues = controlled ? toList(value) : uncontrolled;

    const context = React.useMemo<AccordionContextValue>(
        () => ({
            disabled,
            isOpen: (itemValue) => openValues.includes(itemValue),
            toggle: (itemValue) => {
                const isOpen = openValues.includes(itemValue);
                if (type === 'single' && isOpen && !collapsible) return;
                const next =
                    type === 'single'
                        ? isOpen
                            ? []
                            : [itemValue]
                        : isOpen
                          ? openValues.filter((open) => open !== itemValue)
                          : [...openValues, itemValue];
                if (!controlled) setUncontrolled(next);
                if (type === 'single')
                    (onValueChange as ((value: string) => void) | undefined)?.(next[0] ?? '');
                else (onValueChange as ((value: string[]) => void) | undefined)?.(next);
            },
        }),
        [disabled, openValues, type, collapsible, controlled, onValueChange],
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        const target = event.target as HTMLElement;
        if (!target.matches('[data-slot=accordion-trigger]')) return;
        const root = event.currentTarget;
        const triggers = Array.from(
            root.querySelectorAll<HTMLElement>('[data-slot=accordion-trigger]:not([disabled])'),
        ).filter((trigger) => trigger.closest('[data-slot=accordion]') === root);
        const index = triggers.indexOf(target);
        let next: HTMLElement | undefined;
        if (event.key === 'ArrowDown') next = triggers[(index + 1) % triggers.length];
        else if (event.key === 'ArrowUp')
            next = triggers[(index - 1 + triggers.length) % triggers.length];
        else if (event.key === 'Home') next = triggers[0];
        else if (event.key === 'End') next = triggers[triggers.length - 1];
        if (next) {
            event.preventDefault();
            next.focus();
        }
    };

    return (
        <AccordionContext.Provider value={context}>
            <div
                data-slot="accordion"
                data-orientation="vertical"
                onKeyDown={handleKeyDown}
                {...divProps}
            />
        </AccordionContext.Provider>
    );
}

function AccordionItem({
    className,
    value,
    disabled: disabledProp = false,
    ...props
}: React.ComponentProps<'div'> & { value: string; disabled?: boolean }) {
    const accordion = useRequiredContext(AccordionContext, 'AccordionItem');
    const id = React.useId();
    const open = accordion.isOpen(value);
    const disabled = accordion.disabled || disabledProp;
    const context = React.useMemo(
        () => ({
            value,
            open,
            disabled,
            triggerId: `${id}-trigger`,
            contentId: `${id}-content`,
        }),
        [value, open, disabled, id],
    );
    return (
        <AccordionItemContext.Provider value={context}>
            <div
                data-slot="accordion-item"
                data-state={open ? 'open' : 'closed'}
                data-disabled={disabled ? '' : undefined}
                data-orientation="vertical"
                className={cn(
                    'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
                    className,
                )}
                {...props}
            />
        </AccordionItemContext.Provider>
    );
}

function AccordionTrigger({
    className,
    children,
    onClick,
    ...props
}: React.ComponentProps<'button'>) {
    const accordion = useRequiredContext(AccordionContext, 'AccordionTrigger');
    const item = useRequiredContext(AccordionItemContext, 'AccordionTrigger');
    return (
        <h3 className="flex" data-state={item.open ? 'open' : 'closed'}>
            <button
                type="button"
                id={item.triggerId}
                aria-controls={item.contentId}
                aria-expanded={item.open}
                disabled={item.disabled}
                data-slot="accordion-trigger"
                data-state={item.open ? 'open' : 'closed'}
                data-disabled={item.disabled ? '' : undefined}
                data-orientation="vertical"
                className={cn(
                    'flex flex-1 items-center justify-between gap-2 py-3 px-4 text-sm font-medium text-left transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                    '[&[data-state=open]>svg]:rotate-180',
                    className,
                )}
                onClick={(event) => {
                    onClick?.(event);
                    if (!event.defaultPrevented) accordion.toggle(item.value);
                }}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
            </button>
        </h3>
    );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const item = useRequiredContext(AccordionItemContext, 'AccordionContent');
    if (!item.open) return null;
    return (
        <div
            id={item.contentId}
            role="region"
            aria-labelledby={item.triggerId}
            data-slot="accordion-content"
            data-state="open"
            data-orientation="vertical"
            className="overflow-hidden text-sm"
            {...props}
        >
            <div className={cn('px-4 pb-4 pt-0', className)}>{children}</div>
        </div>
    );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
