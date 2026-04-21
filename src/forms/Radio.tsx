'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@/utils/cn';

function RadioGroup({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn('flex flex-col gap-2', className)}
            {...props}
        />
    );
}

export type RadioProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    size?: 'sm' | 'md';
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: boolean;
    wrapperClassName?: string;
};

function Radio({
    size = 'md',
    label,
    description,
    error = false,
    className,
    wrapperClassName,
    id,
    disabled,
    ...props
}: RadioProps) {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const control = (
        <RadioGroupPrimitive.Item
            id={inputId}
            disabled={disabled}
            className={cn(
                'shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
                size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
                error
                    ? 'border-red-500 data-[state=checked]:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 data-[state=checked]:border-[var(--primary)]',
                disabled && 'opacity-50 cursor-not-allowed',
                !disabled && 'cursor-pointer',
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                className={cn(
                    'rounded-full block',
                    size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
                    error ? 'bg-red-500' : 'bg-[var(--primary)]',
                )}
            />
        </RadioGroupPrimitive.Item>
    );

    if (!label && !description) {
        return control;
    }

    return (
        <label
            htmlFor={inputId}
            className={cn(
                'inline-flex items-start gap-2',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                wrapperClassName,
            )}
        >
            {control}
            <span className="flex flex-col gap-0.5">
                {label && (
                    <span
                        className={cn(
                            'text-sm leading-tight select-none',
                            error
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-900 dark:text-gray-100 font-medium',
                            disabled && 'opacity-60',
                        )}
                    >
                        {label}
                    </span>
                )}
                {description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
                )}
            </span>
        </label>
    );
}

export { Radio, RadioGroup };
