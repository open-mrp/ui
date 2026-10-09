import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { debounce } from '@/utils/debounce';
import { Modal, type ModalProps } from './Modal';
import { elevationClasses } from '@/layout/Paper';
import { useForkRef } from '@/hooks/use-fork-ref';

export interface PopoverOrigin {
    vertical: 'top' | 'center' | 'bottom' | number;
    horizontal: 'left' | 'center' | 'right' | number;
}

export type PopoverAnchor = HTMLElement | null | undefined | (() => HTMLElement | null | undefined);

export interface PopoverProps extends Omit<
    ModalProps,
    'children' | 'contentClassName' | 'contentIsBackdrop' | 'exitDuration'
> {
    anchorEl?: PopoverAnchor;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
    anchorReference?: 'anchorEl' | 'anchorPosition' | 'none';
    anchorPosition?: { top: number; left: number };
    marginThreshold?: number | null;
    elevation?: number;
    transitionDuration?: number | 'auto';
    paperClassName?: string;
    paperProps?: ComponentPropsWithoutRef<'div'> & { ref?: React.Ref<HTMLDivElement> };
    paperRef?: React.Ref<HTMLDivElement>;
    children?: ReactNode;
    onEntered?: () => void;
}

function resolveAnchorEl(anchorEl: PopoverAnchor): HTMLElement | null {
    const resolved = typeof anchorEl === 'function' ? anchorEl() : anchorEl;
    return resolved ?? null;
}

function getOffsetTop(rect: { height: number }, vertical: PopoverOrigin['vertical']): number {
    if (typeof vertical === 'number') return vertical;
    if (vertical === 'center') return rect.height / 2;
    if (vertical === 'bottom') return rect.height;
    return 0;
}

function getOffsetLeft(rect: { width: number }, horizontal: PopoverOrigin['horizontal']): number {
    if (typeof horizontal === 'number') return horizontal;
    if (horizontal === 'center') return rect.width / 2;
    if (horizontal === 'right') return rect.width;
    return 0;
}

function samePosition(a: CSSProperties, b: CSSProperties): boolean {
    return a.top === b.top && a.left === b.left && a.transformOrigin === b.transformOrigin;
}

function transformOriginValue(origin: { vertical: number; horizontal: number }): string {
    return `${origin.horizontal}px ${origin.vertical}px`;
}

