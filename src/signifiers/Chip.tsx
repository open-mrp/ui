import {
    cloneElement,
    forwardRef,
    isValidElement,
    type ComponentPropsWithoutRef,
    type ElementType,
    type KeyboardEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
} from 'react';
import { buttonKeyboardHandlers } from '@/buttons/ButtonBase';
import { cn } from '@/utils/cn';
import { InternalCancelIcon } from '@/icons/internal-icons';
import type { PaletteColorName } from '@/theme/types';

export type ChipColor = PaletteColorName | 'default';

export interface ChipProps extends Omit<ComponentPropsWithoutRef<'div'>, 'color'> {
    label?: ReactNode;
    color?: ChipColor;
    variant?: 'filled' | 'outlined';
    size?: 'small' | 'medium';
    icon?: ReactElement<{ className?: string; color?: string }>;
    avatar?: ReactElement<{ className?: string }>;
    deleteIcon?: ReactElement<{ className?: string; onClick?: (event: MouseEvent) => void }>;
    onDelete?: (event: MouseEvent | KeyboardEvent) => void;
    clickable?: boolean;
    disabled?: boolean;
    component?: ElementType;
    href?: string;
    to?: string;
    target?: string;
    labelClassName?: string;
}

const filledColors: Record<ChipColor, string> = {
    default: 'bg-chip-default text-fg',
    primary: 'bg-primary-main text-primary-contrast',
    secondary: 'bg-secondary-main text-secondary-contrast',
    error: 'bg-error-main text-error-contrast',
    warning: 'bg-warning-main text-warning-contrast',
    info: 'bg-info-main text-info-contrast',
    success: 'bg-success-main text-success-contrast',
};

const outlinedColors: Record<ChipColor, string> = {
    default: 'bg-transparent text-fg border border-solid border-chip-outlined-border',
    primary: 'bg-transparent text-primary-main border border-solid border-primary-main/70',
    secondary: 'bg-transparent text-secondary-main border border-solid border-secondary-main/70',
    error: 'bg-transparent text-error-main border border-solid border-error-main/70',
    warning: 'bg-transparent text-warning-main border border-solid border-warning-main/70',
    info: 'bg-transparent text-info-main border border-solid border-info-main/70',
    success: 'bg-transparent text-success-main border border-solid border-success-main/70',
};

const filledClickable: Record<ChipColor, string> = {
    default: '',
    primary: 'hover:bg-primary-dark',
    secondary: 'hover:bg-secondary-dark',
    error: 'hover:bg-error-dark',
    warning: 'hover:bg-warning-dark',
    info: 'hover:bg-info-dark',
    success: 'hover:bg-success-dark',
};

const filledFocusable: Record<ChipColor, string> = {
    default: '',
    primary: 'focus-visible:bg-primary-dark',
    secondary: 'focus-visible:bg-secondary-dark',
    error: 'focus-visible:bg-error-dark',
    warning: 'focus-visible:bg-warning-dark',
    info: 'focus-visible:bg-info-dark',
    success: 'focus-visible:bg-success-dark',
};

const outlinedClickable: Record<ChipColor, string> = {
    default: 'hover:bg-action-hover',
    primary: 'hover:bg-primary-main/4',
    secondary: 'hover:bg-secondary-main/4',
    error: 'hover:bg-error-main/4',
    warning: 'hover:bg-warning-main/4',
    info: 'hover:bg-info-main/4',
    success: 'hover:bg-success-main/4',
};

const outlinedFocusable: Record<ChipColor, string> = {
    default: 'focus-visible:bg-action-focus',
    primary: 'focus-visible:bg-primary-main/12',
    secondary: 'focus-visible:bg-secondary-main/12',
    error: 'focus-visible:bg-error-main/12',
    warning: 'focus-visible:bg-warning-main/12',
    info: 'focus-visible:bg-info-main/12',
    success: 'focus-visible:bg-success-main/12',
};

const deleteIconColors: Record<'filled' | 'outlined', Record<ChipColor, string>> = {
    filled: {
        default: 'text-chip-delete hover:text-chip-delete-hover',
        primary:
            'text-primary-contrast/70 hover:text-primary-contrast active:text-primary-contrast',
        secondary:
            'text-secondary-contrast/70 hover:text-secondary-contrast active:text-secondary-contrast',
        error: 'text-error-contrast/70 hover:text-error-contrast active:text-error-contrast',
        warning:
            'text-warning-contrast/70 hover:text-warning-contrast active:text-warning-contrast',
        info: 'text-info-contrast/70 hover:text-info-contrast active:text-info-contrast',
        success:
            'text-success-contrast/70 hover:text-success-contrast active:text-success-contrast',
    },
    outlined: {
        default: 'text-chip-delete hover:text-chip-delete-hover',
        primary: 'text-primary-main/70 hover:text-primary-main active:text-primary-main',
        secondary: 'text-secondary-main/70 hover:text-secondary-main active:text-secondary-main',
        error: 'text-error-main/70 hover:text-error-main active:text-error-main',
        warning: 'text-warning-main/70 hover:text-warning-main active:text-warning-main',
        info: 'text-info-main/70 hover:text-info-main active:text-info-main',
        success: 'text-success-main/70 hover:text-success-main active:text-success-main',
    },
};

function iconClasses(size: 'small' | 'medium', variant: 'filled' | 'outlined'): string {
    if (size === 'small')
        return cn('text-[18px] -mr-1', variant === 'outlined' ? 'ml-0.5' : 'ml-1');
    return cn('-mr-1.5', variant === 'outlined' ? 'ml-1' : 'ml-[5px]');
}

