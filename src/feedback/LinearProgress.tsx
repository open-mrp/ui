import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';
import type { PaletteColorName } from '@/theme/types';

export interface LinearProgressProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
    color?: PaletteColorName | 'inherit';
    value?: number;
    variant?: 'determinate' | 'indeterminate';
    barClassName?: string;
}

const trackClasses: Record<NonNullable<LinearProgressProps['color']>, string> = {
    primary: 'bg-(--palette-primary-linear-bg)',
    secondary: 'bg-(--palette-secondary-linear-bg)',
    error: 'bg-(--palette-error-linear-bg)',
    warning: 'bg-(--palette-warning-linear-bg)',
    info: 'bg-(--palette-info-linear-bg)',
    success: 'bg-(--palette-success-linear-bg)',
    inherit:
        'before:absolute before:inset-0 before:bg-current before:opacity-30 before:content-[""]',
};

const barClasses: Record<NonNullable<LinearProgressProps['color']>, string> = {
    primary: 'bg-primary-main',
    secondary: 'bg-secondary-main',
    error: 'bg-error-main',
    warning: 'bg-warning-main',
    info: 'bg-info-main',
    success: 'bg-success-main',
    inherit: 'bg-current',
};

export const LinearProgress = forwardRef<HTMLSpanElement, LinearProgressProps>(
    function LinearProgress(
        {
            color = 'primary',
            value = 0,
            variant = 'indeterminate',
            className,
            barClassName,
            ...other
        },
        ref
    ) {
        const determinate = variant === 'determinate';
        const rounded = Math.round(value);
        return (
            <span
                ref={ref}
                role="progressbar"
                aria-valuenow={determinate ? rounded : undefined}
                aria-valuemin={determinate ? 0 : undefined}
                aria-valuemax={determinate ? 100 : undefined}
                className={cn(
                    'relative z-0 block h-1 overflow-hidden rounded-[3px] print:[print-color-adjust:exact]',
                    trackClasses[color],
                    className
                )}
                {...other}
            >
                {determinate ? (
                    <span
                        data-slot="linear-progress-bar"
                        className={cn(
                            'absolute top-0 bottom-0 left-0 w-full origin-left transition-transform duration-400 ease-linear',
                            barClasses[color],
                            barClassName
                        )}
                        style={{ transform: `translateX(${value - 100}%)` }}
                    />
                ) : (
                    <>
                        <span
                            className={cn(
                                'absolute top-0 bottom-0 left-0 w-auto origin-left animate-progress-bar-1',
                                barClasses[color],
                                barClassName
                            )}
                        />
                        <span
                            className={cn(
                                'absolute top-0 bottom-0 left-0 w-auto origin-left animate-progress-bar-2',
                                barClasses[color],
                                barClassName
                            )}
                        />
                    </>
                )}
            </span>
        );
    }
);
