import { forwardRef, type ReactNode } from 'react';
import { ButtonBase, type ButtonBaseProps } from './ButtonBase';
import { CircularProgress } from '@/feedback/CircularProgress';
import { cn } from '@/utils/cn';
import type { PaletteColorName, Size } from '@/theme/types';

export type IconButtonColor = PaletteColorName | 'inherit' | 'default';

export interface IconButtonProps extends Omit<ButtonBaseProps, 'color'> {
    color?: IconButtonColor;
    size?: Size;
    edge?: 'start' | 'end' | false;
    loading?: boolean | null;
    loadingIndicator?: ReactNode;
}

const colorClasses: Record<IconButtonColor, string> = {
    default: '',
    inherit: 'text-inherit',
    primary: 'text-primary-main hover:bg-primary-main/4',
    secondary: 'text-secondary-main hover:bg-secondary-main/4',
    error: 'text-error-main hover:bg-error-main/4',
    warning: 'text-warning-main hover:bg-warning-main/4',
    info: 'text-info-main hover:bg-info-main/4',
    success: 'text-success-main hover:bg-success-main/4',
};

const sizeClasses: Record<Size, string> = {
    small: 'p-1 text-[1.125rem]',
    medium: 'p-2 text-[1.5rem]',
    large: 'p-2 text-[1.75rem]',
};

function edgeClasses(edge: IconButtonProps['edge'], size: Size): string {
    if (edge === 'start') return size === 'small' ? '-ml-[3px]' : '-ml-3';
    if (edge === 'end') return size === 'small' ? '-mr-[3px]' : '-mr-3';
    return '';
}

export function iconButtonClasses({
    color = 'default',
    size = 'medium',
    edge = false,
}: Pick<IconButtonProps, 'color' | 'size' | 'edge'>): string {
    return cn(
        'text-center flex-[0_0_auto] rounded-lg text-action-active transition-[background-color] duration-150 ease-standard hover:bg-action-active/4',
        sizeClasses[size],
        colorClasses[color],
        edgeClasses(edge, size),
        'data-disabled:bg-transparent data-disabled:text-action-disabled'
    );
}

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(function IconButton(
    {
        color = 'default',
        size = 'medium',
        edge = false,
        loading = null,
        loadingIndicator,
        disabled,
        className,
        children,
        ...other
    },
    ref
) {
    return (
        <ButtonBase
            ref={ref}
            disabled={disabled || loading === true}
            className={cn(
                iconButtonClasses({ color, size, edge }),
                loading === true && 'text-transparent',
                className
            )}
            {...other}
        >
            {typeof loading === 'boolean' ? (
                <span className="contents">
                    <span
                        className={cn(
                            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-action-disabled visible',
                            loading ? 'flex' : 'hidden'
                        )}
                    >
                        {loading &&
                            (loadingIndicator ?? <CircularProgress color="inherit" size={16} />)}
                    </span>
                </span>
            ) : null}
            {children}
        </ButtonBase>
    );
});
