import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'color' | 'title'> {
    severity?: AlertSeverity;
    color?: AlertSeverity;
    variant?: 'standard' | 'outlined' | 'filled';
    title?: ReactNode;
    icon?: ReactNode | false;
    action?: ReactNode;
    onClose?: (event: React.MouseEvent<HTMLElement>) => void;
    closeText?: string;
    iconClassName?: string;
    messageClassName?: string;
    actionClassName?: string;
}

const defaultIcons: Record<AlertSeverity, ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <TriangleAlert className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
};

const toneClasses: Record<AlertSeverity, { text: string; border: string; bg: string; icon: string }> = {
    info: {
        text: 'text-blue-900 dark:text-blue-200',
        border: 'border-blue-200 dark:border-blue-900',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        icon: 'text-blue-500 dark:text-blue-400',
    },
    success: {
        text: 'text-green-900 dark:text-green-200',
        border: 'border-green-200 dark:border-green-900',
        bg: 'bg-green-50 dark:bg-green-950/30',
        icon: 'text-green-500 dark:text-green-400',
    },
    warning: {
        text: 'text-amber-900 dark:text-amber-200',
        border: 'border-amber-200 dark:border-amber-900',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        icon: 'text-amber-500 dark:text-amber-400',
    },
    error: {
        text: 'text-red-900 dark:text-red-200',
        border: 'border-red-200 dark:border-red-900',
        bg: 'bg-red-50 dark:bg-red-950/30',
        icon: 'text-red-500 dark:text-red-400',
    },
};

const filledClasses: Record<AlertSeverity, string> = {
    info: 'border-blue-600 bg-blue-600 text-white',
    success: 'border-green-600 bg-green-600 text-white',
    warning: 'border-amber-500 bg-amber-500 text-amber-950',
    error: 'border-red-600 bg-red-600 text-white',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    {
        severity = 'success',
        color,
        variant = 'standard',
        title,
        icon,
        action,
        onClose,
        closeText = 'Close',
        role = 'alert',
        className,
        iconClassName,
        messageClassName,
        actionClassName,
        children,
        ...other
    },
    ref
) {
    const tone = color ?? severity;
    const styles = toneClasses[tone];
    const trailing =
        action ??
        (onClose ? (
            <button
                type="button"
                aria-label={closeText}
                title={closeText}
                onClick={onClose}
                className="inline-flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 text-current opacity-70 transition-opacity hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        ) : null);
    return (
        <div
            ref={ref}
            role={role}
            data-slot="alert"
            className={cn(
                'flex items-start gap-3 rounded-md border border-solid px-3 py-2 font-plex-sans text-sm',
                variant === 'filled'
                    ? filledClasses[tone]
                    : cn(styles.text, styles.border, variant === 'standard' && styles.bg),
                className
            )}
            {...other}
        >
            {icon !== false ? (
                <span
                    className={cn(
                        'flex shrink-0 items-center pt-0.5 [&_svg]:h-4 [&_svg]:w-4',
                        variant !== 'filled' && styles.icon,
                        iconClassName
                    )}
                >
                    {icon ?? defaultIcons[tone]}
                </span>
            ) : null}
            <div data-slot="alert-message" className={cn('min-w-0 flex-1', messageClassName)}>
                {title != null ? <AlertTitle>{title}</AlertTitle> : null}
                {children}
            </div>
            {trailing != null ? (
                <div className={cn('-my-0.5 ml-auto flex shrink-0 items-start', actionClassName)}>
                    {trailing}
                </div>
            ) : null}
        </div>
    );
});

export function AlertTitle({ className, ...other }: ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            data-slot="alert-title"
            className={cn('mb-0.5 leading-tight font-semibold', className)}
            {...other}
        />
    );
}
