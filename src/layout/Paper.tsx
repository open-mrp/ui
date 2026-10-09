import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';

export const elevationClasses = [
    'shadow-elevation-0',
    'shadow-elevation-1',
    'shadow-elevation-2',
    'shadow-elevation-3',
    'shadow-elevation-4',
    'shadow-elevation-5',
    'shadow-elevation-6',
    'shadow-elevation-7',
    'shadow-elevation-8',
    'shadow-elevation-9',
    'shadow-elevation-10',
    'shadow-elevation-11',
    'shadow-elevation-12',
    'shadow-elevation-13',
    'shadow-elevation-14',
    'shadow-elevation-15',
    'shadow-elevation-16',
    'shadow-elevation-17',
    'shadow-elevation-18',
    'shadow-elevation-19',
    'shadow-elevation-20',
    'shadow-elevation-21',
    'shadow-elevation-22',
    'shadow-elevation-23',
    'shadow-elevation-24',
] as const;

export interface PaperProps extends ComponentPropsWithoutRef<'div'> {
    elevation?: number;
    square?: boolean;
    variant?: 'elevation' | 'outlined';
    component?: ElementType;
    [key: `data-${string}`]: unknown;
}

export function paperClasses({
    elevation = 1,
    square = false,
    variant = 'elevation',
}: Pick<PaperProps, 'elevation' | 'square' | 'variant'>): string {
    return cn(
        'bg-paper text-fg transition-shadow duration-300 ease-standard',
        !square && 'rounded-lg',
        variant === 'outlined' ? 'border border-solid border-divider' : elevationClasses[elevation]
    );
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
    { elevation = 1, square = false, variant = 'elevation', component, className, ...other },
    ref
) {
    const Component = component ?? 'div';
    return (
        <Component
            ref={ref}
            data-slot="paper"
            className={cn(paperClasses({ elevation, square, variant }), className)}
            {...other}
        />
    );
});
