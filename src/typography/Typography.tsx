import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'overline'
    | 'button'
    | 'inherit';

export type TypographyColor =
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'textPrimary'
    | 'textSecondary'
    | 'textDisabled'
    | 'textTertiary'
    | 'inherit';

export const typographyVariantClasses: Record<TypographyVariant, string> = {
    h1: 'font-plex-sans text-[3.5rem] font-bold leading-[1.375]',
    h2: 'font-plex-sans text-[3rem] font-bold leading-[1.375]',
    h3: 'font-plex-sans text-[2.25rem] font-bold leading-[1.375]',
    h4: 'font-plex-sans text-[2rem] font-bold leading-[1.375]',
    h5: 'font-plex-sans text-[1.5rem] font-semibold leading-[1.375]',
    h6: 'font-plex-sans text-[1.125rem] font-semibold leading-[1.375]',
    subtitle1: 'font-plex-sans text-[1rem] font-medium leading-[1.75]',
    subtitle2: 'font-plex-sans text-[0.875rem] font-medium leading-[1.57]',
    body1: 'font-plex-sans text-[1rem] font-normal leading-[1.5]',
    body2: 'font-plex-sans text-[0.875rem] font-normal leading-[1.57]',
    caption: 'font-plex-mono text-[0.75rem] font-normal leading-[1.66]',
    overline:
        'font-plex-mono text-[0.75rem] font-semibold leading-[2.5] tracking-[0.5px] uppercase',
    button: 'font-plex-sans text-[0.875rem] font-semibold leading-[1.75] uppercase',
    inherit: '[font:inherit] leading-[inherit] tracking-[inherit]',
};

export const typographyColorClasses: Record<TypographyColor, string> = {
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    error: 'text-error-main',
    warning: 'text-warning-main',
    info: 'text-info-main',
    success: 'text-success-main',
    textPrimary: 'text-fg',
    textSecondary: 'text-fg-secondary',
    textDisabled: 'text-fg-disabled',
    textTertiary: 'text-fg-tertiary',
    inherit: '',
};

const defaultElements: Record<TypographyVariant, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    inherit: 'p',
    caption: 'span',
    overline: 'span',
    button: 'span',
};

const alignClasses = {
    inherit: '',
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
};

export function typographyClasses(variant: TypographyVariant = 'body1'): string {
    return typographyVariantClasses[variant];
}

export interface TypographyProps extends Omit<ComponentPropsWithoutRef<'p'>, 'color'> {
    variant?: TypographyVariant;
    color?: TypographyColor;
    component?: ElementType;
    align?: keyof typeof alignClasses;
    noWrap?: boolean;
    gutterBottom?: boolean;
    children?: ReactNode;
    href?: string;
    to?: string;
    type?: string;
    [key: `data-${string}`]: unknown;
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(
    {
        variant = 'body1',
        color,
        component,
        align = 'inherit',
        noWrap,
        gutterBottom,
        className,
        ...other
    },
    ref
) {
    const Component = component ?? defaultElements[variant];
    return (
        <Component
            ref={ref}
            className={cn(
                'm-0 selection:bg-primary-main selection:text-white selection:[-webkit-text-fill-color:#fff]',
                typographyVariantClasses[variant],
                color ? typographyColorClasses[color] : '',
                alignClasses[align],
                noWrap && 'overflow-hidden text-ellipsis whitespace-nowrap',
                gutterBottom && 'mb-[0.35em]',
                className
            )}
            {...other}
        />
    );
});
