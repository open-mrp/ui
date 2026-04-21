'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

export type ProgressBarProps = {
    /** 0–100 */
    value: number;
    className?: string;
    indeterminate?: boolean;
    ariaLabel?: string;
};

function ProgressBar({ value, className, indeterminate = false, ariaLabel }: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value));
    return (
        <div
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
            className={cn(
                'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 h-1.5',
                className,
            )}
        >
            <div
                className={cn(
                    'h-full bg-[var(--primary)] transition-all duration-300',
                    indeterminate && 'animate-pulse',
                )}
                style={{ width: indeterminate ? '40%' : `${clamped}%` }}
            />
        </div>
    );
}

export { ProgressBar };
