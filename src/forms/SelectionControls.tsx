import {
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useContext,
    useId,
    useState,
    type ChangeEvent,
    type ComponentPropsWithoutRef,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';
import { cn } from '@/utils/cn';
import { Check, Minus } from 'lucide-react';
import type { SvgIconProps } from '@/icons/SvgIcon';
import { useFormControl } from './FormControl';
import { Typography } from '@/typography/Typography';
import type { PaletteColorName } from '@/theme/types';

export type ControlColor = PaletteColorName | 'default';

const hoverColors: Record<ControlColor, string> = {
    default: 'hover:bg-action-active/4',
    primary: 'hover:bg-primary-main/4',
    secondary: 'hover:bg-secondary-main/4',
    error: 'hover:bg-error-main/4',
    warning: 'hover:bg-warning-main/4',
    info: 'hover:bg-info-main/4',
    success: 'hover:bg-success-main/4',
};

const filledBoxColors: Record<ControlColor, string> = {
    default: 'border-fg-secondary bg-fg-secondary text-paper',
    primary: 'border-primary-main bg-primary-main text-primary-contrast',
    secondary: 'border-secondary-main bg-secondary-main text-secondary-contrast',
    error: 'border-error-main bg-error-main text-error-contrast',
    warning: 'border-warning-main bg-warning-main text-warning-contrast',
    info: 'border-info-main bg-info-main text-info-contrast',
    success: 'border-success-main bg-success-main text-success-contrast',
};

const ringColors: Record<ControlColor, string> = {
    default: 'border-fg-secondary',
    primary: 'border-primary-main',
    secondary: 'border-secondary-main',
    error: 'border-error-main',
    warning: 'border-warning-main',
    info: 'border-info-main',
    success: 'border-success-main',
};

const dotColors: Record<ControlColor, string> = {
    default: 'bg-fg-secondary',
    primary: 'bg-primary-main',
    secondary: 'bg-secondary-main',
    error: 'bg-error-main',
    warning: 'bg-warning-main',
    info: 'bg-info-main',
    success: 'bg-success-main',
};

const controlSizes = {
    small: { box: 'h-4 w-4', glyph: 'h-3 w-3', dot: 'h-2 w-2' },
    medium: { box: 'h-[18px] w-[18px]', glyph: 'h-3 w-3', dot: 'h-2 w-2' },
    large: { box: 'h-[22px] w-[22px]', glyph: 'h-3.5 w-3.5', dot: 'h-2.5 w-2.5' },
};

const focusRing =
    'group-has-[input:focus-visible]/control:ring-2 group-has-[input:focus-visible]/control:ring-primary-main/40 group-has-[input:focus-visible]/control:ring-offset-1 group-has-[input:focus-visible]/control:ring-offset-paper';

const emptyBoxClasses = 'border-fg-secondary/60 group-hover/control:border-fg-secondary';

const switchBaseRootClasses =
    'group/control relative box-border inline-flex items-center justify-center bg-transparent outline-0 border-0 m-0 cursor-pointer select-none align-middle appearance-none no-underline [-webkit-tap-highlight-color:transparent] p-[9px] rounded-full';

const hiddenInputClasses =
    'absolute top-0 left-0 z-[1] m-0 h-full w-full cursor-[inherit] p-0 opacity-0';

interface SwitchBaseInputProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    disabled?: boolean;
    name?: string;
    value?: unknown;
    id?: string;
    required?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    inputRef?: Ref<HTMLInputElement>;
    inputProps?: ComponentPropsWithoutRef<'input'> & { [key: `data-${string}`]: unknown };
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

function useCheckedState(checked: boolean | undefined, defaultChecked: boolean | undefined) {
    const [state, setState] = useState(Boolean(defaultChecked));
    const controlled = checked !== undefined;
    return [
        controlled ? Boolean(checked) : state,
        (next: boolean) => !controlled && setState(next),
    ] as const;
}

export interface CheckboxProps
    extends
        SwitchBaseInputProps,
        Omit<ComponentPropsWithoutRef<'span'>, 'onChange' | 'defaultChecked' | 'color'> {
    color?: ControlColor;
    size?: 'small' | 'medium' | 'large';
    indeterminate?: boolean;
    icon?: ReactElement<SvgIconProps>;
    checkedIcon?: ReactElement<SvgIconProps>;
    indeterminateIcon?: ReactElement<SvgIconProps>;
    disableRipple?: boolean;
    edge?: 'start' | 'end' | false;
}

function edgeClasses(edge: 'start' | 'end' | false | undefined, size: string): string {
    if (edge === 'start') return size === 'small' ? '-ml-[3px]' : '-ml-3';
    if (edge === 'end') return size === 'small' ? '-mr-[3px]' : '-mr-3';
    return '';
}

export const Checkbox = forwardRef<HTMLSpanElement, CheckboxProps>(function Checkbox(
    {
        checked: checkedProp,
        defaultChecked,
        onChange,
        disabled: disabledProp,
        name,
        value,
        id,
        required,
        readOnly,
        autoFocus,
        tabIndex,
        inputRef,
        inputProps,
        color = 'primary',
        size = 'medium',
        indeterminate = false,
        icon,
        checkedIcon,
        indeterminateIcon,
        disableRipple = false,
        edge = false,
        className,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        ...other
    },
    ref
) {
    const formControl = useFormControl();
    const disabled = disabledProp ?? formControl?.disabled ?? false;
    const [checked, setChecked] = useCheckedState(checkedProp, defaultChecked);
    const active = checked || indeterminate;
    const sizes = controlSizes[size];
    const customIcon = indeterminate ? indeterminateIcon : checked ? checkedIcon : icon;
    const iconNode = customIcon ?? (
        <span
            aria-hidden
            className={cn(
                'flex shrink-0 items-center justify-center rounded-[4px] border-2 border-solid transition-colors duration-150',
                sizes.box,
                active ? filledBoxColors[color] : emptyBoxClasses,
                focusRing
            )}
        >
            {indeterminate ? (
                <Minus className={sizes.glyph} strokeWidth={3} />
            ) : checked ? (
                <Check className={sizes.glyph} strokeWidth={3} />
            ) : null}
        </span>
    );
    return (
        <span
            ref={ref}
            data-checked={checked ? '' : undefined}
            data-indeterminate={indeterminate ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            data-slot="checkbox"
            className={cn(
                switchBaseRootClasses,
                !disableRipple && hoverColors[color],
                disabled && 'pointer-events-none cursor-default opacity-50',
                edgeClasses(edge, size),
                className
            )}
            {...other}
        >
            <input
                ref={inputRef}
                type="checkbox"
                className={hiddenInputClasses}
                checked={checkedProp === undefined ? undefined : checked}
                defaultChecked={checkedProp === undefined ? defaultChecked : undefined}
                onChange={event => {
                    if (event.nativeEvent.defaultPrevented) return;
                    setChecked(event.target.checked);
                    onChange?.(event, event.target.checked);
                }}
                disabled={disabled}
                name={name}
                value={value as string | undefined}
                id={id}
                required={required}
                readOnly={readOnly}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-checked={indeterminate ? 'mixed' : undefined}
                data-indeterminate={indeterminate}
                {...inputProps}
            />
            {iconNode}
        </span>
    );
});

interface RadioGroupContextValue {
    name?: string;
    value?: unknown;
    onChange: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'onChange' | 'defaultValue'
> {
    name?: string;
    value?: unknown;
    defaultValue?: unknown;
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    row?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
    {
        name: nameProp,
        value: valueProp,
        defaultValue,
        onChange,
        row = false,
        className,
        children,
        ...other
    },
    ref
) {
    const generatedName = useId();
    const name = nameProp ?? generatedName;
    const [uncontrolled, setUncontrolled] = useState<unknown>(defaultValue);
    const value = valueProp !== undefined ? valueProp : uncontrolled;
    return (
        <RadioGroupContext.Provider
            value={{
                name,
                value,
                onChange: (event, next) => {
                    if (valueProp === undefined) setUncontrolled(next);
                    onChange?.(event, next);
                },
            }}
        >
            <div
                ref={ref}
                role="radiogroup"
                className={cn('flex flex-col flex-wrap', row && 'flex-row', className)}
                {...other}
            >
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
});

export function FormGroup({
    row = false,
    className,
    ...other
}: ComponentPropsWithoutRef<'div'> & { row?: boolean }) {
    return (
        <div className={cn('flex flex-col flex-wrap', row && 'flex-row', className)} {...other} />
    );
}

export interface RadioProps extends Omit<CheckboxProps, 'indeterminate' | 'indeterminateIcon'> {}

export const Radio = forwardRef<HTMLSpanElement, RadioProps>(function Radio(
    {
        checked: checkedProp,
        onChange,
        disabled: disabledProp,
        name: nameProp,
        value,
        id,
        required,
        autoFocus,
        tabIndex,
        inputRef,
        inputProps,
        color = 'primary',
        size = 'medium',
        disableRipple = false,
        edge = false,
        className,
        icon,
        checkedIcon,
        'aria-label': ariaLabel,
        ...other
    },
    ref
) {
    const formControl = useFormControl();
    const disabled = disabledProp ?? formControl?.disabled ?? false;
    const group = useContext(RadioGroupContext);
    const checked =
        checkedProp !== undefined
            ? checkedProp
            : group
              ? group.value !== undefined &&
                group.value !== null &&
                String(group.value) === String(value)
              : false;
    const name = nameProp ?? group?.name;
    const sizes = controlSizes[size];
    return (
        <span
            ref={ref}
            data-slot="radio"
            data-checked={checked ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className={cn(
                switchBaseRootClasses,
                !disableRipple && hoverColors[color],
                disabled && 'pointer-events-none cursor-default opacity-50',
                edgeClasses(edge, size),
                className
            )}
            {...other}
        >
            <input
                ref={inputRef}
                type="radio"
                className={hiddenInputClasses}
                checked={checked}
                onChange={event => {
                    onChange?.(event, event.target.checked);
                    group?.onChange(event, event.target.value);
                }}
                disabled={disabled}
                name={name}
                value={value as string | undefined}
                id={id}
                required={required}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                {...inputProps}
            />
            {checked && checkedIcon ? (
                checkedIcon
            ) : !checked && icon ? (
                icon
            ) : (
                <span
                    aria-hidden
                    className={cn(
                        'flex shrink-0 items-center justify-center rounded-full border-2 border-solid transition-colors duration-150',
                        sizes.box,
                        checked ? ringColors[color] : emptyBoxClasses,
                        focusRing
                    )}
                >
                    <span
                        className={cn(
                            'rounded-full transition-transform duration-150',
                            sizes.dot,
                            dotColors[color],
                            checked ? 'scale-100' : 'scale-0'
                        )}
                    />
                </span>
            )}
        </span>
    );
});

export interface SwitchProps
    extends
        SwitchBaseInputProps,
        Omit<ComponentPropsWithoutRef<'span'>, 'onChange' | 'defaultChecked' | 'color'> {
    color?: 'primary' | 'warning' | 'default';
    size?: 'small' | 'medium';
    edge?: 'start' | 'end' | false;
    disableRipple?: boolean;
}

const switchTrackColors: Record<NonNullable<SwitchProps['color']>, string> = {
    primary: 'bg-primary-main',
    warning: 'bg-warning-main',
    default: 'bg-fg-secondary',
};

const switchSizes = {
    small: { root: 'p-[5px]', track: 'h-4 w-7', thumb: 'h-3 w-3', shift: 'translate-x-3' },
    medium: { root: 'p-[9px]', track: 'h-5 w-9', thumb: 'h-4 w-4', shift: 'translate-x-4' },
};

export const Switch = forwardRef<HTMLSpanElement, SwitchProps>(function Switch(
    {
        checked: checkedProp,
        defaultChecked,
        onChange,
        disabled: disabledProp,
        name,
        value,
        id,
        required,
        readOnly,
        autoFocus,
        tabIndex,
        inputRef,
        inputProps,
        color = 'primary',
        size = 'medium',
        edge = false,
        disableRipple: _disableRipple,
        className,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        ...other
    },
    ref
) {
    const formControl = useFormControl();
    const disabled = disabledProp ?? formControl?.disabled ?? false;
    const [checked, setChecked] = useCheckedState(checkedProp, defaultChecked);
    const sizes = switchSizes[size];
    return (
        <span
            ref={ref}
            data-slot="switch"
            data-checked={checked ? '' : undefined}
            data-disabled={disabled ? '' : undefined}
            className={cn(
                'group/control relative box-border inline-flex shrink-0 cursor-pointer align-middle print:[color-adjust:exact]',
                sizes.root,
                edge === 'start' && '-ml-2',
                edge === 'end' && '-mr-2',
                disabled && 'pointer-events-none cursor-default opacity-50',
                className
            )}
            {...other}
        >
            <input
                ref={inputRef}
                type="checkbox"
                role="switch"
                className={hiddenInputClasses}
                checked={checkedProp === undefined ? undefined : checked}
                defaultChecked={checkedProp === undefined ? defaultChecked : undefined}
                onChange={event => {
                    setChecked(event.target.checked);
                    onChange?.(event, event.target.checked);
                }}
                disabled={disabled}
                name={name}
                value={value as string | undefined}
                id={id}
                required={required}
                readOnly={readOnly}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                {...inputProps}
            />
            <span
                aria-hidden
                className={cn(
                    'relative inline-flex shrink-0 items-center rounded-full border-2 border-solid border-transparent transition-colors duration-200',
                    sizes.track,
                    checked ? switchTrackColors[color] : 'bg-switch-track',
                    focusRing
                )}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-block rounded-full bg-white shadow transition-transform duration-200',
                        sizes.thumb,
                        checked ? sizes.shift : 'translate-x-0'
                    )}
                />
            </span>
        </span>
    );
});

export interface FormControlLabelProps extends Omit<ComponentPropsWithoutRef<'label'>, 'onChange'> {
    control: ReactElement<{
        disabled?: boolean;
        required?: boolean;
        checked?: boolean;
        value?: unknown;
        name?: string;
        onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
        inputRef?: Ref<HTMLInputElement>;
    }>;
    label: ReactNode;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
    disabled?: boolean;
    value?: unknown;
    checked?: boolean;
    name?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    inputRef?: Ref<HTMLInputElement>;
    required?: boolean;
    disableTypography?: boolean;
    labelClassName?: string;
}

export const FormControlLabel = forwardRef<HTMLLabelElement, FormControlLabelProps>(
    function FormControlLabel(
        {
            control,
            label: labelProp,
            labelPlacement = 'end',
            disabled: disabledProp,
            value,
            checked,
            name,
            onChange,
            inputRef,
            required: requiredProp,
            disableTypography = false,
            labelClassName,
            className,
            ...other
        },
        ref
    ) {
        const formControl = useFormControl();
        const disabled = disabledProp ?? control.props.disabled ?? formControl?.disabled ?? false;
        const required = requiredProp ?? control.props.required;
        const error = formControl?.error ?? false;
        const controlProps: Record<string, unknown> = { disabled, required };
        const forwarded = { checked, name, onChange, value, inputRef };
        for (const key of Object.keys(forwarded) as (keyof typeof forwarded)[]) {
            if (control.props[key] === undefined && forwarded[key] !== undefined)
                controlProps[key] = forwarded[key];
        }
        const label =
            labelProp != null &&
            !(isValidElement(labelProp) && labelProp.type === Typography) &&
            !disableTypography ? (
                <Typography
                    component="span"
                    variant="body2"
                    className={cn(disabled && 'text-fg-disabled', labelClassName)}
                >
                    {labelProp}
                </Typography>
            ) : (
                labelProp
            );
        return (
            <label
                ref={ref}
                className={cn(
                    'inline-flex cursor-pointer items-center align-middle [-webkit-tap-highlight-color:transparent]',
                    labelPlacement === 'end' && '-ml-[11px] mr-4',
                    labelPlacement === 'start' && 'ml-4 -mr-[11px] flex-row-reverse',
                    labelPlacement === 'top' && 'ml-4 flex-col-reverse',
                    labelPlacement === 'bottom' && 'ml-4 flex-col',
                    disabled && 'cursor-default',
                    className
                )}
                {...other}
            >
                {cloneElement(control, controlProps)}
                {required ? (
                    <div>
                        {label}
                        <span aria-hidden className={cn(error && 'text-error-main')}>
                            {'\u2009'}
                            {'*'}
                        </span>
                    </div>
                ) : (
                    label
                )}
            </label>
        );
    }
);
