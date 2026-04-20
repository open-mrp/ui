'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import type { ListResponse } from './autocomplete-types';

export type MultiSelectableAutocompleteVariant = 'outlined' | 'line' | 'plain';

export type MultiSelectableAutocompleteProps<T> = {
    value: T[];
    onSelect: (items: T[]) => void;
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
    variant?: MultiSelectableAutocompleteVariant;
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

export function MultiSelectableAutocomplete<T>({
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
    variant = 'outlined',
    blur = false,
    showSearchIcon = variant !== 'plain',
    className,
}: MultiSelectableAutocompleteProps<T>) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchedOptions, setFetchedOptions] = useState<T[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const fetchIdRef = useRef(0);
    const displayOrderAtOpenRef = useRef<T[]>([]);
    const prevOpenRef = useRef(false);
    const wasFocusedOnMouseDownRef = useRef(false);

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
                setFetchedOptions(result.data);
            } catch {
                if (id !== fetchIdRef.current) return;
                setFetchedOptions([]);
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

    // Snapshot the full display order on open→close transitions.
    // Keeps items in their open-time positions (pinned selection at top),
    // so selecting an item during the session doesn't cause it to jump.
    if (open !== prevOpenRef.current) {
        if (open) {
            const pinnedNow = value.map(
                v => fetchedOptions.find(item => isOptionEqualToValue(item, v)) ?? v,
            );
            const restNow = fetchedOptions.filter(
                item => !value.some(v => isOptionEqualToValue(item, v)),
            );
            displayOrderAtOpenRef.current = [...pinnedNow, ...restNow];
        } else {
            displayOrderAtOpenRef.current = [];
        }
        prevOpenRef.current = open;
    }

    // While open, preserve snapshot order; append any newly fetched items (e.g. from search)
    // at the end so searching still surfaces results without reordering existing rows.
    const displayOptions = useMemo(() => {
        const order = displayOrderAtOpenRef.current;
        if (order.length === 0) return fetchedOptions;
        const orderedExisting = order.filter(o =>
            fetchedOptions.some(f => isOptionEqualToValue(f, o)),
        );
        const newItems = fetchedOptions.filter(
            f => !order.some(o => isOptionEqualToValue(f, o)),
        );
        return [...orderedExisting, ...newItems];
    }, [fetchedOptions, open, isOptionEqualToValue]);

    function isSelected(option: T): boolean {
        return value.some(v => isOptionEqualToValue(option, v));
    }

    function handleToggle(option: T) {
        if (isSelected(option)) {
            onSelect(value.filter(v => !isOptionEqualToValue(option, v)));
        } else {
            onSelect([...value, { ...option }]);
        }
        setQuery('');
        inputRef.current?.focus();
    }

    function handleRemove(index: number) {
        onSelect(value.filter((_, i) => i !== index));
    }

    function handleClearAll(e: React.MouseEvent) {
        e.stopPropagation();
        onSelect([]);
        setQuery('');
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Backspace' && query === '' && value.length > 0) {
            onSelect(value.slice(0, -1));
            return;
        }

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
                    handleToggle(displayOptions[highlightedIndex]);
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
        <div data-slot="multi-selectable-autocomplete" className={cn('relative w-full', className)}>
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
                        ref={anchorRef}
                        className={cn(
                            'group relative',
                            disabled && 'opacity-50 cursor-default',
                        )}
                    >
                        <div
                            className={cn(
                                'flex min-h-[38px] flex-wrap items-center gap-1 py-1.5 transition-colors',
                                variant !== 'plain' && 'px-2',
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
                            {value.map((item, index) => {
                                const itemLabel = getOptionLabel(item);
                                return (
                                    <span
                                        key={getOptionKey ? getOptionKey(item) : index}
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            'bg-[var(--primary)]/10 text-[var(--primary)]',
                                            'dark:bg-[var(--primary)]/20 dark:text-[var(--primary)]',
                                        )}
                                    >
                                        {itemLabel.primary}
                                        <button
                                            type="button"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleRemove(index);
                                            }}
                                            disabled={disabled}
                                            className="cursor-pointer rounded-full p-0.5 hover:bg-[var(--primary)]/20 dark:hover:bg-[var(--primary)]/30"
                                            aria-label={`Remove ${itemLabel.primary}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                );
                            })}
                            <div className="flex min-w-[80px] flex-1 items-center">
                                {showSearchIcon && <Search className={cn('mr-1.5 h-4 w-4 shrink-0', blur ? 'text-white/50' : 'text-gray-400 dark:text-gray-500')} />}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-haspopup="listbox"
                                    aria-autocomplete="list"
                                    disabled={disabled}
                                    placeholder={value.length === 0 ? placeholder : ''}
                                    value={query}
                                    onChange={e => {
                                        setTouched(true);
                                        setQuery(e.target.value);
                                        setHighlightedIndex(-1);
                                        if (!open) setOpen(true);
                                    }}
                                    onMouseDown={() => {
                                        wasFocusedOnMouseDownRef.current =
                                            document.activeElement === inputRef.current;
                                    }}
                                    onFocus={() => {
                                        requestAnimationFrame(() => {
                                            setTouched(true);
                                            setOpen(true);
                                        });
                                    }}
                                    onClick={() => {
                                        setTouched(true);
                                        if (wasFocusedOnMouseDownRef.current) {
                                            setOpen(prev => !prev);
                                        } else {
                                            setOpen(true);
                                        }
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
                            </div>
                            {loading && <Loader2 className="ml-1 h-4 w-4 shrink-0 animate-spin text-gray-400" />}
                            {clearable && value.length > 0 && !loading && (
                                <button
                                    type="button"
                                    onClick={handleClearAll}
                                    className="ml-1 shrink-0 cursor-pointer rounded-sm p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    aria-label="Clear all"
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
                        onInteractOutside={e => {
                            if (anchorRef.current?.contains(e.target as Node)) {
                                e.preventDefault();
                            }
                        }}
                        style={{ zIndex: 1400, maxHeight: 'min(240px, var(--radix-popover-content-available-height))' }}
                        className={cn(
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
                                    : query === ''
                                      ? 'No results found'
                                      : `No results for "${query}"`}
                            </div>
                        ) : (
                            <ul ref={listRef} role="listbox" aria-multiselectable="true" className="py-1">
                                {displayOptions.map((option, index) => {
                                    const optionLabel = getOptionLabel(option);
                                    const selected = isSelected(option);
                                    const isHighlighted = index === highlightedIndex;

                                    return (
                                        <li
                                            key={getOptionKey ? getOptionKey(option) : index}
                                            role="option"
                                            aria-selected={selected}
                                            data-highlighted={isHighlighted || undefined}
                                            onMouseDown={e => e.preventDefault()}
                                            onClick={() => handleToggle(option)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                                                'text-gray-900 dark:text-gray-100',
                                                isHighlighted && 'bg-gray-100 dark:bg-gray-700',
                                                !isHighlighted && 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                                            )}
                                        >
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
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold leading-tight">
                                                    {optionLabel.primary}
                                                </div>
                                                {optionLabel.secondary && (
                                                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                        {optionLabel.secondary}
                                                    </div>
                                                )}
                                            </div>
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
