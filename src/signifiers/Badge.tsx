import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { PaletteColorName } from '@/theme/types';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
    badgeContent?: ReactNode;
    color?: PaletteColorName | 'default';
    max?: number;
    invisible?: boolean;
    showZero?: boolean;
    overlap?: 'rectangular' | 'circular';
    variant?: 'standard' | 'dot';
    anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
    badgeClassName?: string;
}

const colorClasses: Record<NonNullable<BadgeProps['color']>, string> = {
    default: '',
    primary: 'bg-primary-main text-primary-contrast',
    secondary: 'bg-secondary-main text-secondary-contrast',
    error: 'bg-error-main text-error-contrast',
    warning: 'bg-warning-main text-warning-contrast',
    info: 'bg-info-main text-info-contrast',
    success: 'bg-success-main text-success-contrast',
};

function anchorClasses(
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right',
    overlap: 'rectangular' | 'circular',
    invisible: boolean
): string {
    const inset = overlap === 'circular' ? '14%' : '0';
    const position = [
        vertical === 'top'
            ? inset === '0'
                ? 'top-0'
                : 'top-[14%]'
            : inset === '0'
              ? 'bottom-0'
              : 'bottom-[14%]',
        horizontal === 'right'
            ? inset === '0'
                ? 'right-0'
                : 'right-[14%]'
            : inset === '0'
              ? 'left-0'
              : 'left-[14%]',
    ].join(' ');
    const translate = `${horizontal === 'right' ? 'translate-x-1/2' : '-translate-x-1/2'} ${vertical === 'top' ? '-translate-y-1/2' : 'translate-y-1/2'}`;
    const origin = `${horizontal === 'right' ? (vertical === 'top' ? 'origin-[100%_0%]' : 'origin-[100%_100%]') : vertical === 'top' ? 'origin-[0%_0%]' : 'origin-[0%_100%]'}`;
    return cn(position, translate, origin, invisible ? 'scale-0' : 'scale-100');
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
        badgeContent,
        color = 'default',
        max = 99,
        invisible: invisibleProp = false,
        showZero = false,
        overlap = 'rectangular',
        variant = 'standard',
        anchorOrigin = { vertical: 'top', horizontal: 'right' },
        badgeClassName,
        className,
        children,
        ...other
    },
    ref
) {
    const invisible =
        invisibleProp ||
        (variant !== 'dot' && (badgeContent == null || (badgeContent === 0 && !showZero)));
    const displayValue =
        variant === 'dot'
            ? undefined
            : typeof badgeContent === 'number' && badgeContent > max
              ? `${max}+`
              : badgeContent;
    return (
        <span
            ref={ref}
            className={cn('relative inline-flex shrink-0 align-middle', className)}
            {...other}
        >
            {children}
            <span
                aria-hidden
                className={cn(
                    'absolute z-[1] box-border flex flex-row flex-wrap content-center items-center justify-center font-plex-sans text-[0.75rem] font-medium leading-none',
                    variant === 'dot'
                        ? 'h-2 min-w-2 rounded-[4px] p-0'
                        : 'h-5 min-w-5 rounded-[10px] px-1.5',
                    colorClasses[color],
                    anchorClasses(
                        anchorOrigin.vertical,
                        anchorOrigin.horizontal,
                        overlap,
                        invisible
                    ),
                    invisible
                        ? 'transition-transform duration-195 ease-standard'
                        : 'transition-transform duration-225 ease-standard',
                    badgeClassName
                )}
            >
                {displayValue}
            </span>
        </span>
    );
});