function avatarClasses(
    size: 'small' | 'medium',
    variant: 'filled' | 'outlined',
    color: ChipColor
): string {
    return cn(
        size === 'small'
            ? cn(
                  'w-[18px] h-[18px] text-[0.625rem] -mr-1',
                  variant === 'outlined' ? 'ml-0.5' : 'ml-1'
              )
            : cn('w-6 h-6 text-[0.75rem] -mr-1.5', variant === 'outlined' ? 'ml-1' : 'ml-[5px]'),
        color === 'primary' && 'text-primary-contrast bg-primary-dark',
        color === 'secondary' && 'text-secondary-contrast bg-secondary-dark',
        color === 'default' && 'text-chip-icon'
    );
}

function deleteIconLayout(size: 'small' | 'medium', variant: 'filled' | 'outlined'): string {
    if (size === 'small')
        return cn('text-[16px] -ml-1', variant === 'outlined' ? 'mr-[3px]' : 'mr-1');
    return cn('text-[22px] -ml-1.5', variant === 'outlined' ? 'mr-[5px]' : 'mr-[5px]');
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
    {
        label,
        color = 'default',
        variant = 'filled',
        size = 'medium',
        icon,
        avatar,
        deleteIcon,
        onDelete,
        clickable: clickableProp,
        disabled = false,
        component,
        href,
        className,
        labelClassName,
        onClick,
        onKeyUp,
        onKeyDown,
        ...other
    },
    ref
) {
    const clickable = clickableProp !== false && onClick ? true : Boolean(clickableProp);
    const interactive = clickable || Boolean(onDelete);
    const Component = component ?? (href ? 'a' : 'div');
    const handleDelete = (event: MouseEvent) => {
        event.stopPropagation();
        onDelete?.(event);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (
            event.currentTarget === event.target &&
            (event.key === 'Backspace' || event.key === 'Delete')
        ) {
            event.preventDefault();
        }
        onKeyDown?.(event);
    };
    const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
        if (
            event.currentTarget === event.target &&
            onDelete &&
            (event.key === 'Backspace' || event.key === 'Delete')
        ) {
            onDelete(event);
        }
        onKeyUp?.(event);
    };
    const deleteNode = onDelete ? (
        isValidElement(deleteIcon) ? (
            cloneElement(deleteIcon, {
                className: cn(
                    'cursor-pointer [-webkit-tap-highlight-color:transparent]',
                    deleteIconLayout(size, variant),
                    deleteIconColors[variant][color],
                    deleteIcon.props.className
                ),
                onClick: handleDelete,
                'data-slot': 'chip-delete',
            } as Record<string, unknown>)
        ) : (
            <InternalCancelIcon
                data-slot="chip-delete"
                className={cn(
                    'cursor-pointer [-webkit-tap-highlight-color:transparent]',
                    deleteIconLayout(size, variant),
                    deleteIconColors[variant][color]
                )}
                onClick={handleDelete}
            />
        )
    ) : null;
    const iconNode =
        icon && isValidElement(icon)
            ? cloneElement(icon, {
                  className: cn(
                      icon.props.className,
                      iconClasses(size, variant),
                      (!icon.props.color || icon.props.color === color) &&
                          (color === 'default' ? 'text-chip-icon' : 'text-inherit')
                  ),
              })
            : null;
    const avatarNode =
        avatar && isValidElement(avatar)
            ? cloneElement(avatar, {
                  className: cn(avatarClasses(size, variant, color), avatar.props.className),
              })
            : null;
    return (
        <Component
            ref={ref}
            data-slot="chip"
            href={href}
            role={interactive && Component === 'div' ? 'button' : undefined}
            tabIndex={interactive ? (clickable && disabled ? -1 : 0) : undefined}
            aria-disabled={(clickable && disabled) || undefined}
            data-disabled={disabled ? '' : undefined}
            {...(interactive
                ? buttonKeyboardHandlers<HTMLDivElement>({
                      disabled: clickable && disabled,
                      onClick,
                      onKeyDown: handleKeyDown,
                      onKeyUp: handleKeyUp,
                  })
                : { onClick, onKeyDown: handleKeyDown, onKeyUp: handleKeyUp })}
            className={cn(
                'inline-flex max-w-full items-center justify-center box-border whitespace-nowrap align-middle no-underline outline-0 p-0 border-0 cursor-[unset] font-plex-mono text-[0.8125rem] font-medium leading-[1.5] rounded-[16px] transition-[background-color,box-shadow] duration-300 ease-standard',
                size === 'small' ? 'h-6' : 'h-8',
                variant === 'filled' ? filledColors[color] : outlinedColors[color],
                interactive && 'relative',
                clickable &&
                    'cursor-pointer select-none [-webkit-tap-highlight-color:transparent] active:shadow-elevation-1',
                clickable &&
                    (variant === 'filled' ? filledClickable[color] : outlinedClickable[color]),
                interactive &&
                    (variant === 'filled' ? filledFocusable[color] : outlinedFocusable[color]),
                'data-disabled:pointer-events-none data-disabled:opacity-38',
                className
            )}
            {...other}
        >
            {avatarNode ?? iconNode}
            <span
                data-slot="chip-label"
                className={cn(
                    'overflow-hidden text-ellipsis whitespace-nowrap',
                    size === 'small'
                        ? variant === 'outlined'
                            ? 'px-[7px]'
                            : 'px-2'
                        : variant === 'outlined'
                          ? 'px-[11px]'
                          : 'px-3',
                    labelClassName
                )}
            >
                {label}
            </span>
            {deleteNode}
        </Component>
    );
});
