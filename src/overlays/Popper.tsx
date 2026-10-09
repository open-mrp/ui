'use client';

import {
    autoUpdate,
    flip,
    limitShift,
    offset as offsetMiddleware,
    shift,
    useFloating,
    type Placement,
} from '@floating-ui/react-dom';
import { forwardRef, useLayoutEffect, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Portal } from './Modal';
import { useForkRef } from '@/hooks/use-fork-ref';
import { usePresence } from '@/hooks/use-presence';

export type PopperPlacement = Placement;

export interface VirtualElement {
    getBoundingClientRect: () => DOMRect;
    contextElement?: Element;
}

export type PopperAnchor =
    | Element
    | VirtualElement
    | null
    | undefined
    | (() => Element | VirtualElement | null | undefined);

export interface PopperChildProps {
    placement: PopperPlacement;
    TransitionProps: { in: boolean };
}

export interface PopperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
    open: boolean;
    anchorEl?: PopperAnchor;
    placement?: PopperPlacement;
    transition?: boolean;
    keepMounted?: boolean;
    disablePortal?: boolean;
    offset?: number;
    flip?: boolean;
    children?: ReactNode | ((props: PopperChildProps) => ReactNode);
}

export const Popper = forwardRef<HTMLDivElement, PopperProps>(function Popper(
    {
        open,
        anchorEl,
        placement = 'bottom',
        transition = false,
        keepMounted = false,
        disablePortal = false,
        offset = 0,
        flip: allowFlip = true,
        className,
        style,
        children,
        ...other
    },
    ref
) {
    const { mounted } = usePresence(open, transition ? 250 : 0);
    const {
        refs: { setReference, setFloating },
        floatingStyles,
        placement: resolvedPlacement,
    } = useFloating({
        placement,
        strategy: 'absolute',
        open: mounted,
        middleware: [
            offsetMiddleware(offset),
            ...(allowFlip ? [flip()] : []),
            shift({ limiter: limitShift() }),
        ],
        whileElementsMounted: autoUpdate,
    });
    const attachFloating = useForkRef(setFloating, ref);
    const resolvedAnchor = typeof anchorEl === 'function' ? anchorEl() : anchorEl;
    useLayoutEffect(() => {
        setReference(resolvedAnchor ?? null);
    }, [setReference, resolvedAnchor]);
    const visible = transition ? mounted : open;
    if (!visible && !keepMounted) return null;
    const content =
        typeof children === 'function'
            ? children({ placement: resolvedPlacement, TransitionProps: { in: open } })
            : children;
    return (
        <Portal disablePortal={disablePortal}>
            <div
                ref={attachFloating}
                role="tooltip"
                data-popper-placement={resolvedPlacement}
                className={cn(!visible && 'hidden', className)}
                style={{ ...floatingStyles, ...style }}
                {...other}
            >
                {content}
            </div>
        </Portal>
    );
});
