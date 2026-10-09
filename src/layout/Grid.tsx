'use client';

import {
    createContext,
    forwardRef,
    useContext,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ElementType,
} from 'react';
import { cn } from '@/utils/cn';
import type { BreakpointKey } from '@/theme/theme';

type GridNamespace = 'a' | 'b';

const GridDepthContext = createContext(0);

export type GridSize = number | 'grow' | 'auto';
export type GridResponsive<T> = T | Partial<Record<BreakpointKey, T>>;

export interface GridProps extends ComponentPropsWithoutRef<'div'> {
    container?: boolean;
    size?: GridResponsive<GridSize>;
    spacing?: GridResponsive<number | string>;
    rowSpacing?: GridResponsive<number | string>;
    columnSpacing?: GridResponsive<number | string>;
    columns?: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    offset?: GridResponsive<number | 'auto'>;
    component?: ElementType;
    [key: `data-${string}`]: unknown;
}

const breakpointKeys: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const numericSizeClasses: Record<BreakpointKey, string> = {
    xs: 'grow-0 basis-auto w-[calc(100%*var(--grid-xs-size)/var(--grid-parent-columns,12)-(var(--grid-parent-columns,12)-var(--grid-xs-size))*(var(--grid-parent-column-spacing,0px)/var(--grid-parent-columns,12)))]',
    sm: 'screen-sm:grow-0 screen-sm:basis-auto screen-sm:w-[calc(100%*var(--grid-sm-size)/var(--grid-parent-columns,12)-(var(--grid-parent-columns,12)-var(--grid-sm-size))*(var(--grid-parent-column-spacing,0px)/var(--grid-parent-columns,12)))]',
    md: 'screen-md:grow-0 screen-md:basis-auto screen-md:w-[calc(100%*var(--grid-md-size)/var(--grid-parent-columns,12)-(var(--grid-parent-columns,12)-var(--grid-md-size))*(var(--grid-parent-column-spacing,0px)/var(--grid-parent-columns,12)))]',
    lg: 'screen-lg:grow-0 screen-lg:basis-auto screen-lg:w-[calc(100%*var(--grid-lg-size)/var(--grid-parent-columns,12)-(var(--grid-parent-columns,12)-var(--grid-lg-size))*(var(--grid-parent-column-spacing,0px)/var(--grid-parent-columns,12)))]',
    xl: 'screen-xl:grow-0 screen-xl:basis-auto screen-xl:w-[calc(100%*var(--grid-xl-size)/var(--grid-parent-columns,12)-(var(--grid-parent-columns,12)-var(--grid-xl-size))*(var(--grid-parent-column-spacing,0px)/var(--grid-parent-columns,12)))]',
};

const growSizeClasses: Record<BreakpointKey, string> = {
    xs: 'basis-0 grow max-w-full',
    sm: 'screen-sm:basis-0 screen-sm:grow screen-sm:max-w-full',
    md: 'screen-md:basis-0 screen-md:grow screen-md:max-w-full',
    lg: 'screen-lg:basis-0 screen-lg:grow screen-lg:max-w-full',
    xl: 'screen-xl:basis-0 screen-xl:grow screen-xl:max-w-full',
};

const autoSizeClasses: Record<BreakpointKey, string> = {
    xs: 'basis-auto grow-0 shrink-0 max-w-none w-auto',
    sm: 'screen-sm:basis-auto screen-sm:grow-0 screen-sm:shrink-0 screen-sm:max-w-none screen-sm:w-auto',
    md: 'screen-md:basis-auto screen-md:grow-0 screen-md:shrink-0 screen-md:max-w-none screen-md:w-auto',
    lg: 'screen-lg:basis-auto screen-lg:grow-0 screen-lg:shrink-0 screen-lg:max-w-none screen-lg:w-auto',
    xl: 'screen-xl:basis-auto screen-xl:grow-0 screen-xl:shrink-0 screen-xl:max-w-none screen-xl:w-auto',
};

