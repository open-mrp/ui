'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

export type InputVariant = 'outlined' | 'line' | 'plain';

const inputContainerVariants = cva(
    'group relative flex items-center transition-colors',
    {
        variants: {
            variant: {
                outlined: [
                    'rounded-md border',
                    'focus-within:border-[var(--primary)] focus-within:shadow-[0_0_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                ],
                line: 'bg-transparent',
                plain: 'bg-transparent',
            },
            size: {
                sm: 'py-1 text-xs',
                md: 'py-2 text-sm',
                lg: 'py-2.5 text-base',
            },
            blur: {
                true: 'backdrop-blur-md',
                false: '',
            },
            error: {
                true: '',
                false: '',
            },
            disabled: {
                true: 'opacity-50 cursor-default',
                false: '',
            },
        },
        compoundVariants: [
            // outlined + blur
            {
                variant: 'outlined',
                blur: true,
                className: 'bg-white/60 dark:bg-gray-900/60 border-white/30 dark:border-white/15',
            },
            // outlined + no blur + no error
            {
                variant: 'outlined',
                blur: false,
                error: false,
                className:
                    'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600',
            },
            // outlined + no blur + error
            {
                variant: 'outlined',
                blur: false,
                error: true,
                className: 'bg-white dark:bg-gray-900',
            },
            // outlined + error (any blur)
            {
                variant: 'outlined',
                error: true,
                className:
                    'border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]',
            },
        ],
        defaultVariants: {
            variant: 'outlined',
            size: 'md',
            blur: false,
            error: false,
            disabled: false,
        },
    },
);

export type InputProps = Omit<React.ComponentProps<'input'>, 'size' | 'prefix'> & {
    ref?: React.Ref<HTMLInputElement>;
    variant?: InputVariant;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    error?: boolean;
    helperText?: string;
    blur?: boolean;
    clearable?: boolean;
    loading?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    onClear?: () => void;
    containerClassName?: string;
};

function Input({
    ref,
    variant = 'outlined',
    size = 'md',
    label,
    error = false,
    helperText,
    disabled = false,
    blur = false,
    clearable = false,
    loading = false,
    prefix,
    suffix,
    onClear,
    className,
    containerClassName,
    value,
    ...rest
}: InputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div data-slot="input" className={cn('relative w-full', className)}>
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
            <div
                className={cn(
                    inputContainerVariants({
                        variant,
                        size,
                        blur,
                        error,
                        disabled,
                    }),
                    variant !== 'plain' && {
                        sm: 'px-2',
                        md: 'px-3',
                        lg: 'px-4',
                    }[size],
                    containerClassName,
                )}
            >
                {prefix && <span className="mr-2 flex shrink-0 items-center">{prefix}</span>}
                <input
                    ref={inputRef}
                    disabled={disabled}
                    value={value}
                    {...rest}
                    className={cn(
                        'w-full bg-transparent outline-none',
                        blur
                            ? 'text-white placeholder:text-white/40'
                            : 'text-gray-900 placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500',
                        disabled && 'cursor-default',
                    )}
                />
                {loading && (
                    <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-gray-400" />
                )}
                {clearable && hasValue && !loading && (
                    <button
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            onClear?.();
                            inputRef.current?.focus();
                        }}
                        className="ml-2 shrink-0 cursor-pointer rounded-sm p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Clear"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
                {suffix && <span className="ml-2 flex shrink-0 items-center">{suffix}</span>}
            </div>
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

export { Input, inputContainerVariants };
