'use client';

import {
    forwardRef,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import type { BivariantCallback } from '@/theme/types';
import { useForkRef } from '@/hooks/use-fork-ref';

export type SnackbarCloseReason = 'timeout' | 'clickaway' | 'escapeKeyDown';

export interface SnackbarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClose'> {
    open?: boolean;
    autoHideDuration?: number | null;
    onClose?: BivariantCallback<
        [event: Event | React.SyntheticEvent | null, reason: SnackbarCloseReason]
    >;
    anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
    message?: ReactNode;
    action?: ReactNode;
    disableWindowBlurListener?: boolean;
}

const verticalClasses = {
    top: 'top-2 screen-sm:top-6',
    bottom: 'bottom-2 screen-sm:bottom-6',
};

const horizontalClasses = {
    left: 'justify-start screen-sm:left-6 screen-sm:right-auto',
    center: 'justify-center screen-sm:left-1/2 screen-sm:right-auto screen-sm:-translate-x-1/2',
    right: 'justify-end screen-sm:right-6 screen-sm:left-auto',
};

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
    {
        open = false,
        autoHideDuration = null,
        onClose,
        anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
        message,
        action,
        disableWindowBlurListener = false,
        className,
        children,
        onMouseEnter,
        onMouseLeave,
        ...other
    },
    ref
) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(rootRef, ref);
    const [timer, setTimer] = useState({ running: true, factor: 1 });
    const [previousOpen, setPreviousOpen] = useState(open);
    if (previousOpen !== open) {
        setPreviousOpen(open);
        setTimer({ running: true, factor: 1 });
    }
    const handleClose = useEffectEvent(
        (event: Event | null, reason: SnackbarCloseReason) => onClose?.(event, reason)
    );

    useEffect(() => {
        if (!open || !timer.running || autoHideDuration == null) return;
        const id = setTimeout(() => handleClose(null, 'timeout'), autoHideDuration * timer.factor);
        return () => clearTimeout(id);
    }, [open, timer, autoHideDuration]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !event.defaultPrevented)
                handleClose(event, 'escapeKeyDown');
        };
        const handlePointer = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                handleClose(event, 'clickaway');
            }
        };
        const frame = requestAnimationFrame(() => {
            document.addEventListener('click', handlePointer);
        });
        document.addEventListener('keydown', handleKey);
        const pause = () => setTimer({ running: false, factor: 1 });
        const resume = () => setTimer({ running: true, factor: 0.5 });
        if (!disableWindowBlurListener) {
            window.addEventListener('blur', pause);
            window.addEventListener('focus', resume);
        }
        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('click', handlePointer);
            document.removeEventListener('keydown', handleKey);
            window.removeEventListener('blur', pause);
            window.removeEventListener('focus', resume);
        };
    }, [open, disableWindowBlurListener]);

    if (!open) return null;

    return (
        <div
            ref={handleRef}
            role="presentation"
            className={cn(
                'fixed left-2 right-2 z-[1400] flex items-center animate-grow-in',
                verticalClasses[anchorOrigin.vertical],
                horizontalClasses[anchorOrigin.horizontal],
                className
            )}
            onMouseEnter={event => {
                setTimer({ running: false, factor: 1 });
                onMouseEnter?.(event);
            }}
            onMouseLeave={event => {
                setTimer({ running: true, factor: 1 });
                onMouseLeave?.(event);
            }}
            {...other}
        >
            {children ?? (
                <div
                    role="alert"
                    className="flex grow flex-wrap items-center rounded-lg bg-snackbar px-4 py-1.5 font-plex-sans text-[0.875rem] leading-[1.57] text-white shadow-elevation-6 dark:text-black/87 screen-sm:min-w-[288px] screen-sm:grow-0"
                >
                    <div className="py-2">{message}</div>
                    {action ? (
                        <div className="-mr-2 ml-auto flex items-center pl-4">{action}</div>
                    ) : null}
                </div>
            )}
        </div>
    );
});
