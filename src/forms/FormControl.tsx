'use client';

import {
    createContext,
    forwardRef,
    useContext,
    useMemo,
    useState,
    type ComponentPropsWithoutRef,
    type ElementType,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '@/typography/Typography';

export type InputVariant = 'standard' | 'outlined' | 'filled';
export type InputSize = 'compact' | 'small' | 'medium';

export interface FormControlState {
    variant: InputVariant;
    size: InputSize;
    focused: boolean;
    filled: boolean;
    error: boolean;
    disabled: boolean;
    required: boolean;
    fullWidth: boolean;
    adornedStart: boolean;
    hiddenLabel: boolean;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    setFocused: (focused: boolean) => void;
    setFilled: (filled: boolean) => void;
    setAdornedStart: (adorned: boolean) => void;
}

const FormControlContext = createContext<FormControlState | null>(null);

export function useFormControl(): FormControlState | null {
    return useContext(FormControlContext);
}

export interface FormControlProps extends ComponentPropsWithoutRef<'div'> {
    variant?: InputVariant;
    size?: InputSize;
    margin?: 'none' | 'dense' | 'normal';
    error?: boolean;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    focused?: boolean;
    hiddenLabel?: boolean;
    color?: FormControlState['color'];
    component?: ElementType;
}

export const formControlMarginClasses = {
    none: '',
    dense: 'mt-2 mb-1',
    normal: 'mt-4 mb-2',
};

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
    {
        variant = 'outlined',
        size = 'medium',
        margin = 'none',
        error = false,
        disabled = false,
        required = false,
        fullWidth = false,
        focused: focusedProp,
        hiddenLabel = false,
        color = 'primary',
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const [focusedState, setFocused] = useState(false);
    const [filled, setFilled] = useState(false);
    const [adornedStart, setAdornedStart] = useState(false);
    const focused = focusedProp ?? (focusedState && !disabled);
    const value = useMemo<FormControlState>(
        () => ({
            variant,
            size,
            focused,
            filled,
            error,
            disabled,
            required,
            fullWidth,
            adornedStart,
            hiddenLabel,
            color,
            setFocused,
            setFilled,
            setAdornedStart,
        }),
        [
            variant,
            size,
            focused,
            filled,
            error,
            disabled,
            required,
            fullWidth,
            adornedStart,
            hiddenLabel,
            color,
        ]
    );
    const Component = component ?? 'div';
    return (
        <FormControlContext.Provider value={value}>
            <Component
                ref={ref}
                data-slot="form-control"
                className={cn(
                    'relative m-0 inline-flex min-w-0 flex-col border-0 p-0 align-top',
                    formControlMarginClasses[margin],
                    fullWidth && 'w-full',
                    className
                )}
                {...other}
            >
                {children as ReactNode}
            </Component>
        </FormControlContext.Provider>
    );
});

export interface FormLabelProps extends ComponentPropsWithoutRef<'label'> {
    error?: boolean;
    disabled?: boolean;
    focused?: boolean;
    required?: boolean;
    filled?: boolean;
    color?: FormControlState['color'];
    component?: ElementType;
}

const focusedLabelColors: Record<FormControlState['color'], string> = {
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    error: 'text-error-main',
    warning: 'text-warning-main',
    info: 'text-info-main',
    success: 'text-success-main',
};

