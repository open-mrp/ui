'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

export type TextareaProps = React.ComponentProps<'textarea'> & {
    ref?: React.Ref<HTMLTextAreaElement>;
    label?: string;
    error?: boolean;
    helperText?: string;
    containerClassName?: string;
};

function Textarea({
    ref,
    label,
    error = false,
    helperText,
    disabled = false,
    className,
    containerClassName,
    rows = 3,
    ...rest
}: TextareaProps) {
    return (
        <div data-slot="textarea" className={cn('relative w-full', containerClassName)}>
            {label && (
                <label
                    className={cn(
                        'mb-1 block text-sm font-medium',
                        error
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-700 dark:text-gray-300',
                    )}
                >
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                disabled={disabled}
                {...rest}
                className={cn(
                    'block w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm',
                    'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
                    'outline-none transition-colors resize-vertical',
                    error
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]'
                        : 'border-gray-300 dark:border-gray-600 focus:border-[var(--primary)] focus:shadow-[0_0_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className,
                )}
            />
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

export { Textarea };
