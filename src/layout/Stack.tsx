'use client';

import {
    Children,
    createContext,
    Fragment,
    forwardRef,
    isValidElement,
    useContext,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ElementType,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import type { BreakpointKey } from '@/theme/theme';

type StackNamespace = 'a' | 'b';

const StackDepthContext = createContext(0);

export type StackDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
    direction?: Responsive<StackDirection>;
    spacing?: Responsive<number | string>;
    divider?: ReactNode;
    useFlexGap?: boolean;
    component?: ElementType;
    [key: `data-${string}`]: unknown;
}

const breakpointKeys: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const directionClasses: Record<BreakpointKey, Record<StackDirection, string>> = {
    xs: {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        column: 'flex-col',
        'column-reverse': 'flex-col-reverse',
    },
    sm: {
        row: 'screen-sm:flex-row',
        'row-reverse': 'screen-sm:flex-row-reverse',
        column: 'screen-sm:flex-col',
        'column-reverse': 'screen-sm:flex-col-reverse',
    },
    md: {
        row: 'screen-md:flex-row',
        'row-reverse': 'screen-md:flex-row-reverse',
        column: 'screen-md:flex-col',
        'column-reverse': 'screen-md:flex-col-reverse',
    },
    lg: {
        row: 'screen-lg:flex-row',
        'row-reverse': 'screen-lg:flex-row-reverse',
        column: 'screen-lg:flex-col',
        'column-reverse': 'screen-lg:flex-col-reverse',
    },
    xl: {
        row: 'screen-xl:flex-row',
        'row-reverse': 'screen-xl:flex-row-reverse',
        column: 'screen-xl:flex-col',
        'column-reverse': 'screen-xl:flex-col-reverse',
    },
};

const marginClasses: Record<StackNamespace, Record<BreakpointKey, string>> = {
    a: {
        xs: '[&>:not(style)~:not(style):not(style)]:mt-(--stack-a-xs-t) [&>:not(style)~:not(style):not(style)]:mr-(--stack-a-xs-r) [&>:not(style)~:not(style):not(style)]:mb-(--stack-a-xs-b) [&>:not(style)~:not(style):not(style)]:ml-(--stack-a-xs-l)',
        sm: 'screen-sm:[&>:not(style)~:not(style):not(style)]:mt-(--stack-a-sm-t) screen-sm:[&>:not(style)~:not(style):not(style)]:mr-(--stack-a-sm-r) screen-sm:[&>:not(style)~:not(style):not(style)]:mb-(--stack-a-sm-b) screen-sm:[&>:not(style)~:not(style):not(style)]:ml-(--stack-a-sm-l)',
        md: 'screen-md:[&>:not(style)~:not(style):not(style)]:mt-(--stack-a-md-t) screen-md:[&>:not(style)~:not(style):not(style)]:mr-(--stack-a-md-r) screen-md:[&>:not(style)~:not(style):not(style)]:mb-(--stack-a-md-b) screen-md:[&>:not(style)~:not(style):not(style)]:ml-(--stack-a-md-l)',
        lg: 'screen-lg:[&>:not(style)~:not(style):not(style)]:mt-(--stack-a-lg-t) screen-lg:[&>:not(style)~:not(style):not(style)]:mr-(--stack-a-lg-r) screen-lg:[&>:not(style)~:not(style):not(style)]:mb-(--stack-a-lg-b) screen-lg:[&>:not(style)~:not(style):not(style)]:ml-(--stack-a-lg-l)',
        xl: 'screen-xl:[&>:not(style)~:not(style):not(style)]:mt-(--stack-a-xl-t) screen-xl:[&>:not(style)~:not(style):not(style)]:mr-(--stack-a-xl-r) screen-xl:[&>:not(style)~:not(style):not(style)]:mb-(--stack-a-xl-b) screen-xl:[&>:not(style)~:not(style):not(style)]:ml-(--stack-a-xl-l)',
    },
    b: {
        xs: '[&>:not(style)~:not(style):not(style)]:mt-(--stack-b-xs-t) [&>:not(style)~:not(style):not(style)]:mr-(--stack-b-xs-r) [&>:not(style)~:not(style):not(style)]:mb-(--stack-b-xs-b) [&>:not(style)~:not(style):not(style)]:ml-(--stack-b-xs-l)',
        sm: 'screen-sm:[&>:not(style)~:not(style):not(style)]:mt-(--stack-b-sm-t) screen-sm:[&>:not(style)~:not(style):not(style)]:mr-(--stack-b-sm-r) screen-sm:[&>:not(style)~:not(style):not(style)]:mb-(--stack-b-sm-b) screen-sm:[&>:not(style)~:not(style):not(style)]:ml-(--stack-b-sm-l)',
        md: 'screen-md:[&>:not(style)~:not(style):not(style)]:mt-(--stack-b-md-t) screen-md:[&>:not(style)~:not(style):not(style)]:mr-(--stack-b-md-r) screen-md:[&>:not(style)~:not(style):not(style)]:mb-(--stack-b-md-b) screen-md:[&>:not(style)~:not(style):not(style)]:ml-(--stack-b-md-l)',
        lg: 'screen-lg:[&>:not(style)~:not(style):not(style)]:mt-(--stack-b-lg-t) screen-lg:[&>:not(style)~:not(style):not(style)]:mr-(--stack-b-lg-r) screen-lg:[&>:not(style)~:not(style):not(style)]:mb-(--stack-b-lg-b) screen-lg:[&>:not(style)~:not(style):not(style)]:ml-(--stack-b-lg-l)',
        xl: 'screen-xl:[&>:not(style)~:not(style):not(style)]:mt-(--stack-b-xl-t) screen-xl:[&>:not(style)~:not(style):not(style)]:mr-(--stack-b-xl-r) screen-xl:[&>:not(style)~:not(style):not(style)]:mb-(--stack-b-xl-b) screen-xl:[&>:not(style)~:not(style):not(style)]:ml-(--stack-b-xl-l)',
    },
};

