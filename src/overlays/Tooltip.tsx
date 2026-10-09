'use client';

import {
    arrow as arrowMiddleware,
    autoUpdate,
    flip,
    limitShift,
    offset as offsetMiddleware,
    shift,
    useFloating,
    type Placement,
} from '@floating-ui/react-dom';
import {
    cloneElement,
    isValidElement,
    useEffect,
    useId,
    useLayoutEffect,
    useState,
    type FocusEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
    type TouchEvent,
} from 'react';
import { cn } from '@/utils/cn';
import { TimerBag } from '@/utils/timers';
import { Portal } from './Modal';
import { useForkRef } from '@/hooks/use-fork-ref';
import { usePresence } from '@/hooks/use-presence';

export type TooltipPlacement = Placement;

type ChildProps = {
    ref?: Ref<HTMLElement>;
    className?: string;
    title?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    onMouseOver?: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onTouchStart?: (event: TouchEvent<HTMLElement>) => void;
    onTouchEnd?: (event: TouchEvent<HTMLElement>) => void;
};

export interface TooltipProps {
    title: ReactNode;
    children: ReactElement<ChildProps>;
    placement?: TooltipPlacement;
    arrow?: boolean;
    open?: boolean;
    onOpen?: (event: Event | React.SyntheticEvent) => void;
    onClose?: (event: Event | React.SyntheticEvent) => void;
    enterDelay?: number;
    enterNextDelay?: number;
    leaveDelay?: number;
    enterTouchDelay?: number;
    leaveTouchDelay?: number;
    disableInteractive?: boolean;
    disableHoverListener?: boolean;
    disableFocusListener?: boolean;
    disableTouchListener?: boolean;
    describeChild?: boolean;
    followCursor?: boolean;
    offset?: [skidding: number, distance: number];
    className?: string;
    tooltipClassName?: string;
    arrowClassName?: string;
    popperClassName?: string;
    id?: string;
}

let hysteresisOpen = false;
let hysteresisTimer: ReturnType<typeof setTimeout> | undefined;

const marginBySide: Record<string, string> = {
    bottom: 'mt-[14px]',
    top: 'mb-[14px]',
    left: 'mr-[14px]',
    right: 'ml-[14px]',
};

const originBySide: Record<string, string> = {
    bottom: 'origin-[center_top]',
    top: 'origin-[center_bottom]',
    left: 'origin-[right_center]',
    right: 'origin-[left_center]',
};

const arrowBySide: Record<string, string> = {
    bottom: 'top-0 -mt-[0.71em] before:origin-[0_100%]',
    top: 'bottom-0 -mb-[0.71em] before:origin-[100%_0]',
    left: 'right-0 -mr-[0.71em] h-[1em] w-[0.71em] before:origin-[0_0]',
    right: 'left-0 -ml-[0.71em] h-[1em] w-[0.71em] before:origin-[100%_100%]',
};

