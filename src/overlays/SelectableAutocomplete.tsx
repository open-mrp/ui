'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import type { ListResponse } from './autocomplete-types';

export type SelectableAutocompleteVariant = 'outlined' | 'line' | 'plain';

export type SelectableAutocompleteProps<T> = {
    value: T | null;
    onSelect: (item: T | null) => void;
    fetchItems: (params: {
        search?: string;
        cursor?: string;
        limit?: number;
    }) => Promise<ListResponse<T>>;
    getOptionLabel: (option: T) => { primary: string; secondary: string | null };
    isOptionEqualToValue: (option: T, value: T) => boolean;
    getOptionKey?: (option: T) => string;
    queryKey: string[] | string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    clearable?: boolean;
    prefetch?: boolean;
    debounceTime?: number;
    fetchCount?: number;
    excludeIds?: string[];
    variant?: SelectableAutocompleteVariant;
    blur?: boolean;
    showSearchIcon?: boolean;
    className?: string;
};

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export function SelectableAutocomplete<T>({
    value,
    onSelect,
    fetchItems,
    getOptionLabel,
    isOptionEqualToValue,
    getOptionKey,
    placeholder = 'Search...',
    label,
    disabled = false,
    error = false,
    helperText,
    clearable = false,
    prefetch = false,
    debounceTime = 500,
    fetchCount = 10,
    excludeIds,
    variant = 'outlined',
    blur = false,
    showSearchIcon = variant !== 'plain',
    className,
}: SelectableAutocompleteProps<T>) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const fetchIdRef = useRef(0);
    const selectedAtOpenRef = useRef<T | null>(null);
    const prevOpenRef = useRef(false);

    // Snapshot the selected value on each open→close transition so pinning stays stable while open.
    if (open !== prevOpenRef.current) {
        selectedAtOpenRef.current = open ? value : null;
        prevOpenRef.current = open;
    }

    const valueLabel = value ? getOptionLabel(value)?.primary || '' : '';
    const inputValue = open ? query : valueLabel;

    const debouncedQuery = useDebounce(query, debounceTime);

    const shouldFetch = prefetch || touched;

    const doFetch = useCallback(
        async (searchQuery: string) => {
            const id = ++fetchIdRef.current;
            setLoading(true);
            try {
                const result = await fetchItems({
                    search: searchQuery,
                    limit: fetchCount,
                });
                if (id !== fetchIdRef.current) return;
                setOptions(result.data);
            } catch {
                if (id !== fetchIdRef.current) return;
                setOptions([]);
            } finally {
                if (id === fetchIdRef.current) setLoading(false);
            }
        },
        [fetchItems, fetchCount],
    );

    useEffect(() => {
        if (shouldFetch) {
            doFetch(debouncedQuery);
        }
    }, [debouncedQuery, shouldFetch, doFetch]);

    // Pin the snapshot selection to the top, preferring the fresh fetched copy if present.
    const displayOptions = (() => {
        const pinned = selectedAtOpenRef.current;
        let items: T[];
        if (pinned) {
            const match = options.find(item => isOptionEqualToValue(item, pinned));
            const rest = match
                ? options.filter(item => !isOptionEqualToValue(item, pinned))
                : options;
            items = [match ?? pinned, ...rest];
        } else {
            items = options;
        }

        if (excludeIds && getOptionKey) {
            items = items.filter(item => !excludeIds.includes(getOptionKey(item)));
        }

        return items;
    })();

    function handleSelect(item: T) {
        onSelect({ ...item });
        setQuery('');
        setOpen(false);
        setHighlightedIndex(-1);
    }

    function handleClear(e: React.MouseEvent) {
        e.stopPropagation();
        onSelect(null);
        setQuery('');
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev < displayOptions.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : displayOptions.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && displayOptions[highlightedIndex]) {
                    handleSelect(displayOptions[highlightedIndex]);
                } else if (displayOptions[0]) {
                    handleSelect(displayOptions[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    }

    // Scroll highlighted option into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    return (
        <div data-slot="selectable-autocomplete" className={cn('relative w-full', className)}>
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
                <PopoverPrimitive.Anchor asChild>
                    <div
                        className={cn(
                            'group relative',
                            disabled && 'opacity-50 cursor-default',
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center py-2 transition-colors',
                                variant !== 'plain' && 'px-3',
                                blur && 'backdrop-blur-md',
                                variant === 'outlined' && [
                                    'rounded-md border',
                                    blur ? 'bg-white/60 dark:bg-gray-900/60' : 'bg-white dark:bg-gray-900',
                                    'focus-within:border-[var(--primary)] focus-within:shadow-[0_0_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                                    blur ? 'border-white/30 dark:border-white/15' : 'dark:border-gray-700',
                                    error
                                        ? 'border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]'
                                        : !blur && 'border-gray-300 dark:border-gray-600',
                                ],
                                variant === 'line' && 'bg-transparent pb-2',
                                variant === 'plain' && 'bg-transparent',
                            )}
                        >
                            {showSearchIcon && <Search className={cn('mr-2 h-4 w-4 shrink-0', blur ? 'text-white/50' : 'text-gray-400 dark:text-gray-500')} />}
                            <input
                                ref={inputRef}
                                type="text"
                                role="combobox"
                                aria-expanded={open}
                                aria-haspopup="listbox"
                                aria-autocomplete="list"
                                disabled={disabled}
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={e => {
                                    setTouched(true);
                                    setQuery(e.target.value);
                                    setHighlightedIndex(-1);
                                    if (!open) setOpen(true);
                                }}
                                onFocus={() => {
                                    requestAnimationFrame(() => {
                                        setTouched(true);
                                        setOpen(true);
                                    });
                                }}
                                onKeyDown={handleKeyDown}
                                className={cn(
                                    'w-full bg-transparent text-sm outline-none',
                                    blur
                                        ? 'text-white placeholder:text-white/40'
                                        : 'text-gray-900 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500',
                                    disabled && 'cursor-default',
                                )}
                            />
                            {loading && <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-gray-400" />}
                            {clearable && value && !loading && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="ml-2 shrink-0 cursor-pointer rounded-sm p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    aria-label="Clear selection"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        {variant === 'line' && (
                            <div className="relative h-0.5">
                                <div
                                    className={cn(
                                        'absolute inset-x-0 top-0 h-0.5 w-full transition-all',
                                        error
                                            ? 'bg-red-500 group-focus-within:shadow-[0_2px_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]'
                                            : cn(blur ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-600', 'group-focus-within:!bg-[var(--primary)]'),
                                        'group-focus-within:h-[3px]',
                                        !error && 'group-focus-within:shadow-[0_2px_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </PopoverPrimitive.Anchor>

                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        align="start"
                        sideOffset={4}
                        onOpenAutoFocus={e => e.preventDefault()}
                        style={{ zIndex: 1400, maxHeight: 'min(240px, var(--radix-popover-content-available-height))' }}
                        className={cn(
                            // pointer-events-auto: a modal Radix Dialog sets `pointer-events: none` on
                            // <body>; since this Popover portals to <body> (outside the dialog's layer),
                            // it inherits that and becomes unclickable. Re-enable it on the content itself.
                            'pointer-events-auto',
                            'w-[var(--radix-popover-trigger-width)] overflow-auto rounded-md border shadow-md outline-hidden',
                            'backdrop-blur-md bg-white/60 border-white/20 dark:bg-gray-900/60 dark:border-white/10',
                            'data-[state=open]:animate-in data-[state=closed]:animate-out',
                            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                        )}
                    >
                        {displayOptions.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                {loading
                                    ? 'Loading...'
                                    : inputValue === ''
                                        ? 'No results found'
                                        : `No results for "${inputValue}"`}
                            </div>
                        ) : (
                            <ul ref={listRef} role="listbox" className="py-1">
                                {displayOptions.map((option, index) => {
                                    const optionLabel = getOptionLabel(option);
                                    const isSelected = value ? isOptionEqualToValue(option, value) : false;
                                    const isHighlighted = index === highlightedIndex;

                                    return (
                                        <li
                                            key={getOptionKey ? getOptionKey(option) : index}
                                            role="option"
                                            aria-selected={isSelected}
                                            data-highlighted={isHighlighted || undefined}
                                            onMouseDown={e => e.preventDefault()}
                                            onClick={() => handleSelect(option)}
                                            className={cn(
                                                'cursor-pointer px-3 py-2 text-sm transition-colors',
                                                'text-gray-900 dark:text-gray-100',
                                                isHighlighted && 'bg-gray-100 dark:bg-gray-700',
                                                isSelected &&
                                                !isHighlighted &&
                                                'bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20',
                                                !isHighlighted && !isSelected && 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                                            )}
                                        >
                                            <div className="font-semibold leading-tight">
                                                {optionLabel.primary}
                                            </div>
                                            {optionLabel.secondary && (
                                                <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {optionLabel.secondary}
                                                </div>
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
                        error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
                    )}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}