const gapClasses: Record<BreakpointKey, string> = {
    xs: 'gap-(--stack-xs-gap)',
    sm: 'screen-sm:gap-(--stack-sm-gap)',
    md: 'screen-md:gap-(--stack-md-gap)',
    lg: 'screen-lg:gap-(--stack-lg-gap)',
    xl: 'screen-xl:gap-(--stack-xl-gap)',
};

const sideByDirection: Record<StackDirection, 't' | 'r' | 'b' | 'l'> = {
    row: 'l',
    'row-reverse': 'r',
    column: 't',
    'column-reverse': 'b',
};

function isResponsiveObject<T>(
    value: Responsive<T> | undefined
): value is Partial<Record<BreakpointKey, T>> {
    return typeof value === 'object' && value !== null;
}

function resolveResponsive<T>(
    value: Responsive<T>,
    keys: BreakpointKey[]
): Partial<Record<BreakpointKey, T>> {
    if (!isResponsiveObject(value)) {
        return Object.fromEntries(keys.map(key => [key, value])) as Partial<
            Record<BreakpointKey, T>
        >;
    }
    const resolved: Partial<Record<BreakpointKey, T>> = {};
    let previous: T | undefined;
    for (const key of breakpointKeys) {
        const current = value[key];
        if (current !== undefined) previous = current;
        if (keys.includes(key) && previous !== undefined) resolved[key] = previous;
    }
    return resolved;
}

function toLength(value: number | string): string {
    return typeof value === 'number' ? `${value * 8}px` : value;
}

function joinChildren(children: ReactNode, separator: ReactNode): ReactNode[] {
    const valid = Children.toArray(children).filter(Boolean);
    return valid.reduce<ReactNode[]>((output, child, index) => {
        output.push(child);
        if (index < valid.length - 1) {
            output.push(
                <Fragment key={`separator-${index}`}>
                    {isValidElement(separator) ? separator : <>{separator}</>}
                </Fragment>
            );
        }
        return output;
    }, []);
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
    {
        direction = 'column',
        spacing = 0,
        divider,
        useFlexGap = false,
        component,
        className,
        style,
        children,
        ...other
    },
    ref
) {
    const depth = useContext(StackDepthContext);
    const namespace: StackNamespace = depth % 2 === 0 ? 'a' : 'b';
    const Component = component ?? 'div';
    const classes: string[] = ['flex flex-col'];
    const vars: Record<string, string> = {};
    const directionValues = isResponsiveObject(direction) ? direction : { xs: direction };
    for (const key of breakpointKeys) {
        const value = directionValues[key];
        if (value) classes.push(directionClasses[key][value]);
    }
    const hasSpacing = isResponsiveObject(spacing)
        ? Object.values(spacing).some(value => value !== undefined && value !== 0)
        : Boolean(spacing);
    if (hasSpacing) {
        const keys = breakpointKeys.filter(
            key =>
                key === 'xs' ||
                (isResponsiveObject(spacing) && spacing[key] !== undefined) ||
                (isResponsiveObject(direction) && direction[key] !== undefined)
        );
        const spacingByKey = resolveResponsive(spacing, keys);
        const directionByKey = resolveResponsive<StackDirection>(direction, keys);
        if (!useFlexGap) classes.push('[&>:not(style):not(style)]:m-0');
        for (const key of keys) {
            const space = spacingByKey[key];
            if (space === undefined) continue;
            if (useFlexGap) {
                classes.push(gapClasses[key]);
                vars[`--stack-${key}-gap`] = toLength(space);
                continue;
            }
            const side = sideByDirection[directionByKey[key] ?? 'column'];
            classes.push(marginClasses[namespace][key]);
            for (const edge of ['t', 'r', 'b', 'l'] as const) {
                vars[`--stack-${namespace}-${key}-${edge}`] =
                    edge === side ? toLength(space) : '0px';
            }
        }
    }
    return (
        <Component
            ref={ref}
            className={cn(classes.join(' '), className)}
            style={{ ...(vars as CSSProperties), ...style }}
            {...other}
        >
            <StackDepthContext.Provider value={depth + 1}>
                {divider ? joinChildren(children, divider) : children}
            </StackDepthContext.Provider>
        </Component>
    );
});
