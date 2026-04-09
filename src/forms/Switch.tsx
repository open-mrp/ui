'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const switchTrackVariants = cva(
    'relative inline-flex shrink-0 rounded-full border-2 border-transparent cursor-pointer transition-colors duration-200 focus-visible:outline-none',
    {
        variants: {
            size: {
                sm: 'h-4 w-7',
                md: 'h-5 w-9',
                lg: 'h-6 w-11',
            },
            disabled: {
                true: 'opacity-50 cursor-default',
                false: '',
            },
        },
        defaultVariants: {
            size: 'md',
            disabled: false,
        },
    },
);

const switchThumbVariants = cva(
    'pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200',
    {
        variants: {
            size: {
                sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
                md: 'h-4 w-4 data-[state=checked]:translate-x-4',
                lg: 'h-5 w-5 data-[state=checked]:translate-x-5',
            },
        },
        defaultVariants: { size: 'md' },
    },
);

export type SwitchProps = {
    ref?: React.Ref<HTMLButtonElement>;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    labelPosition?: 'left' | 'right';
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    blur?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    className?: string;
};

function Switch({
    ref,
    checked,
    defaultChecked,
    onCheckedChange,
    size = 'md',
    label,
    labelPosition = 'right',
    error = false,
    helperText,
    disabled = false,
    blur = false,
    name,
    value,
    required,
    className,
}: SwitchProps) {
    const trackColorClasses = error
        ? cn(
              blur ? 'bg-red-500/30' : 'bg-red-200 dark:bg-red-900/40',
              'data-[state=checked]:bg-red-500',
              'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
              'focus-visible:shadow-[0_0_10px_2px_color-mix(in_srgb,theme(colors.red.500)_30%,transparent)]',
          )
        : cn(
              blur
                  ? 'bg-white/20 data-[state=checked]:bg-white/60'
                  : 'bg-gray-300 dark:bg-gray-600 data-[state=checked]:bg-[var(--primary)]',
              'focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
              'focus-visible:shadow-[0_0_10px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]',
          );

    const switchElement = (
        <SwitchPrimitive.Root
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            name={name}
            value={value}
            required={required}
            className={cn(
                switchTrackVariants({ size, disabled }),
                trackColorClasses,
            )}
        >
            <SwitchPrimitive.Thumb
                className={switchThumbVariants({ size })}
            />
        </SwitchPrimitive.Root>
    );

    return (
        <div data-slot="switch" className={cn('relative', className)}>
            <label
                className={cn(
                    'inline-flex items-center gap-2 cursor-pointer',
                    labelPosition === 'left' && 'flex-row-reverse justify-end',
                    disabled && 'cursor-default',
                )}
            >
                {switchElement}
                {label && (
                    <span
                        className={cn(
                            'text-sm font-medium text-gray-700 dark:text-gray-300',
                            error && 'text-red-600 dark:text-red-400',
                        )}
                    >
                        {label}
                    </span>
                )}
            </label>
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

export { Switch, switchTrackVariants, switchThumbVariants };
