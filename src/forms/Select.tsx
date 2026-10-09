'use client';

import {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useRef,
    useState,
    type ElementType,
    type FocusEvent,
    type KeyboardEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';
import { Check, Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFormControl, type InputSize, type InputVariant } from './FormControl';
import { InputField, isFilledValue, type InputBaseProps } from './InputBase';
import { InternalArrowDropDownIcon } from '@/icons/internal-icons';
import { Menu, type MenuProps } from '@/overlays/Menu';
import { useForkRef } from '@/hooks/use-fork-ref';

export interface SelectChangeEvent<T = unknown> {
    target: { value: T; name?: string };
    currentTarget?: EventTarget | null;
    nativeEvent?: Event;
    preventDefault: () => void;
    stopPropagation: () => void;
}

type OptionElement = ReactElement<{
    value?: unknown;
    children?: ReactNode;
    disabled?: boolean;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    selected?: boolean;
    role?: string;
}>;

export interface SelectMenuProps extends Partial<
    Omit<MenuProps, 'open' | 'anchorEl' | 'onClose' | 'children'>
> {}

export interface SelectProps<T = unknown> extends Omit<
    InputBaseProps,
    'value' | 'defaultValue' | 'onChange' | 'multiline' | 'rows' | 'minRows' | 'maxRows' | 'type'
> {
    value?: T;
    defaultValue?: T;
    onChange?: (event: SelectChangeEvent<T>, child: ReactNode) => void;
    multiple?: boolean;
    displayEmpty?: boolean;
    renderValue?: (value: T) => ReactNode;
    label?: ReactNode;
    labelId?: string;
    open?: boolean;
    onOpen?: (event: React.SyntheticEvent) => void;
    onClose?: (event: React.SyntheticEvent | Event) => void;
    MenuProps?: SelectMenuProps;
    IconComponent?: ElementType<{ className?: string }>;
    autoWidth?: boolean;
    displayClassName?: string;
    children?: ReactNode;
    notched?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
}

interface SelectInputProps {
    ref?: Ref<HTMLElement>;
    className?: string;
    value?: unknown;
    name?: string;
    id?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
    'aria-label'?: string;
    select: {
        variant: InputVariant;
        size: InputSize;
        multiple: boolean;
        displayEmpty: boolean;
        renderValue?: (value: unknown) => ReactNode;
        labelId?: string;
        open?: boolean;
        onOpen?: (event: React.SyntheticEvent) => void;
        onClose?: (event: React.SyntheticEvent | Event) => void;
        onChange: (event: SelectChangeEvent<unknown>, child: ReactNode) => void;
        menuProps?: SelectMenuProps;
        IconComponent: ElementType<{ className?: string }>;
        autoWidth: boolean;
        displayClassName?: string;
        searchable?: boolean;
        searchPlaceholder: string;
        children?: ReactNode;
    };
}

const AUTO_SEARCH_THRESHOLD = 7;

function nodeText(node: ReactNode): string {
    if (node == null || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(nodeText).join(' ');
    if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
    return '';
}

function focusFirstOption(from: HTMLElement) {
    const paper = from.closest('[data-slot=select-menu-search]')?.parentElement;
    const option = paper?.querySelector<HTMLElement>('[role=option]:not([aria-disabled=true])');
    option?.focus();
}

function areEqual(a: unknown, b: unknown): boolean {
    if (typeof b === 'object' && b !== null) return a === b;
    return String(a) === String(b);
}

function createChangeEvent<T>(
    value: T,
    name: string | undefined,
    nativeEvent?: Event
): SelectChangeEvent<T> {
    return {
        target: { value, name },
        currentTarget: null,
        nativeEvent,
        preventDefault: () => nativeEvent?.preventDefault(),
        stopPropagation: () => nativeEvent?.stopPropagation(),
    };
}

const SelectInput = forwardRef<HTMLElement, Omit<SelectInputProps, 'ref'>>(function SelectInput(
    {
        className,
        value,
        name,
        id,
        disabled,
        readOnly,
        required,
        autoFocus,
        onFocus,
        onBlur,
        onKeyDown,
        'aria-invalid': ariaInvalid,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        select,
    },
    ref
) {
    const {
        variant,
        multiple,
        displayEmpty,
        renderValue,
        labelId,
        open: openProp,
        onOpen,
        onClose,
        onChange,
        menuProps,
        IconComponent,
        autoWidth,
        displayClassName,
        searchable: searchableProp,
        searchPlaceholder,
        children,
    } = select;
    const [query, setQuery] = useState('');
    const displayRef = useRef<HTMLDivElement | null>(null);
    const handleDisplayRef = useForkRef<HTMLDivElement>(displayRef, ref as Ref<HTMLDivElement>);
    const [openState, setOpenState] = useState(false);
    const [menuMinWidth, setMenuMinWidth] = useState<number | undefined>(undefined);
    const open = openProp ?? openState;

    const update = (nextOpen: boolean, event: React.SyntheticEvent | Event) => {
        if (!nextOpen) setQuery('');
        if (nextOpen) {
            const root = displayRef.current?.parentElement;
            if (root && !autoWidth) setMenuMinWidth(root.clientWidth);
            onOpen?.(event as React.SyntheticEvent);
        } else {
            onClose?.(event);
        }
        if (openProp === undefined) setOpenState(nextOpen);
    };

    const options = Children.toArray(children).filter((child): child is OptionElement =>
        isValidElement(child)
    );
    const values = multiple ? (Array.isArray(value) ? value : []) : [value];
    const selectedChildren = options.filter(
        child => child.props.value !== undefined && values.some(v => areEqual(v, child.props.value))
    );

    const computeDisplay = isFilledValue(value) || displayEmpty;
    let display: ReactNode;
    if (!computeDisplay) {
        display = null;
    } else if (renderValue) {
        display = renderValue(value);
    } else if (multiple) {
        display = (
            <span className="flex flex-wrap gap-1">
                {selectedChildren.map((child, index) => (
                    <span
                        key={index}
                        data-slot="select-chip"
                        className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary-main/15 px-2 py-0.5 text-[0.8125rem] leading-5 font-medium text-primary-main"
                    >
                        <span className="truncate">{child.props.children}</span>
                        {disabled || readOnly ? null : (
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-label="Remove"
                                className="inline-flex cursor-pointer items-center rounded-sm border-0 bg-transparent p-0 text-current opacity-70 hover:opacity-100"
                                onMouseDown={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }}
                                onClick={event => {
                                    event.stopPropagation();
                                    const next = values.filter(
                                        item => !areEqual(item, child.props.value)
                                    );
                                    onChange(createChangeEvent(next, name, event.nativeEvent), child);
                                }}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </span>
                ))}
            </span>
        );
    } else {
        display = selectedChildren[0]?.props.children;
    }

    const searchable =
        searchableProp ??
        options.filter(child => child.props.value !== undefined).length > AUTO_SEARCH_THRESHOLD;
    const normalizedQuery = query.trim().toLowerCase();
    const visibleOptions = normalizedQuery
        ? options.filter(
              child =>
                  child.props.value !== undefined &&
                  nodeText(child.props.children).toLowerCase().includes(normalizedQuery)
          )
        : options;

    const items = visibleOptions.map(child => {
        const selected =
            child.props.value !== undefined && values.some(v => areEqual(v, child.props.value));
        return cloneElement(child, {
            role: 'option',
            selected,
            ...(multiple && child.props.value !== undefined
                ? {
                      children: (
                          <span className="flex w-full items-center justify-between gap-3">
                              <span className="min-w-0 truncate">{child.props.children}</span>
                              <Check
                                  className={cn(
                                      'h-4 w-4 shrink-0 text-primary-main',
                                      !selected && 'invisible'
                                  )}
                              />
                          </span>
                      ),
                  }
                : null),
            onClick: (event: MouseEvent<HTMLElement>) => {
                child.props.onClick?.(event);
                if (child.props.value === undefined) return;
                let newValue: unknown = child.props.value;
                if (multiple) {
                    const current = Array.isArray(value) ? [...value] : [];
                    const index = current.findIndex(item => areEqual(item, child.props.value));
                    if (index === -1) current.push(child.props.value);
                    else current.splice(index, 1);
                    newValue = current;
                }
                if (multiple || !areEqual(value, newValue)) {
                    onChange(createChangeEvent(newValue, name, event.nativeEvent), child);
                }
                if (!multiple) update(false, event);
            },
        });
    });

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!readOnly && [' ', 'ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            event.preventDefault();
            update(true, event);
        }
        onKeyDown?.(event);
    };

    const isEmpty =
        display == null || display === '' || (Array.isArray(display) && display.length === 0);

    return (
        <>
            <div
                ref={handleDisplayRef}
                id={id}
                tabIndex={disabled ? undefined : 0}
                role="combobox"
                data-slot="select"
                aria-controls={open ? `${id ?? name ?? 'select'}-listbox` : undefined}
                aria-disabled={disabled ? 'true' : undefined}
                aria-expanded={open ? 'true' : 'false'}
                aria-haspopup="listbox"
                aria-label={ariaLabel}
                aria-labelledby={labelId}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid ? 'true' : undefined}
                aria-required={required ? 'true' : undefined}
                autoFocus={autoFocus}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                onMouseDown={event => {
                    if (disabled || readOnly || event.button !== 0) return;
                    event.preventDefault();
                    displayRef.current?.focus();
                    update(true, event);
                }}
                className={cn(
                    className,
                    'h-auto min-h-[1.4375em] cursor-pointer select-none overflow-hidden text-ellipsis',
                    multiple && !renderValue ? 'whitespace-normal' : 'whitespace-nowrap',
                    variant === 'outlined'
                        ? 'rounded-lg focus:rounded-lg'
                        : 'rounded-none focus:rounded-none',
                    variant === 'standard' ? 'min-w-4 pr-6!' : 'pr-8!',
                    disabled && 'cursor-default',
                    displayClassName
                )}
            >
                {isEmpty ? (
                    <span className="notranslate" aria-hidden>
                        {'\u200b'}
                    </span>
                ) : (
                    display
                )}
            </div>
            <input
                value={Array.isArray(value) ? value.join(',') : String(value ?? '')}
                name={name}
                aria-invalid={ariaInvalid}
                aria-hidden
                tabIndex={-1}
                disabled={disabled}
                readOnly
                required={required}
                className="pointer-events-none absolute bottom-0 left-0 box-border w-full opacity-0"
            />
            <IconComponent
                data-slot="select-icon"
                className={cn(
                    'pointer-events-none absolute top-[calc(50%-0.5em)] text-action-active',
                    variant === 'standard' ? 'right-0' : 'right-[7px]',
                    open && 'rotate-180',
                    disabled && 'text-action-disabled'
                )}
            />
            <Menu
                anchorEl={() => displayRef.current?.parentElement ?? null}
                open={open}
                onClose={event => update(false, event)}
                autoFocus={!searchable}
                header={
                    searchable ? (
                        <div
                            data-slot="select-menu-search"
                            className="sticky top-0 z-[1] border-b border-solid border-divider bg-paper p-2"
                        >
                            <label className="flex items-center gap-2 rounded-md border border-solid border-input-border px-2 py-1.5 text-sm focus-within:border-primary-main">
                                <Search className="h-4 w-4 shrink-0 text-fg-secondary" />
                                <input
                                    autoFocus
                                    value={query}
                                    placeholder={searchPlaceholder}
                                    aria-label={searchPlaceholder}
                                    onChange={event => setQuery(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key === 'ArrowDown') {
                                            event.preventDefault();
                                            focusFirstOption(event.currentTarget);
                                        } else if (event.key === 'Escape') {
                                            update(false, event.nativeEvent);
                                        }
                                        event.stopPropagation();
                                    }}
                                    className="w-full min-w-0 border-0 bg-transparent p-0 text-sm text-fg outline-0 placeholder:text-fg-secondary"
                                />
                            </label>
                        </div>
                    ) : null
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                {...menuProps}
                listProps={{
                    role: 'listbox',
                    itemRole: 'option',
                    disableListWrap: true,
                    id: `${id ?? name ?? 'select'}-listbox`,
                    'aria-labelledby': labelId,
                    'aria-multiselectable': multiple ? 'true' : undefined,
                    ...menuProps?.listProps,
                }}
                paperProps={{
                    ...menuProps?.paperProps,
                    style: { minWidth: menuMinWidth, ...menuProps?.paperProps?.style },
                }}
            >
                {items.length > 0 ? (
                    items
                ) : (
                    <li className="px-4 py-2 text-sm text-fg-secondary" role="presentation">
                        No matches
                    </li>
                )}
            </Menu>
        </>
    );
});

type SelectComponent = <T = unknown>(
    props: SelectProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
    {
        value,
        defaultValue,
        onChange,
        multiple = false,
        displayEmpty = false,
        renderValue,
        label,
        labelId,
        open,
        onOpen,
        onClose,
        MenuProps: menuProps,
        IconComponent = InternalArrowDropDownIcon,
        autoWidth = false,
        displayClassName,
        searchable,
        searchPlaceholder = 'Search…',
        children,
        variant: variantProp,
        size: sizeProp,
        notched,
        inputProps,
        ...other
    },
    ref
) {
    const fcs = useFormControl();
    const variant = variantProp ?? fcs?.variant ?? 'outlined';
    const size = sizeProp ?? fcs?.size ?? 'medium';
    const [uncontrolled, setUncontrolled] = useState<unknown>(defaultValue ?? (multiple ? [] : ''));
    const current = value !== undefined ? value : uncontrolled;
    const handleChange = (event: SelectChangeEvent<unknown>, child: ReactNode) => {
        if (value === undefined) setUncontrolled(event.target.value);
        onChange?.(event, child);
    };
    return (
        <InputField
            ref={ref}
            variant={variant}
            size={size}
            value={current}
            notchedLabel={label}
            notched={notched}
            inputComponent={SelectInput}
            inputProps={{
                ...inputProps,
                select: {
                    variant,
                    size,
                    multiple,
                    displayEmpty,
                    renderValue,
                    labelId,
                    open,
                    onOpen,
                    onClose,
                    onChange: handleChange,
                    menuProps,
                    IconComponent,
                    autoWidth,
                    displayClassName,
                    searchable,
                    searchPlaceholder,
                    children,
                },
            }}
            {...other}
        />
    );
}) as SelectComponent;
