import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ChangeEvent,
    type ComponentPropsWithoutRef,
    type ElementType,
    type FocusEvent,
    type KeyboardEvent,
    type ReactNode,
    type Ref,
} from 'react';
import { cn } from '@/utils/cn';
import {
    useFormControl,
    type FormControlState,
    type InputSize,
    type InputVariant,
} from './FormControl';
import { TextareaAutosize } from './TextareaAutosize';
import { useForkRef } from '@/hooks/use-fork-ref';

export function isFilledValue(value: unknown): boolean {
    if (value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    return String(value) !== '';
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface InputBaseProps extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onKeyUp' | 'defaultValue' | 'color'
> {
    variant?: InputVariant;
    size?: InputSize;
    value?: unknown;
    defaultValue?: unknown;
    onChange?: (event: ChangeEvent<FieldElement>) => void;
    onFocus?: (event: FocusEvent<FieldElement>) => void;
    onBlur?: (event: FocusEvent<FieldElement>) => void;
    onKeyDown?: (event: KeyboardEvent<FieldElement>) => void;
    onKeyUp?: (event: KeyboardEvent<FieldElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    error?: boolean;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number | string;
    minRows?: number | string;
    maxRows?: number | string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    disableUnderline?: boolean;
    hiddenLabel?: boolean;
    color?: FormControlState['color'];
    inputRef?: Ref<FieldElement>;
    inputProps?: Record<string, unknown>;
    inputClassName?: string;
    inputComponent?: ElementType;
    hidePlaceholder?: boolean;
    'aria-describedby'?: string;
    'aria-label'?: string;
}

const focusedUnderlineColors: Record<FormControlState['color'], string> = {
    primary: 'after:border-primary-main',
    secondary: 'after:border-secondary-main',
    error: 'after:border-error-main',
    warning: 'after:border-warning-main',
    info: 'after:border-info-main',
    success: 'after:border-success-main',
};

const focusedOutlineColors: Record<FormControlState['color'], string> = {
    primary: 'border-primary-main',
    secondary: 'border-secondary-main',
    error: 'border-error-main',
    warning: 'border-warning-main',
    info: 'border-info-main',
    success: 'border-success-main',
};

const outlinedPadding: Record<InputSize, string> = {
    compact: 'px-3.5 pt-[7px] pb-[5px]',
    small: 'px-3.5 py-[10px]',
    medium: 'px-3.5 py-[16.5px]',
};

interface InputState {
    variant: InputVariant;
    size: InputSize;
    focused: boolean;
    error: boolean;
    disabled: boolean;
    multiline: boolean;
    fullWidth: boolean;
    adornedStart: boolean;
    adornedEnd: boolean;
    disableUnderline: boolean;
    hiddenLabel: boolean;
    formControl: boolean;
    color: FormControlState['color'];
    select?: boolean;
}

export function inputRootClasses(state: InputState): string {
    const {
        variant,
        size,
        focused,
        error,
        disabled,
        multiline,
        fullWidth,
        adornedStart,
        adornedEnd,
        disableUnderline,
    } = state;
    const small = size !== 'medium';
    const underline =
        variant !== 'outlined' && !disableUnderline
            ? cn(
                  "before:pointer-events-none before:absolute before:right-0 before:bottom-0 before:left-0 before:border-b before:border-solid before:border-[rgba(0,0,0,0.42)] before:transition-[border-bottom-color] before:duration-200 before:ease-standard before:content-[''] dark:before:border-[rgba(255,255,255,0.7)]",
                  "after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:border-b-2 after:border-solid after:transition-transform after:duration-200 after:ease-decelerate after:content-['']",
                  focusedUnderlineColors[state.color],
                  focused ? 'after:scale-x-100' : 'after:scale-x-0',
                  !disabled &&
                      !error &&
                      (variant === 'standard'
                          ? 'hover:before:border-b-2 hover:before:border-fg'
                          : 'hover:before:border-fg'),
                  disabled && 'before:border-dotted',
                  error && 'before:border-error-main after:border-error-main'
              )
            : '';
    return cn(
        'relative box-border inline-flex cursor-text items-center font-plex-sans font-normal leading-[1.4375em] text-fg',
        variant === 'outlined' && small ? 'text-[0.875rem]' : 'text-[1rem]',
        disabled && 'cursor-default text-fg-disabled',
        fullWidth && 'w-full',
        multiline && (small ? 'pt-px pb-[5px]' : 'pt-1 pb-[5px]'),
        variant === 'standard' &&
            state.formControl &&
            '[label+&]:mt-4 [[data-slot=input-label]+&]:mt-4',
        variant === 'outlined' && 'rounded-lg bg-fg/[0.025]',
        variant === 'outlined' && adornedStart && 'pl-3.5',
        variant === 'outlined' && adornedEnd && !state.select && 'pr-3.5',
        variant === 'outlined' && multiline && outlinedPadding[size],
        variant === 'filled' &&
            'rounded-t-lg bg-[rgba(0,0,0,0.06)] transition-[background-color] duration-200 ease-decelerate dark:bg-[rgba(255,255,255,0.09)]',
        variant === 'filled' &&
            !focused &&
            !disabled &&
            'hover:bg-[rgba(0,0,0,0.09)] dark:hover:bg-[rgba(255,255,255,0.13)]',
        variant === 'filled' &&
            disabled &&
            'bg-[rgba(0,0,0,0.12)] dark:bg-[rgba(255,255,255,0.12)]',
        variant === 'filled' && adornedStart && 'pl-3',
        variant === 'filled' && adornedEnd && !state.select && 'pr-3',
        variant === 'filled' &&
            multiline &&
            (state.hiddenLabel
                ? small
                    ? 'px-3 pt-2 pb-[9px]'
                    : 'px-3 pt-4 pb-[17px]'
                : small
                  ? 'px-3 pt-[21px] pb-1'
                  : 'px-3 pt-[25px] pb-2'),
        underline,
        variant === 'outlined' && 'group/outlined'
    );
}

export function inputElementClasses(state: InputState): string {
    const { variant, size, multiline, adornedStart, adornedEnd, hiddenLabel } = state;
    const small = size !== 'medium';
    let padding = '';
    if (multiline) padding = 'p-0';
    else if (variant === 'outlined') padding = outlinedPadding[size];
    else if (variant === 'filled')
        padding = hiddenLabel
            ? small
                ? 'px-3 pt-2 pb-[9px]'
                : 'px-3 pt-4 pb-[17px]'
            : small
              ? 'px-3 pt-[21px] pb-1'
              : 'px-3 pt-[25px] pb-2';
    else padding = small ? 'px-0 pt-px pb-[5px]' : 'px-0 pt-1 pb-[5px]';
    return cn(
        'm-0 box-content! block h-[1.4375em] w-full min-w-0 border-0 bg-none font-[family-name:inherit] text-[length:inherit] leading-[inherit] tracking-[inherit] text-current [-webkit-tap-highlight-color:transparent] focus:outline-0 invalid:shadow-none',
        'placeholder:text-fg-secondary placeholder:opacity-100 placeholder:transition-opacity placeholder:duration-200 placeholder:ease-standard',
        'disabled:opacity-100 disabled:[-webkit-text-fill-color:var(--palette-text-disabled)]',
        '[&::-webkit-search-decoration]:appearance-none',
        variant !== 'standard' &&
            'autofill:rounded-[inherit] dark:autofill:shadow-[0_0_0_100px_#266798_inset] dark:autofill:caret-white dark:autofill:[-webkit-text-fill-color:#fff]',
        padding,
        multiline && 'h-auto resize-y',
        !multiline && adornedStart && variant !== 'standard' && 'pl-0',
        !multiline && adornedEnd && variant !== 'standard' && 'pr-0'
    );
}

export function outlineClasses(
    state: Pick<InputState, 'focused' | 'error' | 'disabled' | 'color'>
): string {
    return cn(
        'pointer-events-none absolute -top-[5px] right-0 bottom-0 left-0 m-0 min-w-[0%] overflow-hidden rounded-[inherit] border border-solid px-2 py-0 text-left',
        state.disabled
            ? 'border-action-disabled'
            : state.error
              ? cn('border-error-main', state.focused && 'border-2')
              : state.focused
                ? cn('border-2', focusedOutlineColors[state.color])
                : 'border-input-border group-hover/outlined:border-fg-secondary'
    );
}

export interface NotchedOutlineProps {
    label?: ReactNode;
    notched: boolean;
    className?: string;
    state: Pick<InputState, 'focused' | 'error' | 'disabled' | 'color'>;
}

export function NotchedOutline({ label, notched, className, state }: NotchedOutlineProps) {
    const withLabel = label != null && label !== '';
    return (
        <fieldset
            aria-hidden
            data-slot="notched-outline"
            className={cn(outlineClasses(state), className)}
        >
            <legend
                className={cn(
                    'float-[unset] w-auto overflow-hidden',
                    withLabel
                        ? cn(
                              'invisible block h-[11px] p-0 text-[0.75em] whitespace-nowrap',
                              notched
                                  ? 'max-w-full transition-[max-width] delay-50 duration-100 ease-decelerate'
                                  : 'max-w-[0.01px] transition-[max-width] duration-50 ease-decelerate'
                          )
                        : 'p-0 leading-[11px] transition-[width] duration-150 ease-decelerate'
                )}
            >
                {withLabel ? (
                    <span className="visible inline-block px-[5px] opacity-0">{label}</span>
                ) : (
                    <span className="notranslate" aria-hidden>
                        {'\u200b'}
                    </span>
                )}
            </legend>
        </fieldset>
    );
}

export const InputField = forwardRef<
    HTMLDivElement,
    InputBaseProps & { notchedLabel?: ReactNode; notched?: boolean; bare?: boolean }
>(function InputField(
    {
        variant: variantProp,
        size: sizeProp,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        onKeyUp,
        placeholder,
        type = 'text',
        name,
        id,
        autoComplete,
        autoFocus,
        disabled: disabledProp,
        readOnly,
        required: requiredProp,
        error: errorProp,
        fullWidth: fullWidthProp,
        multiline = false,
        rows,
        minRows,
        maxRows,
        startAdornment,
        endAdornment,
        disableUnderline = false,
        hiddenLabel: hiddenLabelProp,
        color: colorProp,
        inputRef,
        inputProps,
        inputClassName,
        inputComponent,
        hidePlaceholder = false,
        notchedLabel,
        notched,
        bare = false,
        className,
        onClick,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        ...other
    },
    ref
) {
    const fcs = useFormControl();
    const variant = variantProp ?? fcs?.variant ?? 'standard';
    const size = sizeProp ?? fcs?.size ?? 'medium';
    const disabled = disabledProp ?? fcs?.disabled ?? false;
    const error = errorProp ?? fcs?.error ?? false;
    const required = requiredProp ?? fcs?.required ?? false;
    const fullWidth = fullWidthProp ?? fcs?.fullWidth ?? false;
    const hiddenLabel = hiddenLabelProp ?? fcs?.hiddenLabel ?? false;
    const color = colorProp ?? fcs?.color ?? 'primary';
    const [focusedState, setFocusedState] = useState(false);
    const focused = fcs ? fcs.focused : focusedState && !disabled;
    const elementRef = useRef<FieldElement | null>(null);
    const handleInputRef = useForkRef<FieldElement>(
        elementRef,
        inputRef,
        (inputProps as { ref?: Ref<FieldElement> } | undefined)?.ref
    );
    const [uncontrolledFilled, setUncontrolledFilled] = useState(isFilledValue(defaultValue));
    const slotValue = (inputProps as { value?: unknown } | undefined)?.value;
    const controlled = value !== undefined || slotValue !== undefined;
    const filled = controlled
        ? isFilledValue(value !== undefined ? value : slotValue)
        : uncontrolledFilled;
    const adornedStart = Boolean(startAdornment);
    const setFcFilled = fcs?.setFilled;
    const setFcAdornedStart = fcs?.setAdornedStart;
    const setFcFocused = fcs?.setFocused;

    useLayoutEffect(() => {
        if (!autoFocus) return;
        const input = elementRef.current;
        if (!input) return;
        const doc = input.ownerDocument;
        const active = doc.activeElement;
        if (input === active) {
            (setFcFocused ?? setFocusedState)(true);
        } else if (active == null || active === doc.body || active === doc.documentElement) {
            input.focus();
        }
    }, [autoFocus, setFcFocused]);

    useEffect(() => {
        setFcFilled?.(filled);
    }, [filled, setFcFilled]);

    useEffect(() => {
        setFcAdornedStart?.(adornedStart);
    }, [adornedStart, setFcAdornedStart]);

    const state: InputState = {
        variant,
        size,
        focused,
        error,
        disabled,
        multiline,
        fullWidth,
        adornedStart,
        adornedEnd: Boolean(endAdornment),
        disableUnderline: disableUnderline || bare,
        hiddenLabel,
        formControl: Boolean(fcs) && !bare,
        color,
        select: Boolean(inputComponent),
    };

    const handleFocus = (event: FocusEvent<FieldElement>) => {
        if (disabled) {
            event.stopPropagation();
            return;
        }
        onFocus?.(event);
        if (fcs) fcs.setFocused(true);
        else setFocusedState(true);
    };

    const handleBlur = (event: FocusEvent<FieldElement>) => {
        onBlur?.(event);
        if (fcs) fcs.setFocused(false);
        else setFocusedState(false);
    };

    const handleChange = (event: ChangeEvent<FieldElement>) => {
        if (!controlled) setUncontrolledFilled(isFilledValue(event.target.value));
        onChange?.(event);
    };

    const {
        onChange: inputOnChange,
        onFocus: inputOnFocus,
        onBlur: inputOnBlur,
        onKeyDown: inputOnKeyDown,
        ref: _inputPropsRef,
        className: inputPropsClassName,
        ...restInputProps
    } = (inputProps ?? {}) as {
        onChange?: (event: ChangeEvent<FieldElement>) => void;
        onFocus?: (event: FocusEvent<FieldElement>) => void;
        onBlur?: (event: FocusEvent<FieldElement>) => void;
        onKeyDown?: (event: KeyboardEvent<FieldElement>) => void;
        ref?: Ref<FieldElement>;
        className?: string;
        [key: string]: unknown;
    };

    const fieldProps = {
        ref: handleInputRef,
        'data-slot': 'input',
        id,
        name,
        value: value as string | undefined,
        defaultValue: defaultValue as string | undefined,
        placeholder,
        autoComplete,
        autoFocus,
        disabled,
        readOnly,
        required,
        'aria-invalid': errorProp ?? fcs?.error,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        onChange: (event: ChangeEvent<FieldElement>) => {
            inputOnChange?.(event);
            handleChange(event);
        },
        onFocus: (event: FocusEvent<FieldElement>) => {
            inputOnFocus?.(event);
            handleFocus(event);
        },
        onBlur: (event: FocusEvent<FieldElement>) => {
            inputOnBlur?.(event);
            handleBlur(event);
        },
        onKeyDown: (event: KeyboardEvent<FieldElement>) => {
            inputOnKeyDown?.(event);
            onKeyDown?.(event);
        },
        onKeyUp,
        ...restInputProps,
        className: cn(
            inputElementClasses(state),
            hidePlaceholder && 'placeholder:opacity-0! focus:placeholder:opacity-100!',
            type === 'search' && '[-moz-appearance:textfield]',
            inputClassName,
            inputPropsClassName
        ),
    };

    let field: ReactNode;
    if (inputComponent) {
        const Component = inputComponent;
        field = <Component {...fieldProps} type={type} />;
    } else if (multiline) {
        field =
            rows !== undefined && minRows === undefined && maxRows === undefined ? (
                <textarea {...fieldProps} rows={Number(rows)} />
            ) : (
                <TextareaAutosize
                    {...fieldProps}
                    minRows={
                        rows !== undefined
                            ? Number(rows)
                            : minRows !== undefined
                              ? Number(minRows)
                              : undefined
                    }
                    maxRows={maxRows !== undefined ? Number(maxRows) : undefined}
                />
            );
    } else {
        field = <input {...fieldProps} type={type} />;
    }

    return (
        <div
            ref={ref}
            data-slot="input-root"
            data-variant={bare ? 'base' : variant}
            data-size={size}
            data-focused={focused ? '' : undefined}
            data-error={error ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className={cn(inputRootClasses(state), className)}
            onClick={event => {
                if (elementRef.current && event.currentTarget === event.target)
                    elementRef.current.focus();
                onClick?.(event);
            }}
            {...other}
        >
            {startAdornment}
            {field}
            {endAdornment}
            {variant === 'outlined' ? (
                <NotchedOutline
                    label={notchedLabel}
                    notched={notched ?? (focused || filled || adornedStart)}
                    state={{ focused, error, disabled, color }}
                />
            ) : null}
        </div>
    );
});

export const InputBase = forwardRef<HTMLDivElement, Omit<InputBaseProps, 'variant'>>(
    function InputBase(props, ref) {
        return <InputField ref={ref} variant="standard" bare {...props} />;
    }
);

export const Input = forwardRef<HTMLDivElement, InputBaseProps>(function Input(props, ref) {
    return <InputField ref={ref} variant="standard" {...props} />;
});

export const OutlinedInput = forwardRef<
    HTMLDivElement,
    InputBaseProps & { label?: ReactNode; notched?: boolean }
>(function OutlinedInput({ label, notched, ...props }, ref) {
    return (
        <InputField
            ref={ref}
            variant="outlined"
            notchedLabel={label}
            notched={notched}
            {...props}
        />
    );
});

export const FilledInput = forwardRef<HTMLDivElement, InputBaseProps>(
    function FilledInput(props, ref) {
        return <InputField ref={ref} variant="filled" {...props} />;
    }
);
