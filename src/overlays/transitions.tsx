'use client';

import {
    cloneElement,
    forwardRef,
    isValidElement,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactElement,
} from 'react';
import { cn } from '@/utils/cn';
import { useForkRef } from '@/hooks/use-fork-ref';
import { usePresence } from '@/hooks/use-presence';

type TransitionTimeout = number | 'auto' | { enter?: number; exit?: number; appear?: number };

interface TransitionChildProps {
    className?: string;
    style?: CSSProperties;
}

export interface FadeProps {
    in?: boolean;
    appear?: boolean;
    timeout?: number | { enter?: number; exit?: number };
    unmountOnExit?: boolean;
    children: ReactElement<TransitionChildProps>;
}

function resolveTimeout(
    timeout: TransitionTimeout | undefined,
    phase: 'enter' | 'exit',
    fallback: number
): number {
    if (typeof timeout === 'number') return timeout;
    if (timeout && typeof timeout === 'object') return timeout[phase] ?? fallback;
    return fallback;
}

export function Fade({
    in: inProp = false,
    appear = true,
    timeout,
    unmountOnExit = false,
    children,
}: FadeProps) {
    const enter = resolveTimeout(timeout, 'enter', 225);
    const exit = resolveTimeout(timeout, 'exit', 195);
    const { mounted, state } = usePresence(inProp, exit);
    const [initial] = useState(inProp && !appear);
    if (!mounted && unmountOnExit) return null;
    if (!isValidElement(children)) return null;
    const visible = state === 'open';
    return cloneElement(children, {
        className: cn(
            children.props.className,
            visible && !initial && 'animate-fade-in',
            !visible && 'animate-fade-out',
            !visible && !mounted && 'invisible'
        ),
        style: {
            ...children.props.style,
            animationDuration: `${visible ? enter : exit}ms`,
            ...(visible ? {} : { opacity: 0 }),
        },
    });
}

export interface GrowProps {
    in?: boolean;
    appear?: boolean;
    timeout?: number | 'auto';
    unmountOnExit?: boolean;
    style?: CSSProperties;
    children: ReactElement<TransitionChildProps>;
}

export function Grow({
    in: inProp = false,
    appear = true,
    timeout = 'auto',
    unmountOnExit = false,
    style,
    children,
}: GrowProps) {
    const duration = typeof timeout === 'number' ? timeout : 250;
    const { mounted, state } = usePresence(inProp, duration);
    const [initial] = useState(inProp && !appear);
    if (!mounted && unmountOnExit) return null;
    if (!isValidElement(children)) return null;
    const visible = state === 'open';
    return cloneElement(children, {
        className: cn(
            children.props.className,
            visible && !initial && 'animate-grow-in',
            !visible && 'animate-grow-out',
            !visible && !mounted && 'invisible'
        ),
        style: { ...style, ...children.props.style, animationDuration: `${duration}ms` },
    });
}

export function getAutoHeightDuration(height: number): number {
    if (!height) return 0;
    const constant = height / 36;
    return Math.min(Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10), 3000);
}

export interface CollapseProps extends ComponentPropsWithoutRef<'div'> {
    in?: boolean;
    timeout?: TransitionTimeout;
    unmountOnExit?: boolean;
    collapsedSize?: number | string;
    appear?: boolean;
    orientation?: 'vertical' | 'horizontal';
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
    {
        in: inProp = false,
        timeout = 300,
        unmountOnExit = false,
        collapsedSize = 0,
        appear = false,
        orientation = 'vertical',
        className,
        style,
        children,
        ...other
    },
    ref
) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(rootRef, ref);
    const horizontal = orientation === 'horizontal';
    const dimension = horizontal ? 'width' : 'height';
    const collapsed = typeof collapsedSize === 'number' ? `${collapsedSize}px` : collapsedSize;
    const [initiallyOpen] = useState(inProp && !appear);
    const [initiallyHidden] = useState(!(inProp && !appear) && collapsed === '0px');
    const [exited, setExited] = useState(!inProp);
    const [previousIn, setPreviousIn] = useState(inProp);
    if (previousIn !== inProp) {
        setPreviousIn(inProp);
        if (inProp) setExited(false);
    }
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const firstRun = useRef(true);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const wrapper = wrapperRef.current;
        if (!root || !wrapper) return;
        const skip = firstRun.current && !(inProp && appear);
        firstRun.current = false;
        if (skip) return;
        const measure = () => (horizontal ? wrapper.clientWidth : wrapper.clientHeight);
        clearTimeout(timer.current);
        if (inProp) {
            root.style.visibility = '';
            root.style.overflow = 'hidden';
            root.style.transitionDuration = '0ms';
            root.style[dimension] = collapsed;
            const target = measure();
            const ms =
                timeout === 'auto'
                    ? getAutoHeightDuration(target)
                    : resolveTimeout(timeout, 'enter', 300);
            void root.offsetHeight;
            root.style.transitionDuration = `${ms}ms`;
            root.style[dimension] = `${target}px`;
            timer.current = setTimeout(() => {
                root.style[dimension] = 'auto';
                root.style.overflow = 'visible';
            }, ms);
        } else {
            const current = measure();
            const ms =
                timeout === 'auto'
                    ? getAutoHeightDuration(current)
                    : resolveTimeout(timeout, 'exit', 300);
            root.style.overflow = 'hidden';
            root.style.transitionDuration = '0ms';
            root.style[dimension] = `${current}px`;
            void root.offsetHeight;
            root.style.transitionDuration = `${ms}ms`;
            root.style[dimension] = collapsed;
            timer.current = setTimeout(() => {
                if (collapsed === '0px') root.style.visibility = 'hidden';
                setExited(true);
            }, ms);
        }
        return () => clearTimeout(timer.current);
    }, [inProp, appear, timeout, collapsed, horizontal, dimension]);

    if (unmountOnExit && exited && !inProp) return null;

    const initialSize = initiallyOpen ? 'auto' : collapsed;

    return (
        <div
            ref={handleRef}
            className={cn(
                horizontal ? 'transition-[width]' : 'transition-[height]',
                'ease-standard',
                initiallyOpen ? 'overflow-visible' : 'overflow-hidden',
                className
            )}
            style={{
                [dimension]: initialSize,
                [horizontal ? 'minWidth' : 'minHeight']: collapsed,
                visibility: initiallyHidden ? 'hidden' : undefined,
                ...style,
            }}
            {...other}
        >
            <div ref={wrapperRef} className={cn('flex', horizontal ? 'h-full w-auto' : 'w-full')}>
                <div className={horizontal ? 'h-full w-auto' : 'w-full'}>{children}</div>
            </div>
        </div>
    );
});