export function Tooltip({
    title,
    children,
    placement = 'bottom',
    arrow = false,
    open: openProp,
    onOpen,
    onClose,
    enterDelay = 100,
    enterNextDelay = 0,
    leaveDelay = 0,
    enterTouchDelay = 700,
    leaveTouchDelay = 1500,
    disableInteractive = false,
    disableHoverListener = false,
    disableFocusListener = false,
    disableTouchListener = false,
    describeChild = false,
    offset,
    className,
    tooltipClassName,
    arrowClassName,
    popperClassName,
    id: idProp,
}: TooltipProps) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [openState, setOpenState] = useState(false);
    const controlled = openProp !== undefined;
    const open = (controlled ? openProp : openState) && title !== '' && title != null;
    const [timers] = useState(() => new TimerBag());
    const [arrowElement, setArrowElement] = useState<HTMLSpanElement | null>(null);
    const { mounted, state } = usePresence(open, 200);

    const {
        refs: { setReference, setFloating },
        floatingStyles,
        placement: resolvedPlacement,
        middlewareData,
    } = useFloating({
        placement,
        open: mounted,
        middleware: [
            ...(offset ? [offsetMiddleware({ mainAxis: offset[1], crossAxis: offset[0] })] : []),
            flip(),
            shift({ limiter: limitShift() }),
            ...(arrow ? [arrowMiddleware({ element: arrowElement })] : []),
        ],
        whileElementsMounted: autoUpdate,
    });

    const childRef = isValidElement(children) ? children.props.ref : undefined;
    const attachChild = useForkRef<HTMLElement>(setReference, childRef);

    useEffect(() => () => timers.clearAll(), [timers]);

    useLayoutEffect(() => {
        if (!open) return;
        hysteresisOpen = true;
        clearTimeout(hysteresisTimer);
        return () => {
            hysteresisTimer = setTimeout(() => {
                hysteresisOpen = false;
            }, 800 + leaveDelay);
        };
    }, [open, leaveDelay]);

    const show = (event: Event | React.SyntheticEvent) => {
        if (!controlled) setOpenState(true);
        onOpen?.(event);
    };
    const hide = (event: Event | React.SyntheticEvent) => {
        if (!controlled) setOpenState(false);
        onClose?.(event);
    };

    const handleEnter = (event: React.SyntheticEvent) => {
        timers.clear('enter');
        timers.clear('leave');
        const delay = hysteresisOpen ? enterNextDelay : enterDelay;
        if (delay) {
            timers.set('enter', () => show(event), delay);
        } else {
            show(event);
        }
    };

    const handleLeave = (event: React.SyntheticEvent) => {
        timers.clear('enter');
        timers.clear('leave');
        timers.set('leave', () => hide(event), leaveDelay);
    };

    if (!isValidElement(children)) return null;

    const childProps = children.props;
    const titleIsString = typeof title === 'string';
    const side = resolvedPlacement.split('-')[0] ?? 'bottom';
    const arrowData = middlewareData.arrow;

    const clone = cloneElement(children, {
        ref: attachChild,
        className: cn(childProps.className, className),
        title: undefined,
        'aria-label': !describeChild && titleIsString ? title : childProps['aria-label'],
        'aria-describedby':
            open && (describeChild || !titleIsString) ? id : childProps['aria-describedby'],
        onMouseOver: event => {
            childProps.onMouseOver?.(event);
            if (!disableHoverListener) handleEnter(event);
        },
        onMouseLeave: event => {
            childProps.onMouseLeave?.(event);
            if (!disableHoverListener) handleLeave(event);
        },
        onFocus: event => {
            childProps.onFocus?.(event);
            if (disableFocusListener) return;
            if (event.currentTarget.matches(':focus-visible')) handleEnter(event);
        },
        onBlur: event => {
            childProps.onBlur?.(event);
            if (!disableFocusListener) handleLeave(event);
        },
        onTouchStart: event => {
            childProps.onTouchStart?.(event);
            if (disableTouchListener) return;
            timers.clear('leave');
            timers.set('touch', () => show(event), enterTouchDelay);
        },
        onTouchEnd: event => {
            childProps.onTouchEnd?.(event);
            if (disableTouchListener) return;
            timers.clear('touch');
            timers.set('leave', () => hide(event), leaveTouchDelay);
        },
    });

    return (
        <>
            {clone}
            {mounted ? (
                <Portal>
                    <div
                        ref={setFloating}
                        id={id}
                        role="tooltip"
                        data-popper-placement={resolvedPlacement}
                        className={cn(
                            'z-[1500]',
                            disableInteractive ? 'pointer-events-none' : 'pointer-events-auto',
                            popperClassName
                        )}
                        style={floatingStyles}
                        onMouseOver={disableInteractive ? undefined : handleEnter}
                        onMouseLeave={disableInteractive ? undefined : handleLeave}
                    >
                        <div
                            className={cn(
                                'm-0.5 max-w-[300px] break-words rounded-lg bg-blur px-2 py-1 font-plex-mono text-[0.6875rem] font-medium text-fg backdrop-blur-[24px]',
                                arrow && 'relative',
                                marginBySide[side],
                                originBySide[side],
                                state === 'open'
                                    ? 'animate-tooltip-in'
                                    : 'animate-tooltip-out',
                                tooltipClassName
                            )}
                        >
                            {title}
                            {arrow ? (
                                <span
                                    ref={setArrowElement}
                                    className={cn(
                                        'absolute box-border h-[0.71em] w-[1em] overflow-hidden text-blur before:m-auto before:block before:h-full before:w-full before:rotate-45 before:bg-current before:content-[""]',
                                        arrowBySide[side],
                                        arrowClassName
                                    )}
                                    style={{
                                        left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
                                        top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
                                    }}
                                />
                            ) : null}
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    );
}
