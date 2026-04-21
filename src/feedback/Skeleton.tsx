'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

export type SkeletonProps = React.ComponentProps<'div'> & {
    variant?: 'text' | 'rect' | 'circle';
};

function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
    return (
        <div
            data-slot="skeleton"
            aria-hidden="true"
            className={cn(
                'animate-pulse bg-gray-200 dark:bg-gray-700',
                variant === 'text' && 'h-4 w-full rounded',
                variant === 'rect' && 'rounded-md',
                variant === 'circle' && 'rounded-full',
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
