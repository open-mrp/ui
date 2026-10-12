import { useEffect, useEffectEvent } from 'react';

export type DismissReason = 'escapeKeyDown' | 'outsidePointer' | 'outsideFocus';

interface Layer {
    contains: (node: Node) => boolean;
}

const layers: Layer[] = [];

export interface DismissableLayerOptions {
    enabled: boolean;
    getInsideElements: () => Array<Element | null | undefined>;
    onDismiss: (event: Event, reason: DismissReason) => void;
    dismissOnFocusOutside?: boolean;
}

export function useDismissableLayer({
    enabled,
    getInsideElements,
    onDismiss,
    dismissOnFocusOutside = true,
}: DismissableLayerOptions) {
    const handleDismiss = useEffectEvent(onDismiss);
    const isInside = useEffectEvent((node: Node) =>
        getInsideElements().some((element) => element?.contains(node)),
    );

    useEffect(() => {
        if (!enabled) return;
        const layer: Layer = { contains: (node) => isInside(node) };
        layers.push(layer);
        const isInsideLayerAbove = (node: Node) =>
            layers.slice(layers.indexOf(layer) + 1).some((above) => above.contains(node));
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.isComposing) return;
            if (layers[layers.length - 1] !== layer) return;
            event.preventDefault();
            event.stopPropagation();
            handleDismiss(event, 'escapeKeyDown');
        };
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node) || !target.isConnected) return;
            if (isInside(target) || isInsideLayerAbove(target)) return;
            handleDismiss(event, 'outsidePointer');
        };
        const handleFocusIn = (event: FocusEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (isInside(target) || isInsideLayerAbove(target)) return;
            handleDismiss(event, 'outsideFocus');
        };
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('pointerdown', handlePointerDown, true);
        if (dismissOnFocusOutside) document.addEventListener('focusin', handleFocusIn);
        return () => {
            layers.splice(layers.indexOf(layer), 1);
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('focusin', handleFocusIn);
        };
    }, [enabled, dismissOnFocusOutside]);
}
