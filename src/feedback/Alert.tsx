'use client';

import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertProps = React.ComponentProps<'div'> & {
    variant?: AlertVariant;
    title?: React.ReactNode;
    icon?: React.ReactNode;
};

const variantStyles: Record<
    AlertVariant,
    { container: string; icon: string; defaultIcon: React.ReactNode }
> = {
    info: {
        container:
            'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900',
        icon: 'text-blue-500 dark:text-blue-400',
        defaultIcon: <Info className="h-4 w-4" />,
    },
    success: {
        container:
            'bg-green-50 text-green-900 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900',
        icon: 'text-green-500 dark:text-green-400',
        defaultIcon: <CheckCircle2 className="h-4 w-4" />,
    },
    warning: {
        container:
            'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900',
        icon: 'text-amber-500 dark:text-amber-400',
        defaultIcon: <TriangleAlert className="h-4 w-4" />,
    },
    error: {
        container:
            'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-900',
        icon: 'text-red-500 dark:text-red-400',
        defaultIcon: <AlertCircle className="h-4 w-4" />,
    },
};

function Alert({ variant = 'info', title, icon, className, children, ...props }: AlertProps) {
    const styles = variantStyles[variant];
    return (
        <div
            role="alert"
            data-slot="alert"
            className={cn(
                'flex items-start gap-3 rounded-md border px-3 py-2 text-sm',
                styles.container,
                className,
            )}
            {...props}
        >
            <span className={cn('flex shrink-0 items-center pt-0.5', styles.icon)}>
                {icon ?? styles.defaultIcon}
            </span>
            <div className="flex-1 min-w-0">
                {title && <div className="font-semibold leading-tight">{title}</div>}
                {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
            </div>
        </div>
    );
}

export { Alert };
