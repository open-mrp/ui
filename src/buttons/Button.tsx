import type { ComponentSize } from '@/types/ComponentSize';
import { cva } from 'class-variance-authority';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'icon';

// Base styles
const BASE_STYLES =
    'ui-button inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-250 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const buttonVariants = cva(BASE_STYLES, {
    variants: {
        variant: {
            contained: 'bg-[var(--ui-btn-bg)] hover:brightness-95',
            outlined:
                'border border-[var(--ui-btn-fg)] text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/5',
            text: 'text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/5',
            icon: 'p-2 text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/5',
        },
        size: {
            sm: 'px-4 py-2 text-xs',
            md: 'px-4 py-2',
            lg: 'px-6 py-2 text-base',
        },
        disabled: {
            true: 'opacity-50 cursor-auto pointer-events-none',
            false: 'hover:cursor-pointer',
        },
        blur: {
            true: 'backdrop-blur-md',
            false: '',
        },
    },
    compoundVariants: [
        {
            variant: 'contained',
            disabled: true,
            class: '!bg-gray-700/50 !text-gray-600 !hover:bg-gray-700/50',
        },
        {
            variant: 'outlined',
            disabled: true,
            class: '!border-gray-700/50 !text-gray-600 !hover:bg-transparent !hover:border-gray-700/50',
        },
        {
            variant: 'text',
            disabled: true,
            class: '!text-gray-600 !hover:bg-transparent',
        },
        {
            variant: 'icon',
            disabled: true,
            class: '!text-gray-600 !hover:bg-transparent',
        },
        {
            variant: 'contained',
            blur: true,
            disabled: false,
            class: 'bg-[var(--ui-btn-fg)]/10 text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/15 dark:bg-[var(--ui-btn-fg)]/5 dark:hover:bg-[var(--ui-btn-fg)]/10',
        },
        {
            variant: 'outlined',
            blur: true,
            disabled: false,
            class: 'border-[var(--ui-btn-fg)]/20 text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/10 hover:border-[var(--ui-btn-fg)]/30 dark:hover:bg-[var(--ui-btn-fg)]/5',
        },
        {
            variant: 'text',
            blur: true,
            disabled: false,
            class: 'text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/20 dark:hover:bg-[var(--ui-btn-fg)]/15',
        },
        {
            variant: 'icon',
            blur: true,
            disabled: false,
            class: 'text-[var(--ui-btn-fg)] hover:bg-[var(--ui-btn-fg)]/20 dark:hover:bg-[var(--ui-btn-fg)]/15',
        },
    ],
    defaultVariants: {
        variant: 'contained',
        size: 'md',
        disabled: false,
        blur: false,
    },
});

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ComponentSize;
    color?: string;
    disabled?: boolean;
    blur?: boolean;
}

// Colors that should use dark text for contrast
const LIGHT_COLORS = new Set(['white', '#ffffff', '#fff', '#fafafa', '#f5f5f5']);
// Colors that should use light text for contrast
const DARK_COLORS = new Set(['primary', 'secondary', 'gray', 'black', '#000000', '#000']);

export default function Button({
    children,
    variant = 'contained',
    size = 'md',
    color = variant === 'icon' ? 'gray' : 'white',
    disabled = false,
    blur = false,
    className,
    style,
    ...props
}: ButtonProps) {
    const baseClasses = buttonVariants({ variant, size, disabled, blur });

    // Determine the CSS color value. Use standard theme vars if a simple key is provided.
    const resolvedColor = ['primary', 'secondary', 'gray', 'black', 'white'].includes(color)
        ? `var(--color-${color})`
        : color;

    // For contained variant, determine text color based on background contrast
    const isContained = variant === 'contained' && !blur;
    const isLightBackground = LIGHT_COLORS.has(color);
    const isDarkBackground = DARK_COLORS.has(color);

    // Expose the resolved color as a CSS custom property so variant classes can
    // reference it. This lets consumers override hover/background via `className`
    // (e.g. `hover:bg-red-500`), which inline `style` would otherwise block.
    const buttonStyle = {
        ...(isContained
            ? { '--ui-btn-bg': resolvedColor }
            : { '--ui-btn-fg': resolvedColor }),
        ...style,
    } as React.CSSProperties;

    // Determine text color class for contained variant
    let textColorClass = '';
    if (isContained) {
        if (isLightBackground) {
            textColorClass = 'text-gray-900';
        } else if (isDarkBackground) {
            textColorClass = 'text-white';
        } else {
            // For custom colors, default to white text (most colored backgrounds need light text)
            textColorClass = 'text-white';
        }
    }

    return (
        <button
            disabled={disabled}
            className={twMerge(baseClasses, textColorClass, className)}
            style={buttonStyle}
            {...props}
        >
            {children}
        </button>
    );
}
