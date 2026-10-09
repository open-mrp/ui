import { forwardRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';
import { Typography, type TypographyColor, type TypographyProps } from '@/typography/Typography';

export interface LinkProps extends Omit<TypographyProps, 'color'> {
    color?: TypographyColor;
    underline?: 'none' | 'hover' | 'always';
    component?: ElementType;
    href?: string;
    to?: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
}

const underlineColorClasses: Partial<Record<TypographyColor, string>> = {
    primary: 'decoration-primary-main/40',
    secondary: 'decoration-secondary-main/40',
    error: 'decoration-error-main/40',
    warning: 'decoration-warning-main/40',
    info: 'decoration-info-main/40',
    success: 'decoration-success-main/40',
    textPrimary: 'decoration-fg/40',
    textSecondary: 'decoration-fg-secondary/40',
    textDisabled: 'decoration-fg-disabled',
};

export const Link = forwardRef<HTMLElement, LinkProps>(function Link(
    { color = 'primary', underline = 'hover', variant = 'inherit', component, className, ...other },
    ref
) {
    const isButton = component === 'button';
    return (
        <Typography
            ref={ref}
            component={component ?? 'a'}
            variant={variant}
            color={color}
            className={cn(
                underline === 'none' && 'no-underline',
                underline === 'hover' && 'no-underline hover:underline',
                underline === 'always' && 'underline hover:decoration-inherit',
                underline === 'always' && underlineColorClasses[color],
                isButton &&
                    'relative cursor-pointer select-none appearance-none rounded-none border-0 bg-transparent p-0 m-0 align-middle outline-0 [-webkit-tap-highlight-color:transparent] focus-visible:[outline:auto]',
                className
            )}
            {...(isButton ? { type: 'button' } : {})}
            {...other}
        />
    );
});
