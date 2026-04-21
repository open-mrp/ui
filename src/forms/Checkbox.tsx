'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    size?: 'sm' | 'md';
    label?: React.ReactNode;
    helperText?: string;
    error?: boolean;
    wrapperClassName?: string;
};

function Checkbox({
    size = 'md',
    label,
    helperText,
    error = false,
    className,
    wrapperClassName,
    id,
    disabled,
    ...props
}: CheckboxProps) {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const control = (
        <CheckboxPrimitive.Root
            id={inputId}
            disabled={disabled}
            className={cn(
                'peer shrink-0 rounded border-2 transition-colors flex items-center justify-center',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
                size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
                error
                    ? 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] data-[state=indeterminate]:bg-[var(--primary)] data-[state=indeterminate]:border-[var(--primary)]',
                disabled && 'opacity-50 cursor-not-allowed',
                !disabled && 'cursor-pointer',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
                {props.checked === 'indeterminate' ? (
                    <Minus className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
                ) : (
                    <Check className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={3} />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );

    if (!label && !helperText) {
        return <div className={cn('inline-flex', wrapperClassName)}>{control}</div>;
    }

    return (
        <div className={cn('flex flex-col gap-1', wrapperClassName)}>
            <label
                htmlFor={inputId}
                className={cn(
                    'inline-flex items-start gap-2',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                )}
            >
                {control}
                {label && (
                    <span
                        className={cn(
                            'text-sm leading-tight pt-0.5 select-none',
                            error
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-700 dark:text-gray-300',
                            disabled && 'opacity-60',
                        )}
                    >
                        {label}
                    </span>
                )}
            </label>
            {helperText && (
                <p
                    className={cn(
                        'ml-6 text-xs',
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

export { Checkbox };
