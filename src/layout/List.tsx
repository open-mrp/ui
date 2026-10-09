'use client';

import {
    createContext,
    forwardRef,
    isValidElement,
    useContext,
    type ComponentPropsWithoutRef,
    type ElementType,
    type ReactNode,
} from 'react';
import { ButtonBase, type ButtonBaseProps } from '@/buttons/ButtonBase';
import { cn } from '@/utils/cn';
import { Typography, type TypographyProps } from '@/typography/Typography';

export const ListContext = createContext<{ dense: boolean }>({ dense: false });

export interface ListProps extends ComponentPropsWithoutRef<'ul'> {
    dense?: boolean;
    disablePadding?: boolean;
    subheader?: ReactNode;
    component?: ElementType;
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
    {
        dense: denseProp,
        disablePadding = false,
        subheader,
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const parent = useContext(ListContext);
    const dense = denseProp ?? parent.dense;
    const Component = component ?? 'ul';
    return (
        <ListContext.Provider value={{ dense }}>
            <Component
                ref={ref}
                className={cn(
                    'relative m-0 list-none p-0',
                    !disablePadding && 'py-2',
                    subheader && 'pt-0',
                    className
                )}
                {...other}
            >
                {subheader}
                {children}
            </Component>
        </ListContext.Provider>
    );
});

export interface ListItemProps extends ComponentPropsWithoutRef<'li'> {
    dense?: boolean;
    disableGutters?: boolean;
    disablePadding?: boolean;
    divider?: boolean;
    alignItems?: 'center' | 'flex-start';
    secondaryAction?: ReactNode;
    component?: ElementType;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
    {
        dense: denseProp,
        disableGutters = false,
        disablePadding = false,
        divider = false,
        alignItems = 'center',
        secondaryAction,
        component,
        className,
        children,
        ...other
    },
    ref
) {
    const parent = useContext(ListContext);
    const dense = denseProp ?? parent.dense;
    const Component = component ?? 'li';
    return (
        <ListContext.Provider value={{ dense }}>
            <Component
                ref={ref}
                className={cn(
                    'relative box-border flex w-full justify-start text-left no-underline',
                    alignItems === 'flex-start' ? 'items-start' : 'items-center',
                    !disablePadding && (dense ? 'py-1' : 'py-2'),
                    !disablePadding && !disableGutters && 'px-4',
                    !disablePadding && secondaryAction && 'pr-12',
                    divider && 'border-b border-solid border-divider bg-clip-padding',
                    className
                )}
                {...other}
            >
                {children}
                {secondaryAction ? (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                        {secondaryAction}
                    </div>
                ) : null}
            </Component>
        </ListContext.Provider>
    );
});

export interface ListItemButtonProps extends ButtonBaseProps {
    dense?: boolean;
    disableGutters?: boolean;
    divider?: boolean;
    selected?: boolean;
    alignItems?: 'center' | 'flex-start';
    autoFocus?: boolean;
}

export const ListItemButton = forwardRef<HTMLElement, ListItemButtonProps>(function ListItemButton(
    {
        dense: denseProp,
        disableGutters = false,
        divider = false,
        selected = false,
        alignItems = 'center',
        component,
        className,
        ...other
    },
    ref
) {
    const parent = useContext(ListContext);
    const dense = denseProp ?? parent.dense;
    return (
        <ListContext.Provider value={{ dense }}>
            <ButtonBase
                ref={ref}
                component={component ?? 'div'}
                data-selected={selected ? '' : undefined}
                className={cn(
                    'relative box-border flex min-w-0 grow justify-start text-left no-underline transition-[background-color] duration-150 ease-standard',
                    alignItems === 'flex-start' ? 'items-start' : 'items-center',
                    dense ? 'py-1' : 'py-2',
                    !disableGutters && 'px-4',
                    divider && 'border-b border-solid border-divider bg-clip-padding',
                    'hover:bg-action-hover focus-visible:bg-action-focus',
                    selected &&
                        'bg-primary-main/8 hover:bg-primary-main/12 focus-visible:bg-primary-main/20',
                    'data-disabled:opacity-38',
                    className
                )}
                {...other}
            />
        </ListContext.Provider>
    );
});

