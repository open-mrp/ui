import { forwardRef } from 'react';
import { ButtonBase, type ButtonBaseProps } from './ButtonBase';
import { cn } from '@/utils/cn';
import type { PaletteColorName, Size } from '@/theme/types';

export interface FabProps extends Omit<ButtonBaseProps, 'color'> {
    size?: Size;
    color?: PaletteColorName | 'default' | 'inherit';
    variant?: 'circular' | 'extended';
}

const sizeClasses: Record<Size, string> = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14',
};

const colorClasses: Record<NonNullable<FabProps['color']>, string> = {
    default: 'bg-grey-300 text-black/87 hover:bg-grey-100',
    inherit: 'text-inherit bg-grey-300 hover:bg-grey-100',
    primary: 'bg-primary-main text-primary-contrast hover:bg-primary-dark',
    secondary: 'bg-secondary-main text-secondary-contrast hover:bg-secondary-dark',
    error: 'bg-error-main text-error-contrast hover:bg-error-dark',
    warning: 'bg-warning-main text-warning-contrast hover:bg-warning-dark',
    info: 'bg-info-main text-info-contrast hover:bg-info-dark',
    success: 'bg-success-main text-success-contrast hover:bg-success-dark',
};

export const Fab = forwardRef<HTMLElement, FabProps>(function Fab(
    { size = 'large', color = 'default', variant = 'circular', className, ...other },
    ref
) {
    return (
        <ButtonBase
            ref={ref}
            className={cn(
                'font-plex-sans text-[0.875rem] font-semibold leading-[1.75] uppercase min-h-9 transition-[background-color,box-shadow,border-color] duration-250 ease-standard rounded-full p-0 min-w-0 z-[1050] shadow-elevation-6 active:shadow-elevation-12 focus-visible:shadow-elevation-6',
                variant === 'circular' && sizeClasses[size],
                variant === 'extended' && 'rounded-[24px] px-4 min-w-12 w-auto h-12',
                colorClasses[color],
                'data-disabled:text-action-disabled data-disabled:shadow-none data-disabled:bg-action-disabled-bg',
                className
            )}
            {...other}
        />
    );
});
