'use client';

import * as React from 'react';

import { cn } from '@/utils/cn';

export type CardProps = React.ComponentProps<'div'> & {
    /**
     * When true, renders without the default border/shadow chrome.
     * Useful inside a larger composite (e.g. `OrderSummaryPanel`) that owns the frame.
     */
    unstyled?: boolean;
};

function Card({ className, unstyled = false, ...props }: CardProps) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
                !unstyled && 'rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
                className,
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn('flex flex-col gap-1 p-4 sm:p-5', className)}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
    return (
        <h3
            data-slot="card-title"
            className={cn('text-base font-semibold leading-tight', className)}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            data-slot="card-description"
            className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
            {...props}
        />
    );
}

function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-body"
            className={cn('p-4 sm:p-5', className)}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                'flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-5',
                className,
            )}
            {...props}
        />
    );
}

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