export function formLabelStateClasses(state: {
    focused: boolean;
    error: boolean;
    disabled: boolean;
    color: FormControlState['color'];
}): string {
    if (state.disabled) return 'text-fg-disabled';
    if (state.error) return 'text-error-main';
    if (state.focused) return focusedLabelColors[state.color];
    return 'text-fg-secondary';
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(function FormLabel(
    {
        error,
        disabled,
        focused,
        required,
        filled: _filled,
        color,
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const fcs = useFormControl();
    const state = {
        error: error ?? fcs?.error ?? false,
        disabled: disabled ?? fcs?.disabled ?? false,
        focused: focused ?? fcs?.focused ?? false,
        required: required ?? fcs?.required ?? false,
        color: color ?? fcs?.color ?? 'primary',
    };
    const Component = component ?? 'label';
    return (
        <Component
            ref={ref}
            className={cn(
                'relative p-0 font-plex-sans text-[1rem] font-normal leading-[1.4375em]',
                formLabelStateClasses(state),
                className
            )}
            {...other}
        >
            {children}
            {state.required ? (
                <span aria-hidden className={cn(state.error && 'text-error-main')}>
                    {'\u2009'}
                    {'*'}
                </span>
            ) : null}
        </Component>
    );
});

export interface InputLabelProps extends FormLabelProps {
    shrink?: boolean;
    variant?: InputVariant;
    size?: InputSize;
    disableAnimation?: boolean;
}

export function inputLabelClasses({
    variant,
    size,
    shrink,
    formControl,
    animated,
}: {
    variant: InputVariant;
    size: InputSize;
    shrink: boolean;
    formControl: boolean;
    animated: boolean;
}): string {
    const small = size !== 'medium';
    let transform = '';
    if (variant === 'outlined') {
        transform = shrink
            ? cn(
                  'select-none pointer-events-auto max-w-[calc(133%-32px)]',
                  small
                      ? '[transform:translate(14px,-7.5px)_scale(0.75)]'
                      : '[transform:translate(14px,-9px)_scale(0.75)]'
              )
            : cn(
                  'pointer-events-none max-w-[calc(100%-24px)]',
                  size === 'compact'
                      ? '[transform:translate(14px,6px)_scale(1)]'
                      : small
                        ? '[transform:translate(14px,10px)_scale(1)]'
                        : '[transform:translate(14px,16px)_scale(1)]'
              );
    } else if (variant === 'filled') {
        transform = shrink
            ? cn(
                  'select-none pointer-events-auto max-w-[calc(133%-24px)]',
                  small
                      ? '[transform:translate(12px,4px)_scale(0.75)]'
                      : '[transform:translate(12px,7px)_scale(0.75)]'
              )
            : cn(
                  'pointer-events-none max-w-[calc(100%-24px)]',
                  small
                      ? '[transform:translate(12px,13px)_scale(1)]'
                      : '[transform:translate(12px,16px)_scale(1)]'
              );
    } else if (shrink) {
        transform = 'max-w-[133%] [transform:translate(0,-1.5px)_scale(0.75)]';
    } else if (formControl) {
        transform = small
            ? '[transform:translate(0,17px)_scale(1)]'
            : '[transform:translate(0,20px)_scale(1)]';
    }
    return cn(
        'block max-w-full origin-top-left overflow-hidden text-ellipsis whitespace-nowrap',
        formControl && 'absolute top-0 left-0',
        variant !== 'standard' && 'z-[1]',
        animated && 'transition-[color,transform,max-width] duration-200 ease-decelerate',
        variant === 'outlined' && small && 'text-[0.875rem]',
        transform
    );
}

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(function InputLabel(
    {
        shrink: shrinkProp,
        variant: variantProp,
        size: sizeProp,
        disableAnimation = false,
        className,
        ...other
    },
    ref
) {
    const fcs = useFormControl();
    const shrink = shrinkProp ?? (fcs ? fcs.focused || fcs.filled || fcs.adornedStart : false);
    const variant = variantProp ?? fcs?.variant ?? 'outlined';
    const size = sizeProp ?? fcs?.size ?? 'medium';
    return (
        <FormLabel
            ref={ref}
            data-slot="input-label"
            data-shrink={shrink}
            className={cn(
                inputLabelClasses({
                    variant,
                    size,
                    shrink,
                    formControl: Boolean(fcs),
                    animated: !disableAnimation,
                }),
                className
            )}
            {...other}
        />
    );
});

export interface FormHelperTextProps extends ComponentPropsWithoutRef<'p'> {
    error?: boolean;
    disabled?: boolean;
    variant?: InputVariant;
    size?: InputSize;
    component?: ElementType;
}

export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(
    function FormHelperText(
        {
            error,
            disabled,
            variant: variantProp,
            size: sizeProp,
            component,
            className,
            children,
            ...other
        },
        ref
    ) {
        const fcs = useFormControl();
        const isError = error ?? fcs?.error ?? false;
        const isDisabled = disabled ?? fcs?.disabled ?? false;
        const variant = variantProp ?? fcs?.variant;
        const size = sizeProp ?? fcs?.size;
        const Component = component ?? 'p';
        return (
            <Component
                ref={ref}
                className={cn(
                    'mx-0 mt-[3px] mb-0 text-left font-plex-mono text-[0.75rem] font-normal leading-[1.66] text-fg-secondary',
                    size !== undefined && size !== 'medium' && 'mt-1',
                    (variant === 'outlined' || variant === 'filled') && 'mx-3.5',
                    isError && 'text-error-main',
                    isDisabled && 'text-fg-disabled',
                    className
                )}
                {...other}
            >
                {children === ' ' ? (
                    <span className="notranslate" aria-hidden>
                        {'\u200b'}
                    </span>
                ) : (
                    children
                )}
            </Component>
        );
    }
);

export interface InputAdornmentProps extends ComponentPropsWithoutRef<'div'> {
    position: 'start' | 'end';
    disablePointerEvents?: boolean;
    disableTypography?: boolean;
    variant?: InputVariant;
}

export const InputAdornment = forwardRef<HTMLDivElement, InputAdornmentProps>(
    function InputAdornment(
        {
            position,
            disablePointerEvents = false,
            disableTypography = false,
            variant: variantProp,
            className,
            children,
            ...other
        },
        ref
    ) {
        const fcs = useFormControl();
        const variant = variantProp ?? fcs?.variant;
        return (
            <div
                ref={ref}
                className={cn(
                    'flex max-h-[2em] items-center whitespace-nowrap text-action-active',
                    position === 'start' ? 'mr-2' : 'ml-2',
                    variant === 'filled' && position === 'start' && !fcs?.hiddenLabel && 'mt-4',
                    disablePointerEvents && 'pointer-events-none',
                    className
                )}
                {...other}
            >
                {typeof children === 'string' && !disableTypography ? (
                    <Typography color="textSecondary">{children}</Typography>
                ) : (
                    <>
                        {position === 'start' && variant !== 'standard' && variant !== undefined ? (
                            <span className="notranslate" aria-hidden>
                                {'\u200b'}
                            </span>
                        ) : null}
                        {children}
                    </>
                )}
            </div>
        );
    }
);
