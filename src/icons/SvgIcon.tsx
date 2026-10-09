import { forwardRef, memo, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type SvgIconFontSize = 'inherit' | 'small' | 'medium' | 'large';

export type SvgIconColor =
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';

export interface SvgIconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'color'> {
    fontSize?: SvgIconFontSize;
    color?: SvgIconColor;
    htmlColor?: string;
    titleAccess?: string;
    inheritViewBox?: boolean;
    children?: ReactNode;
}

const fontSizeClasses: Record<SvgIconFontSize, string> = {
    inherit: 'text-[length:inherit]',
    small: 'text-[1.25rem]',
    medium: 'text-[1.5rem]',
    large: 'text-[2.1875rem]',
};

const colorClasses: Record<SvgIconColor, string> = {
    inherit: '',
    action: 'text-action-active',
    disabled: 'text-action-disabled',
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    error: 'text-error-main',
    info: 'text-info-main',
    success: 'text-success-main',
    warning: 'text-warning-main',
};

export const svgIconBaseClasses =
    'inline-block h-[1em] w-[1em] shrink-0 fill-current select-none transition-[fill] duration-200 ease-standard';

export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(function SvgIcon(
    {
        fontSize = 'medium',
        color = 'inherit',
        htmlColor,
        titleAccess,
        inheritViewBox = false,
        viewBox = '0 0 24 24',
        className,
        children,
        ...other
    },
    ref
) {
    return (
        <svg
            ref={ref}
            focusable="false"
            data-slot="icon"
            color={htmlColor}
            aria-hidden={titleAccess ? undefined : true}
            role={titleAccess ? 'img' : undefined}
            viewBox={inheritViewBox ? undefined : viewBox}
            className={cn(
                svgIconBaseClasses,
                fontSizeClasses[fontSize],
                colorClasses[color],
                className
            )}
            {...other}
        >
            {children}
            {titleAccess ? <title>{titleAccess}</title> : null}
        </svg>
    );
});

export type SvgIconComponent = ReturnType<typeof createSvgIcon>;

export function createSvgIcon(path: ReactNode, displayName: string) {
    const Icon = forwardRef<SVGSVGElement, SvgIconProps>(function Icon(props, ref) {
        return (
            <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
                {path}
            </SvgIcon>
        );
    });
    Icon.displayName = `${displayName}Icon`;
    return memo(Icon);
}
