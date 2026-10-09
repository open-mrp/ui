import { autoUpdate, flip, size as sizeMiddleware, useFloating } from '@floating-ui/react-dom';
import {
    useEffect,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type HTMLAttributes,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    type Ref,
    type SyntheticEvent,
} from 'react';
import { Chip } from '@/signifiers/Chip';
import { cn } from '@/utils/cn';
import { IconButton } from '@/buttons/IconButton';
import { InternalArrowDropDownIcon, InternalCloseIcon } from '@/icons/internal-icons';
import { Portal } from '@/overlays/Modal';
import { useForkRef } from '@/hooks/use-fork-ref';

export type AutocompleteChangeReason =
    'createOption' | 'selectOption' | 'removeOption' | 'clear' | 'blur';
export type AutocompleteInputChangeReason =
    'input' | 'reset' | 'clear' | 'blur' | 'selectOption' | 'removeOption';

export interface FilterOptionsState<T> {
    inputValue: string;
    getOptionLabel: (option: T) => string;
}

export interface AutocompleteRenderInputParams {
    id: string;
    disabled: boolean;
    fullWidth: boolean;
    size: 'compact' | 'small' | 'medium';
    slotProps: {
        input: {
            ref: Ref<HTMLDivElement>;
            className: string;
            startAdornment?: ReactNode;
            endAdornment: ReactNode;
            onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
        };
        htmlInput: Record<string, unknown> & { className: string };
        inputLabel: { htmlFor: string; id: string };
    };
}

export interface AutocompleteItemProps {
    key: number;
    'data-item-index': number;
    tabIndex: number;
    className: string;
    disabled: boolean;
    onDelete: (event: SyntheticEvent) => void;
}

export interface AutocompleteProps<
    T,
    Multiple extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
> {
    options: readonly T[];
    value?: Multiple extends true
        ? Array<T | (FreeSolo extends true ? string : never)>
        : T | null | (FreeSolo extends true ? string : never);
    defaultValue?: AutocompleteProps<T, Multiple, FreeSolo>['value'];
    onChange?: (
        event: SyntheticEvent,
        value: Multiple extends true
            ? Array<T | (FreeSolo extends true ? string : never)>
            : T | null | (FreeSolo extends true ? string : never),
        reason: AutocompleteChangeReason
    ) => void;
    inputValue?: string;
    onInputChange?: (
        event: SyntheticEvent | null,
        value: string,
        reason: AutocompleteInputChangeReason
    ) => void;
    getOptionLabel?: (option: T | (FreeSolo extends true ? string : never)) => string;
    isOptionEqualToValue?: (option: T, value: T) => boolean;
    filterOptions?: (options: readonly T[], state: FilterOptionsState<T>) => readonly T[];
    renderOption?: (
        props: HTMLAttributes<HTMLLIElement> & { key: string },
        option: T,
        state: { selected: boolean; index: number }
    ) => ReactNode;
    renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
    renderValue?: (
        value: Array<T | string>,
        getItemProps: (args: { index: number }) => AutocompleteItemProps
    ) => ReactNode;
    getOptionDisabled?: (option: T) => boolean;
    multiple?: Multiple;
    freeSolo?: FreeSolo;
    loading?: boolean;
    loadingText?: ReactNode;
    noOptionsText?: ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: 'compact' | 'small' | 'medium';
    disableClearable?: boolean;
    disableCloseOnSelect?: boolean;
    openOnFocus?: boolean;
    autoHighlight?: boolean;
    clearOnBlur?: boolean;
    forcePopupIcon?: boolean | 'auto';
    open?: boolean;
    onOpen?: (event: SyntheticEvent) => void;
    onClose?: (event: SyntheticEvent | Event, reason: string) => void;
    id?: string;
    className?: string;
    paperClassName?: string;
    listboxClassName?: string;
}

function defaultLabel(option: unknown): string {
    if (option == null) return '';
    if (typeof option === 'string') return option;
    if (typeof option === 'object' && 'label' in option)
        return String((option as { label: unknown }).label);
    return String(option);
}