const spacingClasses: Record<GridNamespace, Record<BreakpointKey, string>> = {
    a: {
        xs: '[--grid-row-spacing:var(--grid-a-xs-row)] [--grid-column-spacing:var(--grid-a-xs-col)] *:[--grid-parent-row-spacing:var(--grid-a-xs-row)] *:[--grid-parent-column-spacing:var(--grid-a-xs-col)]',
        sm: 'screen-sm:[--grid-row-spacing:var(--grid-a-sm-row)] screen-sm:[--grid-column-spacing:var(--grid-a-sm-col)] screen-sm:*:[--grid-parent-row-spacing:var(--grid-a-sm-row)] screen-sm:*:[--grid-parent-column-spacing:var(--grid-a-sm-col)]',
        md: 'screen-md:[--grid-row-spacing:var(--grid-a-md-row)] screen-md:[--grid-column-spacing:var(--grid-a-md-col)] screen-md:*:[--grid-parent-row-spacing:var(--grid-a-md-row)] screen-md:*:[--grid-parent-column-spacing:var(--grid-a-md-col)]',
        lg: 'screen-lg:[--grid-row-spacing:var(--grid-a-lg-row)] screen-lg:[--grid-column-spacing:var(--grid-a-lg-col)] screen-lg:*:[--grid-parent-row-spacing:var(--grid-a-lg-row)] screen-lg:*:[--grid-parent-column-spacing:var(--grid-a-lg-col)]',
        xl: 'screen-xl:[--grid-row-spacing:var(--grid-a-xl-row)] screen-xl:[--grid-column-spacing:var(--grid-a-xl-col)] screen-xl:*:[--grid-parent-row-spacing:var(--grid-a-xl-row)] screen-xl:*:[--grid-parent-column-spacing:var(--grid-a-xl-col)]',
    },
    b: {
        xs: '[--grid-row-spacing:var(--grid-b-xs-row)] [--grid-column-spacing:var(--grid-b-xs-col)] *:[--grid-parent-row-spacing:var(--grid-b-xs-row)] *:[--grid-parent-column-spacing:var(--grid-b-xs-col)]',
        sm: 'screen-sm:[--grid-row-spacing:var(--grid-b-sm-row)] screen-sm:[--grid-column-spacing:var(--grid-b-sm-col)] screen-sm:*:[--grid-parent-row-spacing:var(--grid-b-sm-row)] screen-sm:*:[--grid-parent-column-spacing:var(--grid-b-sm-col)]',
        md: 'screen-md:[--grid-row-spacing:var(--grid-b-md-row)] screen-md:[--grid-column-spacing:var(--grid-b-md-col)] screen-md:*:[--grid-parent-row-spacing:var(--grid-b-md-row)] screen-md:*:[--grid-parent-column-spacing:var(--grid-b-md-col)]',
        lg: 'screen-lg:[--grid-row-spacing:var(--grid-b-lg-row)] screen-lg:[--grid-column-spacing:var(--grid-b-lg-col)] screen-lg:*:[--grid-parent-row-spacing:var(--grid-b-lg-row)] screen-lg:*:[--grid-parent-column-spacing:var(--grid-b-lg-col)]',
        xl: 'screen-xl:[--grid-row-spacing:var(--grid-b-xl-row)] screen-xl:[--grid-column-spacing:var(--grid-b-xl-col)] screen-xl:*:[--grid-parent-row-spacing:var(--grid-b-xl-row)] screen-xl:*:[--grid-parent-column-spacing:var(--grid-b-xl-col)]',
    },
};

const parentColumnsClasses: Record<GridNamespace, string> = {
    a: '*:[--grid-parent-columns:var(--grid-a-columns)]',
    b: '*:[--grid-parent-columns:var(--grid-b-columns)]',
};

const offsetClasses: Record<BreakpointKey, string> = {
    xs: 'ml-(--grid-xs-offset)',
    sm: 'screen-sm:ml-(--grid-sm-offset)',
    md: 'screen-md:ml-(--grid-md-offset)',
    lg: 'screen-lg:ml-(--grid-lg-offset)',
    xl: 'screen-xl:ml-(--grid-xl-offset)',
};

const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
};

const wrapClasses = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
};

function toResponsive<T>(value: GridResponsive<T> | undefined): Partial<Record<BreakpointKey, T>> {
    if (value === undefined) return {};
    if (typeof value === 'object' && value !== null)
        return value as Partial<Record<BreakpointKey, T>>;
    return { xs: value };
}

function toSpacing(value: number | string): string {
    return typeof value === 'number' ? `${value * 8}px` : value;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
    {
        container = false,
        size,
        spacing = 0,
        rowSpacing,
        columnSpacing,
        columns = 12,
        direction,
        wrap = 'wrap',
        offset,
        component,
        className,
        style,
        children,
        ...other
    },
    ref
) {
    const depth = useContext(GridDepthContext);
    const namespace: GridNamespace = depth % 2 === 0 ? 'a' : 'b';
    const Component = component ?? 'div';
    const classes: string[] = ['min-w-0 box-border'];
    const vars: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(toResponsive(size)) as Array<
        [BreakpointKey, GridSize]
    >) {
        if (value === 'grow') classes.push(growSizeClasses[key]);
        else if (value === 'auto') classes.push(autoSizeClasses[key]);
        else if (typeof value === 'number') {
            classes.push(numericSizeClasses[key]);
            vars[`--grid-${key}-size`] = value;
        }
    }
    for (const [key, value] of Object.entries(toResponsive(offset)) as Array<
        [BreakpointKey, number | 'auto']
    >) {
        classes.push(offsetClasses[key]);
        vars[`--grid-${key}-offset`] =
            value === 'auto'
                ? 'auto'
                : value === 0
                  ? '0px'
                  : `calc(100% * ${value} / var(--grid-parent-columns, 12) + var(--grid-parent-column-spacing, 0px) * ${value} / var(--grid-parent-columns, 12))`;
    }
    if (container) {
        classes.push(
            'flex gap-y-(--grid-row-spacing) gap-x-(--grid-column-spacing)',
            wrapClasses[wrap]
        );
        if (direction) classes.push(directionClasses[direction]);
        vars[`--grid-${namespace}-columns`] = columns;
        classes.push(parentColumnsClasses[namespace]);
        const rows = toResponsive(rowSpacing ?? spacing);
        const cols = toResponsive(columnSpacing ?? spacing);
        for (const key of breakpointKeys) {
            const row = rows[key];
            const col = cols[key];
            if (row === undefined && col === undefined) continue;
            classes.push(spacingClasses[namespace][key]);
            vars[`--grid-${namespace}-${key}-row`] = toSpacing(row ?? rows.xs ?? 0);
            vars[`--grid-${namespace}-${key}-col`] = toSpacing(col ?? cols.xs ?? 0);
        }
    }
    return (
        <Component
            ref={ref}
            className={cn(classes.join(' '), className)}
            style={{ ...(vars as CSSProperties), ...style }}
            {...other}
        >
            <GridDepthContext.Provider value={depth + 1}>{children}</GridDepthContext.Provider>
        </Component>
    );
});
