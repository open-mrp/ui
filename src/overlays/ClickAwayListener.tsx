'use client';

import {
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
    type ReactElement,
    type Ref,
} from 'react';
import { useForkRef } from '@/hooks/use-fork-ref';

export interface ClickAwayListenerProps {
    onClickAway: (event: MouseEvent | TouchEvent) => void;
    mouseEvent?: 'onClick' | 'onMouseDown' | 'onMouseUp' | 'onPointerDown' | 'onPointerUp' | false;
    touchEvent?: 'onTouchStart' | 'onTouchEnd' | false;
    children: ReactElement<{ ref?: Ref<Element> }>;
}

const mouseEventNames = {
    onClick: 'click',
    onMouseDown: 'mousedown',
    onMouseUp: 'mouseup',
    onPointerDown: 'pointerdown',
    onPointerUp: 'pointerup',
} as const;

const touchEventNames = { onTouchStart: 'touchstart', onTouchEnd: 'touchend' } as const;

export function ClickAwayListener({
    onClickAway,
    mouseEvent = 'onClick',
    touchEvent = 'onTouchEnd',
    children,
}: ClickAwayListenerProps) {
    const nodeRef = useRef<Element | null>(null);
    const activated = useRef(false);
    const callbackRef = useRef(onClickAway);
    useEffect(() => {
        callbackRef.current = onClickAway;
    });
    const childRef = isValidElement(children) ? children.props.ref : undefined;
    const handleRef = useForkRef<Element>(nodeRef, childRef);

    useEffect(() => {
        const timer = setTimeout(() => {
            activated.current = true;
        }, 0);
        return () => {
            clearTimeout(timer);
            activated.current = false;
        };
    }, []);

    useEffect(() => {
        const handler = (event: MouseEvent | TouchEvent) => {
            if (!activated.current || !nodeRef.current) return;
            const path = event.composedPath();
            if (path.includes(nodeRef.current)) return;
            if (event.target instanceof Node && !event.target.isConnected) return;
            callbackRef.current(event);
        };
        const mouseName = mouseEvent ? mouseEventNames[mouseEvent] : null;
        const touchName = touchEvent ? touchEventNames[touchEvent] : null;
        if (mouseName) document.addEventListener(mouseName, handler);
        if (touchName) document.addEventListener(touchName, handler);
        return () => {
            if (mouseName) document.removeEventListener(mouseName, handler);
            if (touchName) document.removeEventListener(touchName, handler);
        };
    }, [mouseEvent, touchEvent]);

    if (!isValidElement(children)) return null;
    return cloneElement(children, { ref: handleRef });
}
