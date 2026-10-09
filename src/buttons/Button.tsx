import { forwardRef, useId, type ReactNode } from 'react';
import { ButtonBase, type ButtonBaseProps } from './ButtonBase';
import { CircularProgress } from '@/feedback/CircularProgress';
import { cn } from '@/utils/cn';
import type { PaletteColorName, Size } from '@/theme/types';

export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonColor = PaletteColorName | 'inherit';

export interface ButtonProps extends Omit<ButtonBaseProps, 'color'> {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: Size;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    fullWidth?: boolean;
    disableElevation?: boolean;
    loading?: boolean | null;
    loadingPosition?: 'start' | 'end' | 'center';
    loadingIndicator?: ReactNode;
}

const containedColors: Record<ButtonColor, string> = {
    primary: 'bg-primary-main text-primary-contrast hover:bg-primary-dark',
    secondary: 'bg-secondary-main text-secondary-contrast hover:bg-secondary-dark',
    error: 'bg-error-main text-error-contrast hover:bg-error-dark',
    warning: 'bg-warning-main text-warning-contrast hover:bg-warning-dark',
    info: 'bg-info-main text-info-contrast hover:bg-info-dark',
    success: 'bg-success-main text-success-contrast hover:bg-success-dark',
    inherit: 'bg-button-inherit text-inherit hover:bg-button-inherit-hover',
};

const outlinedColors: Record<ButtonColor, string> = {
    primary:
        'text-primary-main border-primary-main/50 hover:border-primary-main hover:bg-primary-main/4',
    secondary:
        'text-secondary-main border-secondary-main/50 hover:border-secondary-main hover:bg-secondary-main/4',
    error: 'text-error-main border-error-main/50 hover:border-error-main hover:bg-error-main/4',
    warning:
        'text-warning-main border-warning-main/50 hover:border-warning-main hover:bg-warning-main/4',
    info: 'text-info-main border-info-main/50 hover:border-info-main hover:bg-info-main/4',
    success:
        'text-success-main border-success-main/50 hover:border-success-main hover:bg-success-main/4',
    inherit: 'text-inherit border-current hover:bg-fg/4',
};

const textColors: Record<ButtonColor, string> = {
    primary: 'text-primary-main hover:bg-primary-main/4',
    secondary: 'text-secondary-main hover:bg-secondary-main/4',
    error: 'text-error-main hover:bg-error-main/4',
    warning: 'text-warning-main hover:bg-warning-main/4',
    info: 'text-info-main hover:bg-info-main/4',
    success: 'text-success-main hover:bg-success-main/4',
    inherit: 'text-inherit hover:bg-fg/4',
};

const sizeClasses: Record<Size, string> = {
    small: 'px-3 py-1.5 text-[0.8125rem]',
    medium: 'px-4 py-2',
    large: 'px-6 py-2.5 text-[0.9375rem]',
};

const iconSizeClasses: Record<Size, string> = {
    small: '[&>*:nth-of-type(1)]:text-[16px]',
    medium: '[&>*:nth-of-type(1)]:text-[18px]',
    large: '[&>*:nth-of-type(1)]:text-[20px]',
};

const loadingOffsetClasses = {
    start: { text: 'left-[6px]', small: 'left-[8px]', default: 'left-[12px]' },
    end: { text: 'right-[6px]', small: 'right-[8px]', default: 'right-[12px]' },
};

function loadingIndicatorPosition(
    position: 'start' | 'end' | 'center',
    variant: ButtonVariant,
    size: Size,
    fullWidth: boolean
): string {
    if (position === 'center') return 'left-1/2 -translate-x-1/2 text-action-disabled';
    if (fullWidth) return position === 'start' ? 'relative left-[-10px]' : 'relative right-[-10px]';
    const offset = variant === 'text' ? 'text' : size === 'small' ? 'small' : 'default';
    return loadingOffsetClasses[position][offset];
}

const indicatorOffsets: Record<string, string> = {
    'left-[6px]': 'left-[6px]',
    'left-[8px]': 'left-[8px]',
    'left-[12px]': 'left-[12px]',
    'right-[6px]': 'right-[6px]',
    'right-[8px]': 'right-[8px]',
    'right-[12px]': 'right-[12px]',
};

