'use client';

import {
    autoUpdate,
    flip,
    offset as offsetMiddleware,
    shift,
    size,
    useFloating,
    type Placement,
} from '@floating-ui/react-dom';
import {
    forwardRef,
    useContext,
    useLayoutEffect,
    useRef,
    type ComponentPropsWithoutRef,
    type SyntheticEvent,
} from 'react';
import { useForkRef } from '@/hooks/use-fork-ref';
import { Modal, ModalRootContext, Portal } from './Modal';
import { overlayProps } from './overlay';
import { useDismissableLayer, type DismissReason } from './dismissable-layer';

export type AnchoredPanelSide = 'top' | 'right' | 'bottom' | 'left';
export type AnchoredPanelAlign = 'start' | 'center' | 'end';

export function toPlacement(side: AnchoredPanelSide, align: AnchoredPanelAlign): Placement {
    return (align === 'center' ? side : `${side}-${align}`) as Placement;
}

export interface AnchoredPanelProps extends ComponentPropsWithoutRef<'div'> {
    open: boolean;
    anchor: Element | null;
    side?: AnchoredPanelSide;
    align?: AnchoredPanelAlign;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    modal?: boolean;
    onDismiss?: (event: Event | SyntheticEvent, reason: DismissReason | 'backdropClick') => void;
    returnFocus?: boolean;
}

export const AnchoredPanel = forwardRef<HTMLDivElement, AnchoredPanelProps>(function AnchoredPanel(
    {
        open,
        anchor,
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionPadding = 0,
        modal = false,
        onDismiss,
        returnFocus = true,
        style,
        children,
        onFocus,
        ...other
    },
    ref,
) {
    const modalRoot = useContext(ModalRootContext);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const focusInside = useRef(false);
    const { refs, floatingStyles, placement } = useFloating({
        open,
        placement: toPlacement(side, align),
        strategy: 'fixed',
        elements: { reference: anchor },
        middleware: [
            offsetMiddleware({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
            flip({ padding: collisionPadding }),
            shift({ padding: collisionPadding }),
            size({
                padding: collisionPadding,
                apply({ availableWidth, availableHeight, rects, elements }) {
                    const target = elements.floating.style;
                    target.setProperty('--anchor-width', `${rects.reference.width}px`);
                    target.setProperty('--anchor-height', `${rects.reference.height}px`);
                    target.setProperty('--available-width', `${availableWidth}px`);
                    target.setProperty('--available-height', `${availableHeight}px`);
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    });
    const handleRef = useForkRef(panelRef, refs.setFloating, ref);

    useDismissableLayer({
        enabled: open && !modal,
        getInsideElements: () => [panelRef.current, anchor],
        onDismiss: (event, reason) => onDismiss?.(event, reason),
    });

    useLayoutEffect(() => {
        if (!open || modal || !returnFocus) return;
        focusInside.current = false;
        return () => {
            if (!focusInside.current) return;
            queueMicrotask(() => {
                const active = document.activeElement;
                if (
                    (active === null || active === document.body) &&
                    anchor instanceof HTMLElement &&
                    anchor.isConnected
                ) {
                    anchor.focus({ preventScroll: true });
                }
            });
        };
    }, [open, modal, returnFocus, anchor]);

    if (!open) return null;

    const [resolvedSide, resolvedAlign = 'center'] = placement.split('-');

    const panel = (
        <div
            ref={handleRef}
            {...overlayProps}
            data-state="open"
            data-side={resolvedSide}
            data-align={resolvedAlign}
            style={{ ...floatingStyles, ...style }}
            onFocus={(event) => {
                focusInside.current = true;
                onFocus?.(event);
            }}
            {...other}
        >
            {children}
        </div>
    );

    if (!modal) return <Portal container={modalRoot}>{panel}</Portal>;

    return (
        <Modal
            open={open}
            exitDuration={0}
            initialFocusRef={panelRef}
            disableRestoreFocus={!returnFocus}
            onClose={(event, reason) => onDismiss?.(event, reason)}
        >
            {panel}
        </Modal>
    );
});