export interface ListItemTextProps extends ComponentPropsWithoutRef<'div'> {
    primary?: ReactNode;
    secondary?: ReactNode;
    inset?: boolean;
    disableTypography?: boolean;
    primaryTypographyProps?: Partial<TypographyProps>;
    secondaryTypographyProps?: Partial<TypographyProps>;
    slotProps?: { primary?: Partial<TypographyProps>; secondary?: Partial<TypographyProps> };
}

export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(function ListItemText(
    {
        primary: primaryProp,
        secondary: secondaryProp,
        inset = false,
        disableTypography = false,
        primaryTypographyProps,
        secondaryTypographyProps,
        slotProps,
        className,
        children,
        ...other
    },
    ref
) {
    const { dense } = useContext(ListContext);
    const primaryContent = primaryProp ?? children;
    const primarySlot = { ...primaryTypographyProps, ...slotProps?.primary };
    const secondarySlot = { ...secondaryTypographyProps, ...slotProps?.secondary };
    const primary =
        primaryContent != null &&
        !disableTypography &&
        !(isValidElement(primaryContent) && primaryContent.type === Typography) ? (
            <Typography
                data-slot="list-item-text-primary"
                variant={dense ? 'body2' : 'body1'}
                component={primarySlot.variant ? undefined : 'span'}
                {...primarySlot}
                className={cn('block', primarySlot.className)}
            >
                {primaryContent}
            </Typography>
        ) : (
            primaryContent
        );
    const secondary =
        secondaryProp != null &&
        !disableTypography &&
        !(isValidElement(secondaryProp) && secondaryProp.type === Typography) ? (
            <Typography
                data-slot="list-item-text-secondary"
                variant="body2"
                color="textSecondary"
                {...secondarySlot}
                className={cn('block', secondarySlot.className)}
            >
                {secondaryProp}
            </Typography>
        ) : (
            secondaryProp
        );
    return (
        <div
            ref={ref}
            className={cn(
                'min-w-0 flex-[1_1_auto]',
                primaryContent != null && secondaryProp != null ? 'my-1.5' : 'my-1',
                inset && 'pl-14',
                '[[data-menu-item]_&]:my-0',
                className
            )}
            {...other}
        >
            {primary}
            {secondary}
        </div>
    );
});

export const ListItemIcon = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<'div'> & { alignItems?: 'center' | 'flex-start' }
>(function ListItemIcon({ alignItems = 'center', className, ...other }, ref) {
    return (
        <div
            ref={ref}
            data-list-item-icon=""
            data-slot="list-item-icon"
            className={cn(
                'mr-4 inline-flex min-w-[unset] shrink-0 text-action-active',
                alignItems === 'flex-start' && 'mt-2',
                className
            )}
            {...other}
        />
    );
});

export const ListItemAvatar = forwardRef<
    HTMLDivElement,
    ComponentPropsWithoutRef<'div'> & { alignItems?: 'center' | 'flex-start' }
>(function ListItemAvatar({ alignItems = 'center', className, ...other }, ref) {
    return (
        <div
            ref={ref}
            className={cn('min-w-14 shrink-0', alignItems === 'flex-start' && 'mt-2', className)}
            {...other}
        />
    );
});

export interface ListSubheaderProps extends ComponentPropsWithoutRef<'li'> {
    disableGutters?: boolean;
    disableSticky?: boolean;
    inset?: boolean;
    color?: 'default' | 'primary' | 'inherit';
    component?: ElementType;
}

export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(function ListSubheader(
    {
        disableGutters = false,
        disableSticky = false,
        inset = false,
        color = 'default',
        component,
        className,
        ...other
    },
    ref
) {
    const Component = component ?? 'li';
    return (
        <Component
            ref={ref}
            className={cn(
                'box-border list-none font-plex-sans text-[0.875rem] font-medium leading-[48px]',
                color === 'default' && 'text-fg-secondary',
                color === 'primary' && 'text-primary-main',
                color === 'inherit' && 'text-inherit',
                !disableGutters && 'px-4',
                inset && 'pl-[72px]',
                !disableSticky && 'sticky top-0 z-[1] bg-paper',
                className
            )}
            {...other}
        />
    );
});