export function buttonClasses({
    variant = 'text',
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    disableElevation = true,
    loading = false,
    loadingPosition = 'center',
}: Pick<
    ButtonProps,
    'variant' | 'color' | 'size' | 'fullWidth' | 'disableElevation' | 'loading' | 'loadingPosition'
>): string {
    return cn(
        'font-plex-sans text-[0.875rem] font-semibold leading-5 normal-case min-w-16 rounded-lg transition-[background-color,box-shadow,border-color,color] duration-250 ease-standard hover:no-underline',
        variant === 'contained' && containedColors[color],
        variant === 'contained' &&
            'data-disabled:text-action-disabled data-disabled:bg-action-disabled-bg data-disabled:shadow-none',
        variant === 'contained' &&
            !disableElevation &&
            'shadow-elevation-2 hover:shadow-elevation-4 active:shadow-elevation-8 focus-visible:shadow-elevation-6',
        variant === 'outlined' && 'border border-solid',
        variant === 'outlined' && outlinedColors[color],
        variant === 'outlined' && 'data-disabled:border-action-disabled-bg',
        variant === 'text' && textColors[color],
        'data-disabled:text-action-disabled',
        sizeClasses[size],
        fullWidth && 'w-full',
        loading &&
            loadingPosition === 'center' &&
            'transition-[background-color,box-shadow,border-color] text-transparent!'
    );
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
    {
        variant = 'text',
        color = 'primary',
        size = 'medium',
        startIcon,
        endIcon,
        fullWidth = false,
        disableElevation = true,
        loading = null,
        loadingPosition = 'center',
        loadingIndicator,
        disabled,
        id: idProp,
        className,
        children,
        ...other
    },
    ref
) {
    const generatedId = useId();
    const loadingId = idProp ?? generatedId;
    const isLoading = loading === true;
    const hideStart = isLoading && loadingPosition === 'start';
    const hideEnd = isLoading && loadingPosition === 'end';
    const indicatorPosition = loadingIndicatorPosition(loadingPosition, variant, size, fullWidth);
    const loader =
        typeof loading === 'boolean' ? (
            <span className="contents">
                {isLoading ? (
                    <span
                        className={cn(
                            'absolute flex visible',
                            indicatorOffsets[indicatorPosition] ?? indicatorPosition
                        )}
                    >
                        {loadingIndicator ?? (
                            <CircularProgress
                                aria-labelledby={loadingId}
                                color="inherit"
                                size={16}
                            />
                        )}
                    </span>
                ) : null}
            </span>
        ) : null;
    const start =
        startIcon || hideStart ? (
            <span
                data-slot="button-start-icon"
                className={cn(
                    '[display:inherit] items-center mr-2 -ml-1 zero-width-before',
                    size === 'small' && '-ml-0.5',
                    hideStart && 'opacity-0 transition-opacity duration-250 ease-standard',
                    hideStart && fullWidth && '-mr-2',
                    iconSizeClasses[size]
                )}
            >
                {startIcon || <span className="inline-block h-[1em] w-[1em]" />}
            </span>
        ) : null;
    const end =
        endIcon || hideEnd ? (
            <span
                data-slot="button-end-icon"
                className={cn(
                    '[display:inherit] -mr-1 ml-2',
                    size === 'small' && '-mr-0.5',
                    hideEnd && 'opacity-0 transition-opacity duration-250 ease-standard',
                    hideEnd && fullWidth && '-ml-2',
                    iconSizeClasses[size]
                )}
            >
                {endIcon || <span className="inline-block h-[1em] w-[1em]" />}
            </span>
        ) : null;
    return (
        <ButtonBase
            ref={ref}
            data-slot="button"
            id={isLoading ? loadingId : idProp}
            disabled={disabled || isLoading}
            className={cn(
                buttonClasses({
                    variant,
                    color,
                    size,
                    fullWidth,
                    disableElevation,
                    loading: isLoading,
                    loadingPosition,
                }),
                className
            )}
            {...other}
        >
            {start}
            {loadingPosition !== 'end' && loader}
            {children}
            {loadingPosition === 'end' && loader}
            {end}
        </ButtonBase>
    );
});
