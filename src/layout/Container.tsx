import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';

export type ContainerMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

const maxWidthClasses: Record<Exclude<ContainerMaxWidth, false>, string> = {
    xs: 'max-w-[444px]',
    sm: 'screen-sm:max-w-[768px]',
    md: 'screen-md:max-w-[1024px]',
    lg: 'screen-lg:max-w-[1440px]',
    xl: 'screen-xl:max-w-[1720px]',
};

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
    maxWidth?: ContainerMaxWidth;
    disableGutters?: boolean;
    fixed?: boolean;
    component?: ElementType;
}

export function containerClasses({
    maxWidth = 'lg',
    disableGutters = false,
}: Pick<ContainerProps, 'maxWidth' | 'disableGutters'>): string {
    return cn(
        'mx-auto box-border block w-full',
        !disableGutters && 'px-4 screen-sm:px-6',
        maxWidth ? maxWidthClasses[maxWidth] : ''
    );
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
    { maxWidth = 'lg', disableGutters = false, fixed: _fixed, component, className, ...other },
    ref
) {
    const Component = component ?? 'div';
    return (
        <Component
            ref={ref}
            className={cn(containerClasses({ maxWidth, disableGutters }), className)}
            {...other}
        />
    );
});
