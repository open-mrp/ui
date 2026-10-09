import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
    variant?: 'elevation' | 'outlined';
    unstyled?: boolean;
    component?: ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
    { variant = 'elevation', unstyled = false, component, className, ...other },
    ref
) {
    const Component = component ?? 'div';
    return (
        <Component
            ref={ref}
            data-slot="card"
            className={cn(
                'overflow-hidden bg-paper text-fg',
                !unstyled && 'rounded-lg border border-solid border-divider',
                !unstyled && variant === 'elevation' && 'shadow-sm',
                className
            )}
            {...other}
        />
    );
});

export interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
    component?: ElementType;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
    { component, className, ...other },
    ref
) {
    const Component = component ?? 'div';
    return (
        <Component
            ref={ref}
            data-slot="card-body"
            className={cn('p-4 sm:p-5 [[data-slot=card-header]+&]:pt-0', className)}
            {...other}
        />
    );
});

export const CardBody = CardContent;

export interface CardActionsProps extends ComponentPropsWithoutRef<'div'> {
    disableSpacing?: boolean;
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
    { disableSpacing = false, className, ...other },
    ref
) {
    return (
        <div
            ref={ref}
            data-slot="card-footer"
            className={cn(
                'flex items-center border-t border-solid border-divider p-4 sm:p-5',
                !disableSpacing && 'gap-2',
                className
            )}
            {...other}
        />
    );
});

export const CardFooter = CardActions;

const cardTitleClasses = 'm-0 text-base leading-tight font-semibold';
const cardDescriptionClasses = 'm-0 text-sm text-fg-secondary';

export function CardTitle({ className, ...other }: ComponentPropsWithoutRef<'h3'>) {
    return <h3 data-slot="card-title" className={cn(cardTitleClasses, className)} {...other} />;
}

export function CardDescription({ className, ...other }: ComponentPropsWithoutRef<'p'>) {
    return (
        <p
            data-slot="card-description"
            className={cn(cardDescriptionClasses, className)}
            {...other}
        />
    );
}

export interface CardHeaderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
    title?: ReactNode;
    subheader?: ReactNode;
    avatar?: ReactNode;
    action?: ReactNode;
    titleClassName?: string;
    subheaderClassName?: string;
    contentClassName?: string;
    actionClassName?: string;
    component?: ElementType;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
    {
        title,
        subheader,
        avatar,
        action,
        titleClassName,
        subheaderClassName,
        contentClassName,
        actionClassName,
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const Component = component ?? 'div';
    const hasSlots = title != null || subheader != null || avatar != null || action != null;
    return (
        <Component
            ref={ref}
            data-slot="card-header"
            className={cn(
                hasSlots ? 'flex items-start gap-3' : 'flex flex-col gap-1',
                'p-4 sm:p-5',
                className
            )}
            {...other}
        >
            {avatar ? <div className="flex shrink-0">{avatar}</div> : null}
            {title != null || subheader != null ? (
                <div className={cn('flex min-w-0 flex-1 flex-col gap-1', contentClassName)}>
                    {title != null ? (
                        <div data-slot="card-title" className={cn(cardTitleClasses, titleClassName)}>
                            {title}
                        </div>
                    ) : null}
                    {subheader != null ? (
                        <div
                            data-slot="card-description"
                            className={cn(cardDescriptionClasses, subheaderClassName)}
                        >
                            {subheader}
                        </div>
                    ) : null}
                </div>
            ) : null}
            {children}
            {action ? (
                <div
                    data-slot="card-header-action"
                    className={cn('-my-1 -mr-2 ml-auto flex shrink-0 self-start', actionClassName)}
                >
                    {action}
                </div>
            ) : null}
        </Component>
    );
});