function stripAccents(value: string): string {
    return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function createFilterOptions<T>() {
    return (options: readonly T[], { inputValue, getOptionLabel }: FilterOptionsState<T>): T[] => {
        const query = stripAccents(inputValue.toLowerCase());
        return options.filter(option =>
            stripAccents(getOptionLabel(option).toLowerCase()).includes(query)
        );
    };
}

const inputRootClasses =
    'data-[variant=outlined]:p-[9px] data-[variant=outlined]:data-[size=small]:py-1.5 data-[variant=outlined]:data-[size=small]:pl-1.5 data-[variant=outlined]:data-[size=compact]:py-[3px] data-[variant=outlined]:data-[size=compact]:pl-1.5 data-[variant=standard]:pb-px data-[variant=filled]:pt-[19px] data-[variant=filled]:pl-2 data-[variant=filled]:data-[size=small]:pb-px';

const inputClasses =
    'w-0 min-w-[30px] grow text-ellipsis [[data-variant=outlined]_&]:py-[7.5px] [[data-variant=outlined]_&]:pr-1 [[data-variant=outlined]_&]:pl-[5px] [[data-variant=outlined][data-size=small]_&]:py-[4px] [[data-variant=outlined][data-size=small]_&]:pl-2 [[data-variant=outlined][data-size=compact]_&]:py-[3px] [[data-variant=outlined][data-size=compact]_&]:pl-2 [[data-variant=standard]_&]:py-1 [[data-variant=standard]_&]:pr-1 [[data-variant=standard]_&]:pl-0 [[data-variant=standard][data-size=small]_&]:pt-0.5 [[data-variant=standard][data-size=small]_&]:pb-[3px] [[data-variant=filled]_&]:px-1 [[data-variant=filled]_&]:py-[7px] [[data-variant=filled][data-size=small]_&]:py-[2.5px]';

export function Autocomplete<
    T,
    Multiple extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
>({
    options,
    value: valueProp,
    defaultValue,
    onChange,
    inputValue: inputValueProp,
    onInputChange,
    getOptionLabel: getOptionLabelProp,
    isOptionEqualToValue = (option, value) => option === value,
    filterOptions = createFilterOptions<T>(),
    renderOption,
    renderInput,
    renderValue,
    getOptionDisabled,
    multiple,
    freeSolo,
    loading = false,
    loadingText = 'Loading…',
    noOptionsText = 'No options',
    disabled = false,
    fullWidth = false,
    size = 'medium',
    disableClearable = false,
    disableCloseOnSelect = false,
    openOnFocus = false,
    autoHighlight = false,
    clearOnBlur = !freeSolo,
    forcePopupIcon = 'auto',
    open: openProp,
    onOpen,
    onClose,
    id: idProp,
    className,
    paperClassName,
    listboxClassName,
}: AutocompleteProps<T, Multiple, FreeSolo>) {
    const getOptionLabel = (getOptionLabelProp ?? defaultLabel) as (option: T | string) => string;
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const isMultiple = Boolean(multiple);
    const [uncontrolledValue, setUncontrolledValue] = useState<unknown>(
        defaultValue ?? (isMultiple ? [] : null)
    );
    const value = (valueProp !== undefined ? valueProp : uncontrolledValue) as unknown;
    const values = (
        isMultiple ? (Array.isArray(value) ? value : []) : value == null ? [] : [value]
    ) as Array<T | string>;
    const [inputState, setInputState] = useState(() =>
        !isMultiple && value != null ? getOptionLabel(value as T) : ''
    );
    const inputValue = inputValueProp ?? inputState;
    const [openState, setOpenState] = useState(false);
    const open = openProp ?? openState;
    const [focused, setFocused] = useState(false);
    const [highlight, setHighlight] = useState<{
        index: number;
        reason: 'keyboard' | 'mouse' | null;
    }>({ index: -1, reason: null });
    const highlighted = highlight.index;
    const [dirty, setDirty] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listboxRef = useRef<HTMLUListElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const {
        refs: { setReference, setFloating },
        floatingStyles,
    } = useFloating({
        placement: 'bottom-start',
        open,
        middleware: [
            flip(),
            sizeMiddleware({
                apply({ rects, elements }) {
                    elements.floating.style.width = `${rects.reference.width}px`;
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    });
    const attachAnchor = useForkRef<HTMLDivElement>(setReference, rootRef);

    const [previousValue, setPreviousValue] = useState(value);
    if (previousValue !== value) {
        setPreviousValue(value);
        if (!isMultiple && inputValueProp === undefined) {
            setInputState(value != null ? getOptionLabel(value as T) : '');
        }
    }

    const setInput = (
        event: SyntheticEvent | null,
        next: string,
        reason: AutocompleteInputChangeReason
    ) => {
        if (inputValueProp === undefined) setInputState(next);
        onInputChange?.(event, next, reason);
    };

    const isSelected = (option: T) =>
        values.some(item =>
            typeof item !== 'string' || typeof option === 'string'
                ? isOptionEqualToValue(option, item as T)
                : false
        );

    const filterInput =
        !isMultiple && value != null && inputValue === getOptionLabel(value as T) && !dirty
            ? ''
            : inputValue;
    const filtered = filterOptions(options, {
        inputValue: filterInput,
        getOptionLabel: getOptionLabel as (option: T) => string,
    });

    const openPopup = (event: SyntheticEvent) => {
        if (open || disabled) return;
        if (openProp === undefined) setOpenState(true);
        onOpen?.(event);
    };

    const closePopup = (event: SyntheticEvent | Event, reason: string) => {
        if (!open) return;
        if (openProp === undefined) setOpenState(false);
        onClose?.(event, reason);
    };

    const commitValue = (
        event: SyntheticEvent,
        next: unknown,
        reason: AutocompleteChangeReason
    ) => {
        if (valueProp === undefined) setUncontrolledValue(next);
        onChange?.(event, next as never, reason);
    };

    const selectOption = (
        event: SyntheticEvent,
        option: T | string,
        reason: AutocompleteChangeReason
    ) => {
        if (isMultiple) {
            const current = [...values];
            const index = current.findIndex(item =>
                typeof option === 'string' || typeof item === 'string'
                    ? item === option
                    : isOptionEqualToValue(option, item)
            );
            if (index === -1) current.push(option);
            else current.splice(index, 1);
            commitValue(event, current, index === -1 ? reason : 'removeOption');
            setInput(event, '', 'reset');
        } else {
            if (value !== option) commitValue(event, option, reason);
            setInput(event, getOptionLabel(option), 'selectOption');
        }
        setDirty(false);
        if (!disableCloseOnSelect) closePopup(event, reason);
    };

    const removeAt = (event: SyntheticEvent, index: number) => {
        const current = [...values];
        current.splice(index, 1);
        commitValue(event, current, 'removeOption');
    };

    const isOptionDisabledAt = (index: number) => {
        const option = filtered[index];
        return option === undefined || Boolean(getOptionDisabled?.(option as T));
    };

    const validOptionIndex = (start: number, direction: 'next' | 'previous') => {
        if (filtered.length === 0 || start < 0 || start >= filtered.length) return -1;
        let index = start;
        for (let attempts = 0; attempts < filtered.length; attempts += 1) {
            if (!isOptionDisabledAt(index)) return index;
            index =
                direction === 'next'
                    ? (index + 1) % filtered.length
                    : (index - 1 + filtered.length) % filtered.length;
        }
        return -1;
    };

    const defaultHighlighted = autoHighlight ? 0 : -1;
    const valueKey = isMultiple ? '' : value != null ? getOptionLabel(value as T) : '';
    const filteredCount = filtered.length;

    const syncKey = open ? `${filteredCount}|${inputValue}|${valueKey}` : null;
    const [lastSyncKey, setLastSyncKey] = useState<string | null>(null);
    if (syncKey !== lastSyncKey) {
        setLastSyncKey(syncKey);
        if (syncKey === null) {
            if (highlight.index !== -1) setHighlight({ index: -1, reason: null });
        } else {
            const reopened = lastSyncKey === null;
            const valueItem = (isMultiple ? values[0] : value) as T | undefined | null;
            const currentOption = filtered[highlight.index];
            if (filteredCount === 0 || valueItem == null) {
                setHighlight({ index: validOptionIndex(defaultHighlighted, 'next'), reason: null });
            } else if (
                !(
                    isMultiple &&
                    !reopened &&
                    currentOption !== undefined &&
                    isSelected(currentOption as T)
                )
            ) {
                const itemIndex = filtered.findIndex(option =>
                    isOptionEqualToValue(option as T, valueItem as T)
                );
                setHighlight(
                    itemIndex === -1
                        ? { index: validOptionIndex(defaultHighlighted, 'next'), reason: null }
                        : { index: itemIndex, reason: null }
                );
            }
        }
    }

    useEffect(() => {
        const listbox = listboxRef.current;
        if (!open || !listbox) return;
        if (highlighted < 0) {
            listbox.scrollTop = 0;
            return;
        }
        if (highlight.reason === 'mouse') return;
        const option = listbox.querySelector<HTMLElement>(
            `[data-option-index="${highlighted}"]`
        );
        if (!option || listbox.scrollHeight <= listbox.clientHeight) return;
        const scrollBottom = listbox.clientHeight + listbox.scrollTop;
        const optionBottom = option.offsetTop + option.offsetHeight;
        if (optionBottom > scrollBottom) {
            listbox.scrollTop = optionBottom - listbox.clientHeight;
        } else if (option.offsetTop < listbox.scrollTop) {
            listbox.scrollTop = option.offsetTop;
        }
    }, [open, highlighted, highlight.reason]);

    const moveHighlight = (diff: number | 'start' | 'end', direction: 'next' | 'previous') => {
        if (!open) return;
        const maxIndex = filtered.length - 1;
        setHighlight(current => {
            let next: number;
            if (diff === 'start') next = 0;
            else if (diff === 'end') next = maxIndex;
            else {
                next = current.index + diff;
                if (next < 0) next = Math.abs(diff) > 1 ? 0 : maxIndex;
                else if (next > maxIndex) next = Math.abs(diff) > 1 ? maxIndex : 0;
            }
            return { index: validOptionIndex(next, direction), reason: 'keyboard' };
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowUp' ||
            event.key === 'PageDown' ||
            event.key === 'PageUp'
        ) {
            event.preventDefault();
            const forward = event.key === 'ArrowDown' || event.key === 'PageDown';
            const step = event.key === 'PageDown' || event.key === 'PageUp' ? 5 : 1;
            moveHighlight(forward ? step : -step, forward ? 'next' : 'previous');
            openPopup(event);
        } else if ((event.key === 'Home' || event.key === 'End') && open && !freeSolo) {
            event.preventDefault();
            moveHighlight(
                event.key === 'Home' ? 'start' : 'end',
                event.key === 'Home' ? 'next' : 'previous'
            );
        } else if (event.key === 'Enter') {
            if (open && highlighted >= 0 && filtered[highlighted] !== undefined) {
                event.preventDefault();
                selectOption(event, filtered[highlighted] as T, 'selectOption');
            } else if (freeSolo && inputValue !== '') {
                event.preventDefault();
                selectOption(event, inputValue, 'createOption');
            }
        } else if (event.key === 'Escape') {
            if (open) {
                event.preventDefault();
                event.stopPropagation();
                closePopup(event, 'escape');
            }
        } else if (
            event.key === 'Backspace' &&
            isMultiple &&
            inputValue === '' &&
            values.length > 0
        ) {
            removeAt(event, values.length - 1);
        }
    };

    const hasClearIcon = !disableClearable && !disabled && (values.length > 0 || inputValue !== '');
    const hasPopupIcon = (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;

    const getItemProps = ({ index }: { index: number }): AutocompleteItemProps => ({
        key: index,
        'data-item-index': index,
        tabIndex: -1,
        className: cn(
            'm-[3px] max-w-[calc(100%-6px)]',
            size !== 'medium' && 'm-0.5 max-w-[calc(100%-4px)]'
        ),
        disabled,
        onDelete: event => removeAt(event, index),
    });

    const startAdornment =
        isMultiple && values.length > 0
            ? renderValue
                ? renderValue(values, getItemProps)
                : values.map((item, index) => {
                      const { key, className, ...itemProps } = getItemProps({ index });
                      return (
                          <Chip
                              key={key}
                              size={size === 'medium' ? 'medium' : 'small'}
                              label={getOptionLabel(item)}
                              className={cn(
                                  'rounded-md bg-primary-main/15 font-medium text-primary-main [&_svg]:text-primary-main/70 [&_svg]:hover:text-primary-main',
                                  className
                              )}
                              {...itemProps}
                          />
                      );
                  })
            : undefined;

    const endAdornment = (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 [[data-variant=outlined]_&]:right-[9px] [[data-variant=filled]_&]:right-[9px]">
            {hasClearIcon ? (
                <IconButton
                    tabIndex={-1}
                    aria-label="Clear"
                    title="Clear"
                    onMouseDown={event => event.preventDefault()}
                    onClick={event => {
                        setInput(event, '', 'clear');
                        commitValue(event, isMultiple ? [] : null, 'clear');
                    }}
                    className={cn(
                        '-mr-0.5 p-1',
                        focused
                            ? 'visible'
                            : 'invisible [@media(pointer:fine)]:[[data-autocomplete]:hover_&]:visible'
                    )}
                >
                    <InternalCloseIcon fontSize="small" />
                </IconButton>
            ) : null}
            {hasPopupIcon ? (
                <IconButton
                    tabIndex={-1}
                    aria-label={open ? 'Close' : 'Open'}
                    title={open ? 'Close' : 'Open'}
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={event => {
                        if (open) closePopup(event, 'toggleInput');
                        else openPopup(event);
                        inputRef.current?.focus();
                    }}
                    className={cn('-mr-0.5 p-0.5', open && 'rotate-180')}
                >
                    <InternalArrowDropDownIcon />
                </IconButton>
            ) : null}
        </div>
    );

    const listboxId = `${id}-listbox`;

    const params: AutocompleteRenderInputParams = {
        id,
        disabled,
        fullWidth: true,
        size,
        slotProps: {
            input: {
                ref: attachAnchor,
                className: cn(
                    inputRootClasses,
                    isMultiple && 'flex-wrap',
                    hasPopupIcon !== hasClearIcon &&
                        'pr-[30px] data-[variant=outlined]:pr-[39px] data-[variant=filled]:pr-[39px]',
                    hasPopupIcon &&
                        hasClearIcon &&
                        'pr-14 data-[variant=outlined]:pr-[65px] data-[variant=filled]:pr-[65px]'
                ),
                startAdornment,
                endAdornment,
                onMouseDown: event => {
                    if ((event.target as HTMLElement).tagName !== 'INPUT') {
                        event.preventDefault();
                        inputRef.current?.focus();
                    }
                },
            },
            htmlInput: {
                ref: inputRef,
                value: inputValue,
                autoComplete: 'off',
                autoCapitalize: 'none',
                spellCheck: false,
                role: 'combobox',
                'aria-autocomplete': 'list',
                'aria-expanded': open,
                'aria-controls': open ? listboxId : undefined,
                'aria-activedescendant':
                    open && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined,
                disabled,
                className: inputClasses,
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                    setDirty(true);
                    setInput(event, event.target.value, 'input');
                    if (
                        event.target.value === '' &&
                        !isMultiple &&
                        !disableClearable &&
                        value != null
                    ) {
                        commitValue(event, null, 'clear');
                    }
                    openPopup(event);
                },
                onKeyDown: handleKeyDown,
                onFocus: (event: SyntheticEvent) => {
                    setFocused(true);
                    if (openOnFocus) openPopup(event);
                },
                onBlur: (event: SyntheticEvent) => {
                    setFocused(false);
                    closePopup(event, 'blur');
                    setDirty(false);
                    if (clearOnBlur && !isMultiple)
                        setInput(event, value != null ? getOptionLabel(value as T) : '', 'blur');
                    if (clearOnBlur && isMultiple) setInput(event, '', 'blur');
                    if (
                        freeSolo &&
                        !isMultiple &&
                        inputValue !== '' &&
                        inputValue !== (value != null ? getOptionLabel(value as T) : '')
                    ) {
                        commitValue(event, inputValue, 'blur');
                    }
                },
                onMouseDown: (event: MouseEvent<HTMLInputElement>) => {
                    if (event.button !== 0 || inputValue !== '' || !open) openPopup(event);
                    else closePopup(event, 'toggleInput');
                },
            },
            inputLabel: { htmlFor: id, id: `${id}-label` },
        },
    };

    const showPopup = open && (filtered.length > 0 || loading || !freeSolo);

    return (
        <>
            <div
                ref={rootRef}
                data-autocomplete=""
                data-focused={focused ? '' : undefined}
                className={cn(fullWidth && 'w-full', className)}
            >
                {renderInput(params)}
            </div>
            {showPopup ? (
                <Portal>
                    <div
                        ref={setFloating}
                        role="presentation"
                        className="z-[1300]"
                        style={floatingStyles}
                    >
                        <div
                            onMouseDown={event => event.preventDefault()}
                            className={cn(
                                'overflow-auto rounded-lg bg-blur font-plex-sans text-[1rem] leading-[1.5] text-fg shadow-elevation-1 backdrop-blur-[24px] transition-shadow duration-300 ease-standard',
                                paperClassName
                            )}
                        >
                            {loading && filtered.length === 0 ? (
                                <div className="px-4 py-3.5 text-fg-secondary">{loadingText}</div>
                            ) : null}
                            {!loading && filtered.length === 0 && !freeSolo ? (
                                <div className="px-4 py-3.5 text-fg-secondary">{noOptionsText}</div>
                            ) : null}
                            {filtered.length > 0 ? (
                                <ul
                                    ref={listboxRef}
                                    id={listboxId}
                                    role="listbox"
                                    aria-multiselectable={isMultiple || undefined}
                                    className={cn(
                                        'relative isolate m-0 max-h-[40vh] list-none overflow-auto py-2',
                                        listboxClassName
                                    )}
                                >
                                    {filtered.map((option, index) => {
                                        const selected = isSelected(option);
                                        const optionDisabled = getOptionDisabled?.(option) ?? false;
                                        const optionProps = {
                                            key: `${getOptionLabel(option)}-${index}`,
                                            id: `${id}-option-${index}`,
                                            role: 'option',
                                            tabIndex: -1,
                                            'data-option-index': index,
                                            'aria-selected': selected,
                                            'aria-disabled': optionDisabled,
                                            onMouseMove: () =>
                                                setHighlight(current =>
                                                    current.index === index &&
                                                    current.reason === 'mouse'
                                                        ? current
                                                        : { index, reason: 'mouse' }
                                                ),
                                            onClick: (event: MouseEvent<HTMLLIElement>) =>
                                                selectOption(event, option, 'selectOption'),
                                            className: cn(
                                                'box-border flex min-h-12 cursor-pointer items-center justify-start overflow-hidden px-4 py-1.5 outline-0 [-webkit-tap-highlight-color:transparent] screen-sm:min-h-[auto]',
                                                highlighted === index &&
                                                    (highlight.reason === 'keyboard'
                                                        ? 'bg-action-focus'
                                                        : 'bg-action-hover [@media(hover:none)]:bg-transparent'),
                                                selected &&
                                                    (highlighted !== index
                                                        ? 'bg-primary-main/8'
                                                        : highlight.reason === 'keyboard'
                                                          ? 'bg-primary-main/20'
                                                          : 'bg-primary-main/12 [@media(hover:none)]:bg-action-selected'),
                                                optionDisabled && 'pointer-events-none opacity-38'
                                            ),
                                        };
                                        if (renderOption)
                                            return renderOption(optionProps as never, option, {
                                                selected,
                                                index,
                                            });
                                        const { key, ...rest } = optionProps;
                                        return (
                                            <li key={key} {...rest}>
                                                {getOptionLabel(option)}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : null}
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    );
}
