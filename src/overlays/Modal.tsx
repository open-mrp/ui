'use client';

import {
    forwardRef,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    type ComponentPropsWithoutRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import type { BivariantCallback } from '@/theme/types';
import { useForkRef } from '@/hooks/use-fork-ref';
import { usePresence, type PresenceState } from '@/hooks/use-presence';

export type ModalCloseReason = 'backdropClick' | 'escapeKeyDown';

const modalStack: string[] = [];
let scrollLockCount = 0;
let savedBodyStyle: { overflow: string; paddingRight: string } | null = null;

function isTopModal(id: string): boolean {
    return modalStack[modalStack.length - 1] === id;
}

function getScrollbarSize(): number {
    return Math.abs(window.innerWidth - document.documentElement.clientWidth);
}

function lockScroll(): void {
    scrollLockCount += 1;
    if (scrollLockCount > 1) return;
    const body = document.body;
    savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    if (window.innerWidth > document.documentElement.clientWidth) {
        const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${current + getScrollbarSize()}px`;
    }
    body.style.overflow = 'hidden';
}

function unlockScroll(): void {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount > 0 || !savedBodyStyle) return;
    document.body.style.overflow = savedBodyStyle.overflow;
    document.body.style.paddingRight = savedBodyStyle.paddingRight;
    savedBodyStyle = null;
}

function hideSiblings(mount: HTMLElement): HTMLElement[] {
    const hidden: HTMLElement[] = [];
    Array.from(document.body.children).forEach(child => {
        if (!(child instanceof HTMLElement) || child === mount) return;
        if (['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK'].includes(child.tagName)) return;
        if (child.getAttribute('aria-hidden') === 'true') return;
        if (child.hasAttribute('aria-live')) return;
        child.setAttribute('aria-hidden', 'true');
        hidden.push(child);
    });
    return hidden;
}

const focusableSelector = [
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
].join(',');

function getTabbable(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        element =>
            element.tabIndex >= 0 &&
            !element.hasAttribute('inert') &&
            element.getClientRects().length > 0
    );
}

export interface PortalProps {
    children: ReactNode;
    disablePortal?: boolean;
    container?: HTMLElement | null;
}

export function Portal({ children, disablePortal = false, container }: PortalProps) {
    if (disablePortal || typeof document === 'undefined') return <>{children}</>;
    return createPortal(children, container ?? document.body);
}

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
    open: boolean;
    onClose?: BivariantCallback<[event: SyntheticEvent | Event, reason: ModalCloseReason]>;
    children: ReactNode | ((state: PresenceState) => ReactNode);
    keepMounted?: boolean;
    exitDuration?: number;
    hideBackdrop?: boolean;
    backdropClassName?: string;
    disableEscapeKeyDown?: boolean;
    disableAutoFocus?: boolean;
    disableEnforceFocus?: boolean;
    disableRestoreFocus?: boolean;
    disableScrollLock?: boolean;
    disablePortal?: boolean;
    container?: HTMLElement | null;
    initialFocusRef?: React.RefObject<HTMLElement | null>;
    onBackdropClick?: (event: ReactMouseEvent<HTMLDivElement>) => void;
    contentClassName?: string;
    contentIsBackdrop?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
    {
        open,
        onClose,
        children,
        keepMounted = false,
        exitDuration = 195,
        hideBackdrop = false,
        backdropClassName,
        disableEscapeKeyDown = false,
        disableAutoFocus = false,
        disableEnforceFocus = false,
        disableRestoreFocus = false,
        disableScrollLock = false,
        disablePortal = false,
        container,
        initialFocusRef,
        onBackdropClick,
        contentClassName,
        contentIsBackdrop = false,
        className,
        onKeyDown,
        ...other
    },
    ref
) {
    const id = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const handleRef = useForkRef(rootRef, ref);
    const { mounted, state } = usePresence(open, exitDuration);
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useLayoutEffect(() => {
        if (!open) return;
        const root = rootRef.current;
        if (!root) return;
        modalStack.push(id);
        if (!disableScrollLock) lockScroll();
        const hidden = hideSiblings(root);
        const previouslyFocused = document.activeElement as HTMLElement | null;
        if (!disableAutoFocus) {
            const content = contentRef.current;
            const target = initialFocusRef?.current ?? content;
            if (content && !content.contains(document.activeElement)) {
                target?.focus({ preventScroll: true });
            }
        }
        return () => {
            const index = modalStack.indexOf(id);
            if (index !== -1) modalStack.splice(index, 1);
            if (!disableScrollLock) unlockScroll();
            hidden.forEach(element => element.removeAttribute('aria-hidden'));
            if (
                !disableRestoreFocus &&
                previouslyFocused &&
                typeof previouslyFocused.focus === 'function'
            ) {
                queueMicrotask(() => {
                    if (previouslyFocused.isConnected)
                        previouslyFocused.focus({ preventScroll: true });
                });
            }
        };
    }, [open, id, disableScrollLock, disableAutoFocus, disableRestoreFocus, initialFocusRef]);

    useEffect(() => {
        if (!open || disableEnforceFocus) return;
        const handleFocusIn = (event: FocusEvent) => {
            const content = contentRef.current;
            const root = rootRef.current;
            if (!content || !root || !isTopModal(id)) return;
            const target = event.target as Element | null;
            if (target && root.contains(target)) return;
            if (
                target?.closest?.(
                    '[data-modal-content], [role=dialog], [role=tooltip]'
                )
            )
                return;
            const tabbable = getTabbable(content);
            (tabbable[0] ?? content).focus({ preventScroll: true });
        };
        document.addEventListener('focusin', handleFocusIn);
        return () => document.removeEventListener('focusin', handleFocusIn);
    }, [open, disableEnforceFocus, id]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.key === 'Tab' && !disableEnforceFocus && contentRef.current) {
            const tabbable = getTabbable(contentRef.current);
            const first = tabbable[0];
            const last = tabbable[tabbable.length - 1];
            if (!first || !last) {
                event.preventDefault();
            } else if (
                event.shiftKey &&
                (document.activeElement === first ||
                    !tabbable.includes(document.activeElement as HTMLElement))
            ) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        if (event.key !== 'Escape' || event.nativeEvent.isComposing || !isTopModal(id)) return;
        if (!disableEscapeKeyDown) {
            event.stopPropagation();
            onCloseRef.current?.(event, 'escapeKeyDown');
        }
    };

    const backdropDown = useRef<EventTarget | null>(null);

    if (!mounted && !keepMounted) return null;

    const hiddenWhenClosed = !open && !mounted;

    return (
        <Portal disablePortal={disablePortal} container={container}>
            <div
                ref={handleRef}
                role="presentation"
                className={cn('fixed inset-0 z-[1300]', hiddenWhenClosed && 'invisible', className)}
                onKeyDown={handleKeyDown}
                {...other}
            >
                {hideBackdrop ? null : (
                    <div
                        aria-hidden="true"
                        className={cn(
                            'fixed inset-0 -z-10 flex items-center justify-center bg-transparent [-webkit-tap-highlight-color:transparent]',
                            state === 'open'
                                ? 'animate-fade-in'
                                : 'animate-fade-out opacity-0',
                            backdropClassName
                        )}
                        onMouseDown={event => {
                            backdropDown.current = event.target;
                        }}
                        onClick={event => {
                            if (backdropDown.current !== event.currentTarget) return;
                            backdropDown.current = null;
                            onBackdropClick?.(event);
                            onCloseRef.current?.(event, 'backdropClick');
                        }}
                    />
                )}
                <div
                    ref={contentRef}
                    tabIndex={-1}
                    className={cn('outline-0', contentClassName)}
                    data-modal-content=""
                    onMouseDown={
                        contentIsBackdrop
                            ? event => {
                                  backdropDown.current = event.target;
                              }
                            : undefined
                    }
                    onClick={
                        contentIsBackdrop
                            ? event => {
                                  if (
                                      backdropDown.current !== event.currentTarget ||
                                      event.target !== event.currentTarget
                                  )
                                      return;
                                  backdropDown.current = null;
                                  onBackdropClick?.(event);
                                  onCloseRef.current?.(event, 'backdropClick');
                              }
                            : undefined
                    }
                >
                    {typeof children === 'function' ? children(state) : children}
                </div>
            </div>
        </Portal>
    );
});
