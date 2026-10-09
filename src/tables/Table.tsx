'use client';

import {
    createContext,
    forwardRef,
    useContext,
    type ComponentPropsWithoutRef,
    type ElementType,
} from 'react';
import { cn } from '@/utils/cn';
import { paperClasses } from '@/layout/Paper';

type CellPadding = 'normal' | 'checkbox' | 'none';
type CellSize = 'small' | 'medium';
type Section = 'head' | 'body' | 'footer';

const TableContext = createContext<{ size: CellSize; padding: CellPadding; stickyHeader: boolean }>(
    {
        size: 'medium',
        padding: 'normal',
        stickyHeader: false,
    }
);
const SectionContext = createContext<Section | null>(null);

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
    size?: CellSize;
    padding?: CellPadding;
    stickyHeader?: boolean;
    component?: ElementType;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
    { size = 'medium', padding = 'normal', stickyHeader = false, component, className, ...other },
    ref
) {
    const Component = component ?? 'table';
    return (
        <TableContext.Provider value={{ size, padding, stickyHeader }}>
            <Component
                ref={ref}
                className={cn(
                    'table w-full border-spacing-0',
                    stickyHeader ? 'border-separate' : 'border-collapse',
                    '[&_caption]:p-4 [&_caption]:text-left [&_caption]:font-plex-sans [&_caption]:text-[0.875rem] [&_caption]:leading-[1.57] [&_caption]:text-fg-secondary [&_caption]:[caption-side:bottom]',
                    className
                )}
                {...other}
            />
        </TableContext.Provider>
    );
});

export interface TableSectionProps extends ComponentPropsWithoutRef<'tbody'> {
    component?: ElementType;
}

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableHead(
    { component, className, ...other },
    ref
) {
    const Component = component ?? 'thead';
    return (
        <SectionContext.Provider value="head">
            <Component
                ref={ref}
                className={cn(
                    'table-header-group bg-table-head leading-[1.2] [&_[data-table-cell]]:text-table-head-text',
                    className
                )}
                {...other}
            />
        </SectionContext.Provider>
    );
});

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableBody(
    { component, className, ...other },
    ref
) {
    const Component = component ?? 'tbody';
    return (
        <SectionContext.Provider value="body">
            <Component ref={ref} className={cn('table-row-group', className)} {...other} />
        </SectionContext.Provider>
    );
});

export const TableFooter = forwardRef<HTMLTableSectionElement, TableSectionProps>(
    function TableFooter({ component, className, ...other }, ref) {
        const Component = component ?? 'tfoot';
        return (
            <SectionContext.Provider value="footer">
                <Component ref={ref} className={cn('table-footer-group', className)} {...other} />
            </SectionContext.Provider>
        );
    }
);

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
    hover?: boolean;
    selected?: boolean;
    component?: ElementType;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
    { hover = false, selected = false, component, className, ...other },
    ref
) {
    const Component = component ?? 'tr';
    return (
        <Component
            ref={ref}
            data-selected={selected ? '' : undefined}
            className={cn(
                'table-row align-middle text-inherit outline-0',
                hover && 'hover:bg-action-hover',
                selected && 'bg-primary-main/8 hover:bg-primary-main/12',
                className
            )}
            {...other}
        />
    );
});

export interface TableCellProps extends Omit<ComponentPropsWithoutRef<'td'>, 'align'> {
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    padding?: CellPadding;
    size?: CellSize;
    variant?: Section;
    sortDirection?: 'asc' | 'desc' | false;
    component?: ElementType;
    scope?: string;
}

const alignClasses = {
    inherit: '',
    left: 'text-left',
    center: 'text-center',
    right: 'text-right flex-row-reverse',
    justify: 'text-justify',
};

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
    {
        align = 'inherit',
        padding: paddingProp,
        size: sizeProp,
        variant: variantProp,
        sortDirection,
        component,
        scope,
        className,
        ...other
    },
    ref
) {
    const table = useContext(TableContext);
    const section = useContext(SectionContext);
    const variant = variantProp ?? section ?? 'body';
    const isHead = variant === 'head';
    const Component = component ?? (isHead ? 'th' : 'td');
    const padding = paddingProp ?? table.padding;
    const size = sizeProp ?? table.size;
    return (
        <Component
            ref={ref}
            scope={scope ?? (isHead && Component === 'th' ? 'col' : undefined)}
            aria-sort={
                sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined
            }
            data-variant={variant}
            data-table-cell=""
            className={cn(
                'table-cell border-b border-solid border-divider p-4 text-left align-[inherit] font-plex-sans text-[0.875rem] font-normal leading-[1.57]',
                isHead && 'font-medium leading-[1.5rem] text-fg',
                variant === 'body' && 'text-fg',
                variant === 'footer' && 'text-[0.75rem] leading-[1.3125rem] text-fg-secondary',
                size === 'small' && 'px-4 py-1.5',
                padding === 'checkbox' &&
                    (size === 'small' ? 'w-6 py-0 pr-3 pl-4 [&>*]:p-0!' : 'w-12 py-0 pr-0 pl-1'),
                padding === 'none' && 'p-0',
                table.stickyHeader && isHead && 'sticky top-0 z-[2] bg-surface',
                alignClasses[align],
                className
            )}
            {...other}
        />
    );
});

export interface TableContainerProps extends ComponentPropsWithoutRef<'div'> {
    component?: ElementType;
    variant?: 'elevation' | 'outlined';
    elevation?: number;
}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
    function TableContainer({ component, variant, elevation, className, ...other }, ref) {
        const Component = component ?? 'div';
        const isPaper =
            typeof Component !== 'string' || variant !== undefined || elevation !== undefined;
        return (
            <Component
                ref={ref}
                className={cn(
                    isPaper &&
                        typeof Component === 'string' &&
                        paperClasses({ variant, elevation }),
                    'w-full overflow-x-auto',
                    className
                )}
                {...(typeof Component !== 'string' ? { variant, elevation } : {})}
                {...other}
            />
        );
    }
);
