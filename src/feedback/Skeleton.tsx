import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends ComponentPropsWithoutRef<'span'> {
    variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
    animation?: 'pulse' | 'wave' | false;
    width?: number | string;
    height?: number | string;
    component?: ElementType;
}

const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    rounded: 'rounded-lg',
    circular: 'rounded-full',
};

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
    {
        variant = 'text',
        animation = 'pulse',
        width,
        height,
        component,
        className,
        style,
        children,
        ...other
    },
    ref
) {
    const Component = component ?? 'span';
    const hasChildren = Boolean(children);
    return (
        <Component
            ref={ref}
            data-slot="skeleton"
            aria-hidden="true"
            className={cn(
                'block bg-gray-200 dark:bg-gray-700',
                variant !== 'text' && 'h-[1.2em]',
                variant === 'text' && (height == null ? 'h-4' : 'origin-[0_55%] scale-y-[0.65]'),
                variantClasses[variant],
                animation !== false && 'animate-pulse',
                hasChildren && '*:invisible',
                hasChildren && width == null && 'max-w-fit',
                hasChildren && height == null && 'h-auto',
                className
            )}
            style={{ width, height, ...style }}
            {...other}
        >
            {children}
        </Component>
    );
});