export function getAutoGrowDuration(height: number): number {
    if (!height) return 0;
    const constant = height / 36;
    return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export const popoverPaperClasses =
    'absolute overflow-x-hidden overflow-y-auto min-w-4 min-h-4 max-w-[calc(100%-32px)] max-h-[calc(100%-32px)] outline-0 rounded-lg text-fg border border-solid border-divider bg-blur backdrop-blur-[24px] transition-shadow duration-300 ease-standard';

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
    {
        open,
        anchorEl,
        anchorOrigin = { vertical: 'top', horizontal: 'left' },
        transformOrigin = { vertical: 'top', horizontal: 'left' },
        anchorReference = 'anchorEl',
        anchorPosition,
        marginThreshold = 16,
        elevation = 16,
        transitionDuration = 'auto',
        paperClassName,
        paperProps,
        paperRef: paperRefProp,
        children,
        onEntered,
        ...other
    },
    ref
) {
    const paperRef = useRef<HTMLDivElement | null>(null);
    const handlePaperRef = useForkRef(paperRef, paperRefProp, paperProps?.ref);
    const [position, setPosition] = useState<CSSProperties>({});
    const [duration, setDuration] = useState(
        typeof transitionDuration === 'number' ? transitionDuration : 250
    );

    const computePosition = useCallback((): CSSProperties | null => {
        const element = paperRef.current;
        if (!element) return null;
        const elemRect = { width: element.offsetWidth, height: element.offsetHeight };
        const origin = {
            vertical: getOffsetTop(elemRect, transformOrigin.vertical),
            horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal),
        };
        if (anchorReference === 'none') return { transformOrigin: transformOriginValue(origin) };
        let anchorOffset: { top: number; left: number };
        if (anchorReference === 'anchorPosition') {
            anchorOffset = anchorPosition ?? { top: 0, left: 0 };
        } else {
            const anchor = resolveAnchorEl(anchorEl) ?? document.body;
            const rect = anchor.getBoundingClientRect();
            anchorOffset = {
                top: rect.top + getOffsetTop(rect, anchorOrigin.vertical),
                left: rect.left + getOffsetLeft(rect, anchorOrigin.horizontal),
            };
        }
        let top = anchorOffset.top - origin.vertical;
        let left = anchorOffset.left - origin.horizontal;
        const bottom = top + elemRect.height;
        const right = left + elemRect.width;
        const heightThreshold = window.innerHeight - (marginThreshold ?? 0);
        const widthThreshold = window.innerWidth - (marginThreshold ?? 0);
        if (marginThreshold != null && top < marginThreshold) {
            const diff = top - marginThreshold;
            top -= diff;
            origin.vertical += diff;
        } else if (marginThreshold != null && bottom > heightThreshold) {
            const diff = bottom - heightThreshold;
            top -= diff;
            origin.vertical += diff;
        }
        if (marginThreshold != null && left < marginThreshold) {
            const diff = left - marginThreshold;
            left -= diff;
            origin.horizontal += diff;
        } else if (right > widthThreshold) {
            const diff = right - widthThreshold;
            left -= diff;
            origin.horizontal += diff;
        }
        return {
            top: `${Math.round(top)}px`,
            left: `${Math.round(left)}px`,
            transformOrigin: transformOriginValue(origin),
        };
    }, [
        anchorEl,
        anchorOrigin.horizontal,
        anchorOrigin.vertical,
        anchorPosition,
        anchorReference,
        marginThreshold,
        transformOrigin.horizontal,
        transformOrigin.vertical,
    ]);

    useLayoutEffect(() => {
        if (!open) return;
        const frame = requestAnimationFrame(() => {
            const next = computePosition();
            if (next) setPosition(previous => (samePosition(previous, next) ? previous : next));
            if (transitionDuration === 'auto' && paperRef.current) {
                setDuration(getAutoGrowDuration(paperRef.current.clientHeight));
            }
        });
        const element = paperRef.current;
        if (element) {
            const next = computePosition();
            if (next) {
                element.style.top = String(next.top ?? '');
                element.style.left = String(next.left ?? '');
                element.style.transformOrigin = String(next.transformOrigin ?? '');
            }
        }
        return () => cancelAnimationFrame(frame);
    }, [open, computePosition, transitionDuration]);

    useEffect(() => {
        if (!open) return;
        const handleResize = debounce(() => {
            const next = computePosition();
            if (next) setPosition(previous => (samePosition(previous, next) ? previous : next));
        });
        window.addEventListener('resize', handleResize);
        return () => {
            handleResize.clear();
            window.removeEventListener('resize', handleResize);
        };
    }, [open, computePosition]);

    useEffect(() => {
        if (!open || !onEntered) return;
        const timer = setTimeout(onEntered, duration);
        return () => clearTimeout(timer);
    }, [open, onEntered, duration]);

    const animate = transitionDuration !== 0;

    return (
        <Modal ref={ref} open={open} exitDuration={animate ? duration : 0} {...other}>
            {state => (
                <div
                    data-slot="popover-paper"
                    {...paperProps}
                    ref={handlePaperRef}
                    className={cn(
                        popoverPaperClasses,
                        elevationClasses[elevation],
                        animate &&
                            (state === 'open' ? 'animate-grow-in' : 'animate-grow-out'),
                        !animate && state === 'closed' && 'invisible',
                        paperProps?.className,
                        paperClassName
                    )}
                    style={{
                        ...position,
                        animationDuration: animate ? `${duration}ms` : undefined,
                        ...paperProps?.style,
                    }}
                >
                    {children}
                </div>
            )}
        </Modal>
    );
});
