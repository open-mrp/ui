import {
    forwardRef,
    useId,
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
    type ReactNode,
    type Ref,
} from 'react';
import { cn } from '@/utils/cn';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    useFormControl,
    type FormControlProps,
    type InputSize,
    type InputVariant,
} from './FormControl';
import { InputField, type InputBaseProps } from './InputBase';
import { Select, type SelectProps } from './Select';

export interface TextFieldSlotProps {
    input?: Partial<
        Pick<
            InputBaseProps,
            | 'startAdornment'
            | 'endAdornment'
            | 'readOnly'
            | 'disableUnderline'
            | 'inputComponent'
            | 'inputProps'
            | 'className'
            | 'style'
        >
    > & { [key: string]: unknown };
    htmlInput?: Record<string, unknown> & { className?: string };
    inputLabel?: { shrink?: boolean; className?: string; htmlFor?: string; id?: string };
    formHelperText?: { className?: string; id?: string };
    select?: Partial<Omit<SelectProps, 'value' | 'onChange' | 'children'>>;
}

export interface TextFieldProps extends Omit<
    FormControlProps,
    'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onKeyUp' | 'defaultValue' | 'children'
> {
    variant?: InputVariant;
    size?: InputSize;
    label?: ReactNode;
    helperText?: ReactNode;
    value?: unknown;
    defaultValue?: unknown;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    multiline?: boolean;
    rows?: number | string;
    minRows?: number | string;
    maxRows?: number | string;
    select?: boolean;
    children?: ReactNode;
    inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
    slotProps?: TextFieldSlotProps;
    inputClassName?: string;
    inputRootClassName?: string;
    labelClassName?: string;
    helperTextClassName?: string;
}

function LabelSlot({
    label,
    shrink,
    htmlFor,
    id,
    className,
    asDiv,
}: {
    label: ReactNode;
    shrink?: boolean;
    htmlFor?: string;
    id?: string;
    className?: string;
    asDiv?: boolean;
}) {
    return (
        <InputLabel
            htmlFor={asDiv ? undefined : htmlFor}
            id={id}
            shrink={shrink}
            className={className}
            component={asDiv ? 'div' : undefined}
        >
            {label}
        </InputLabel>
    );
}

function useShrink(shrinkProp: boolean | undefined): boolean {
    const fcs = useFormControl();
    return shrinkProp ?? (fcs ? fcs.focused || fcs.filled || fcs.adornedStart : false);
}

function TextFieldInner({
    id,
    variant,
    label,
    required,
    helperText,
    helperTextId,
    inputLabelId,
    select,
    children,
    slotProps,
    labelClassName,
    helperTextClassName,
    inputClassName,
    inputRootClassName,
    fieldProps,
}: {
    id: string;
    variant: InputVariant;
    label?: ReactNode;
    required: boolean;
    helperText?: ReactNode;
    helperTextId?: string;
    inputLabelId?: string;
    select: boolean;
    children?: ReactNode;
    slotProps?: TextFieldSlotProps;
    labelClassName?: string;
    helperTextClassName?: string;
    inputClassName?: string;
    inputRootClassName?: string;
    fieldProps: Record<string, unknown>;
}) {
    const shrink = useShrink(slotProps?.inputLabel?.shrink);
    const inputSlot = slotProps?.input ?? {};
    const {
        className: inputSlotClassName,
        inputProps: inputSlotInputProps,
        ...inputSlotRest
    } = inputSlot;
    const { className: htmlInputClassName, ...htmlInputRest } = slotProps?.htmlInput ?? {};
    const notchedLabel =
        variant === 'outlined' && label != null && label !== '' ? (
            <>
                {label}
                {required ? '\u2009' : null}
                {required ? '*' : null}
            </>
        ) : undefined;
    const sharedInput = {
        ...fieldProps,
        ...inputSlotRest,
        id,
        variant,
        notchedLabel,
        notched: variant === 'outlined' ? shrink : undefined,
        hidePlaceholder: Boolean(label) && !shrink,
        'aria-describedby': helperTextId,
        className: cn(inputSlotClassName, inputRootClassName),
        inputClassName: cn(htmlInputClassName as string | undefined, inputClassName),
        inputProps: {
            ...(inputSlotInputProps as Record<string, unknown> | undefined),
            ...htmlInputRest,
        },
    };
    return (
        <>
            {label != null && label !== '' ? (
                <LabelSlot
                    label={label}
                    shrink={shrink}
                    htmlFor={id}
                    id={inputLabelId}
                    asDiv={select}
                    className={cn(slotProps?.inputLabel?.className, labelClassName)}
                />
            ) : null}
            {select ? (
                <Select
                    {...(sharedInput as Record<string, unknown>)}
                    {...slotProps?.select}
                    labelId={inputLabelId}
                    label={label}
                    notched={variant === 'outlined' ? shrink : undefined}
                >
                    {children}
                </Select>
            ) : (
                <InputField {...(sharedInput as Record<string, unknown>)} />
            )}
            {helperText ? (
                <FormHelperText
                    id={helperTextId}
                    className={cn(slotProps?.formHelperText?.className, helperTextClassName)}
                >
                    {helperText}
                </FormHelperText>
            ) : null}
        </>
    );
}

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
    {
        variant = 'outlined',
        size = 'medium',
        label,
        helperText,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        onKeyUp,
        placeholder,
        type,
        name,
        autoComplete,
        autoFocus,
        multiline,
        rows,
        minRows,
        maxRows,
        select = false,
        children,
        inputRef,
        slotProps,
        inputClassName,
        inputRootClassName,
        labelClassName,
        helperTextClassName,
        id: idProp,
        required = false,
        error = false,
        disabled = false,
        fullWidth = false,
        color = 'primary',
        ...other
    },
    ref
) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const helperTextId = helperText ? `${id}-helper-text` : undefined;
    const inputLabelId = label ? `${id}-label` : undefined;
    return (
        <FormControl
            ref={ref}
            variant={variant}
            size={size}
            required={required}
            error={error}
            disabled={disabled}
            fullWidth={fullWidth}
            color={color}
            {...other}
        >
            <TextFieldInner
                id={id}
                variant={variant}
                label={label}
                required={required}
                helperText={helperText}
                helperTextId={helperTextId}
                inputLabelId={inputLabelId}
                select={select}
                slotProps={slotProps}
                labelClassName={labelClassName}
                helperTextClassName={helperTextClassName}
                inputClassName={inputClassName}
                inputRootClassName={inputRootClassName}
                fieldProps={{
                    value,
                    defaultValue,
                    onChange,
                    onFocus,
                    onBlur,
                    onKeyDown,
                    onKeyUp,
                    placeholder,
                    type,
                    name,
                    autoComplete,
                    autoFocus,
                    multiline,
                    rows,
                    minRows,
                    maxRows,
                    inputRef,
                    fullWidth,
                }}
            >
                {children}
            </TextFieldInner>
        </FormControl>
    );
});
