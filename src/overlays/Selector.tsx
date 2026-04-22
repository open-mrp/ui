'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/forms/Input';
import { cn } from '@/utils/cn';

export type SelectorVariant = 'outlined' | 'line' | 'plain';

export interface SelectorOption {
    label: string;
    description?: string;
    value: string;
    disabled?: boolean;
}

interface SelectorBaseProps {
    options: SelectorOption[];
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    variant?: SelectorVariant;
    size?: 'sm' | 'md' | 'lg';
    blur?: boolean;
    className?: string;
    triggerClassName?: string;
    descriptionPosition?: 'below' | 'inline';
    triggerField?: 'label' | 'description';
}

export interface SingleSelectorProps extends SelectorBaseProps {
    mode?: 'single';
    value: string | null;
    onChange: (value: string | null) => void;
}

export interface MultiSelectorProps extends SelectorBaseProps {
    mode: 'multi';
    value: string[];
    onChange: (value: string[]) => void;
}

export type SelectorProps = SingleSelectorProps | MultiSelectorProps;

function isMulti(props: SelectorProps): props is MultiSelectorProps {
    return props.mode === 'multi';
}

export function Selector(props: SelectorProps) {
    const {
        options,
        placeholder = 'Select...',
        label,
        disabled = false,
        error = false,
        helperText,
        clearable = false,
        searchable = false,
        searchPlaceholder = 'Search...',
        variant = 'outlined',
        size = 'md',
        blur = false,
        className,
        triggerClassName,
        descriptionPosition = 'below',
        triggerField = 'label',
    } = props;

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selectedAtOpenRef = useRef<Set<string>>(new Set());
    const prevOpenRef = useRef(false);

    const multi = isMulti(props);

    // Snapshot selection on each open→close transition so the order stays stable while open.
    if (open !== prevOpenRef.current) {
        if (open) {
            selectedAtOpenRef.current = multi
                ? new Set(props.value)
                : props.value !== null
                  ? new Set([props.value])
                  : new Set<string>();
        } else {
            selectedAtOpenRef.current = new Set();
        }
        prevOpenRef.current = open;
    }

    // Filter by search, then pin snapshot-selected options to the top.
    const filteredOptions = useMemo(() => {
        const base = search
            ? options.filter(o => {
                  const lower = search.toLowerCase();
                  return (
                      o.label.toLowerCase().includes(lower) ||
                      o.description?.toLowerCase().includes(lower)
                  );
              })
            : options;
        const selectedSet = selectedAtOpenRef.current;
        if (selectedSet.size === 0) return base;
        const pinned: SelectorOption[] = [];
        const rest: SelectorOption[] = [];
        for (const o of base) {
            if (selectedSet.has(o.value)) pinned.push(o);
            else rest.push(o);
        }
        return [...pinned, ...rest];
    }, [options, search, open]);

    // Reset search and highlight when popover closes
    useEffect(() => {
        if (!open) {
            setSearch('');
            setHighlightedIndex(-1);
        }
    }, [open]);

    // Scroll highlighted option into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    // Display text for the trigger
    const displayText = (() => {
        if (multi) {
            return null; // multi mode shows pills instead
        }
        if (props.value === null) return null;
        const selected = options.find(o => o.value === props.value);
        if (!selected) return null;
        if (triggerField === 'description') {
            return selected.description ?? selected.label;
        }
        return selected.label;
    })();

    // Selected values for multi mode
    const selectedOptions = multi
        ? options.filter(o => props.value.includes(o.value))
        : [];

    function handleSelect(option: SelectorOption) {
        if (option.disabled) return;

        if (multi) {
            const currentValue = props.value;
            if (currentValue.includes(option.value)) {
                props.onChange(currentValue.filter(v => v !== option.value));
            } else {
                props.onChange([...currentValue, option.value]);
            }
        } else {
            props.onChange(option.value);
            setOpen(false);
        }
    }

    function handleClear() {
        if (multi) {
            props.onChange([]);
        } else {
            props.onChange(null);
        }
    }

    function handleRemovePill(value: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (multi) {
            props.onChange(props.value.filter(v => v !== value));
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0,
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1,
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                triggerRef.current?.focus();
                break;
            case 'Backspace':
                if (multi && search === '' && props.value.length > 0) {
                    props.onChange(props.value.slice(0, -1));
                }
                break;
        }
    }

    const hasValue = multi ? props.value.length > 0 : props.value !== null;

    return (
        <div data-slot="selector" className={cn('relative w-full', className)}>
            {label && (
                <label
                    className={cn(
                        'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300',
                        error && 'text-red-600 dark:text-red-400',
                    )}
                >
                    {label}
                </label>
            )}
            <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
                <PopoverPrimitive.Trigger asChild disabled={disabled}>
                    <button
                        ref={triggerRef}
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            'flex w-full cursor-pointer items-center gap-1 text-left transition-colors',
                            variant !== 'plain' && {
                                sm: 'px-2',
                                md: 'px-3',
                                lg: 'px-4',
                            }[size],
                            {
                                sm: 'min-h-[30px] py-1 text-xs',
                                md: 'min-h-[38px] py-2 text-sm',
                                lg: 'min-h-[42px] py-2.5 text-base',
                            }[size],
                            blur && 'backdrop-blur-md',
                            variant === 'outlined' && [
                                'rounded-md border',
                                blur
                                    ? 'bg-white/60 dark:bg-gray-900/60 border-white/30 dark:border-white/15'
                                    : 'bg-white dark:bg-gray-900',
                                'focus:border-[var(--primary)] focus:shadow-[0_0_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                                error
                                    ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]'
                                    : !blur && 'border-gray-300 dark:border-gray-600',
                            ],
                            variant === 'line' && 'bg-transparent',
                            variant === 'plain' && 'bg-transparent',
                            disabled && 'opacity-50 cursor-default',
                            triggerClassName,
                        )}
                    >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                            {multi && selectedOptions.length > 0 ? (
                                selectedOptions.map(opt => (
                                    <span
                                        key={opt.value}
                                        className={cn(
                                            'inline-flex items-center gap-0.5 rounded-full pl-2.5 pr-0.5 py-0.5 text-xs font-medium transition-colors',
                                            'bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/25',
                                            'dark:bg-[var(--primary)]/20 dark:text-[var(--primary)] dark:hover:bg-[var(--primary)]/35',
                                        )}
                                    >
                                        {opt.label}
                                        <button
                                            type="button"
                                            onClick={e => handleRemovePill(opt.value, e)}
                                            disabled={disabled}
                                            className="cursor-pointer rounded-full p-0.5 hover:bg-[var(--primary)]/30 dark:hover:bg-[var(--primary)]/40"
                                            aria-label={`Remove ${opt.label}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))
                            ) : displayText ? (
                                <span
                                    className={cn(
                                        'truncate',
                                        blur
                                            ? 'text-white'
                                            : 'text-gray-900 dark:text-gray-100',
                                    )}
                                >
                                    {displayText}
                                </span>
                            ) : (
                                <span
                                    className={cn(
                                        'truncate',
                                        blur
                                            ? 'text-white/40'
                                            : 'text-gray-400 dark:text-gray-500',
                                    )}
                                >
                                    {placeholder}
                                </span>
                            )}
                        </div>
                        {clearable && hasValue && (
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="shrink-0 cursor-pointer rounded-sm p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Clear selection"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 shrink-0 transition-transform',
                                blur ? 'text-white/50' : 'text-gray-400 dark:text-gray-500',
                                open && 'rotate-180',
                            )}
                        />
                    </button>
                </PopoverPrimitive.Trigger>

                {variant === 'line' && (
                    <div className="relative h-0.5">
                        <div
                            className={cn(
                                'absolute inset-x-0 top-0 h-0.5 w-full transition-all',
                                error
                                    ? 'bg-red-500 group-focus-within:shadow-[0_2px_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]'
                                    : cn(
                                          blur
                                              ? 'bg-white/30'
                                              : 'bg-gray-300 dark:bg-gray-600',
                                          'group-focus-within:!bg-[var(--primary)]',
                                      ),
                                'group-focus-within:h-[3px]',
                                !error &&
                                    'group-focus-within:shadow-[0_2px_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                            )}
                        />
                    </div>
                )}

                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        align="start"
                        sideOffset={4}
                        onOpenAutoFocus={e => {
                            e.preventDefault();
                            if (searchable) {
                                searchInputRef.current?.focus();
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        style={{ zIndex: 1400, maxHeight: 'min(240px, var(--radix-popover-content-available-height))' }}
                        className={cn(
                            'min-w-[var(--radix-popover-trigger-width)] w-max max-w-[min(480px,var(--radix-popover-content-available-width))] overflow-auto rounded-md border shadow-md outline-hidden',
                            'backdrop-blur-md bg-white/60 border-white/20 dark:bg-gray-900/60 dark:border-white/10',
                            'data-[state=open]:animate-in data-[state=closed]:animate-out',
                            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                        )}
                    >
                        {searchable && (
                            <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                                <Input
                                    ref={searchInputRef}
                                    variant="plain"
                                    size="sm"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        setHighlightedIndex(-1);
                                    }}
                                    prefix={
                                        <Search
                                            className={cn(
                                                'h-4 w-4',
                                                blur
                                                    ? 'text-white/50'
                                                    : 'text-gray-400 dark:text-gray-500',
                                            )}
                                        />
                                    }
                                />
                            </div>
                        )}
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                {search
                                    ? `No results for "${search}"`
                                    : 'No options available'}
                            </div>
                        ) : (
                            <ul
                                ref={listRef}
                                role="listbox"
                                aria-multiselectable={multi || undefined}
                                className="space-y-1 p-1"
                            >
                                {filteredOptions.map((option, index) => {
                                    const selected = multi
                                        ? props.value.includes(option.value)
                                        : props.value === option.value;
                                    const isHighlighted = index === highlightedIndex;

                                    return (
                                        <li
                                            key={option.value}
                                            role="option"
                                            aria-selected={selected}
                                            aria-disabled={option.disabled || undefined}
                                            data-highlighted={isHighlighted || undefined}
                                            onClick={() => handleSelect(option)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors',
                                                'text-gray-900 dark:text-gray-100',
                                                isHighlighted && 'bg-gray-200 dark:bg-gray-700',
                                                selected &&
                                                    !isHighlighted &&
                                                    'bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20',
                                                !isHighlighted &&
                                                    !selected &&
                                                    'hover:bg-gray-200 dark:hover:bg-gray-700/50',
                                                option.disabled &&
                                                    'cursor-default opacity-50',
                                            )}
                                        >
                                            {multi && (
                                                <div
                                                    className={cn(
                                                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                                                        selected
                                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                                            : 'border-gray-300 dark:border-gray-600',
                                                    )}
                                                >
                                                    {selected && (
                                                        <svg
                                                            className="h-3 w-3"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path d="M2 6l3 3 5-5" />
                                                        </svg>
                                                    )}
                                                </div>
                                            )}
                                            {descriptionPosition === 'inline' && option.description ? (
                                                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                                                    <div className="font-semibold leading-tight">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold leading-tight">
                                                        {option.label}
                                                    </div>
                                                    {option.description && (
                                                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                            {option.description}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {!multi && (
                                                <Check
                                                    className={cn(
                                                        'h-4 w-4 shrink-0',
                                                        selected
                                                            ? 'text-[var(--primary)]'
                                                            : 'text-transparent',
                                                    )}
                                                />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
            {helperText && (
                <p
                    className={cn(
                        'mt-1 text-xs',
                        error
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400',
                    )}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}
