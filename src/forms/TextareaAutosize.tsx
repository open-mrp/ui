import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    type ComponentPropsWithoutRef,
} from 'react';
import { debounce } from '@/utils/debounce';
import { useForkRef } from '@/hooks/use-fork-ref';

export interface TextareaAutosizeProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'rows'> {
    minRows?: number;
    maxRows?: number;
}

function getStyleValue(value: string): number {
    return parseInt(value, 10) || 0;
}

export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
    function TextareaAutosize({ minRows = 1, maxRows, style, value, onChange, ...other }, ref) {
        const inputRef = useRef<HTMLTextAreaElement | null>(null);
        const shadowRef = useRef<HTMLTextAreaElement | null>(null);
        const handleRef = useForkRef(inputRef, ref);
        const appliedHeight = useRef<number | null>(null);
        const draggedHeight = useRef(0);

        const syncHeight = useCallback(() => {
            const input = inputRef.current;
            const shadow = shadowRef.current;
            if (!input || !shadow) return;
            const computed = window.getComputedStyle(input);
            if (computed.width === '0px') return;
            shadow.style.width = computed.width;
            shadow.value = input.value || other.placeholder || 'x';
            if (shadow.value.slice(-1) === '\n') shadow.value += ' ';
            const boxSizing = computed.boxSizing;
            const padding =
                getStyleValue(computed.paddingBottom) + getStyleValue(computed.paddingTop);
            const border =
                getStyleValue(computed.borderBottomWidth) + getStyleValue(computed.borderTopWidth);
            const innerHeight = shadow.scrollHeight;
            shadow.value = 'x';
            const singleRowHeight = shadow.scrollHeight;
            let outerHeight = innerHeight;
            if (minRows) outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
            if (maxRows) outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
            outerHeight = Math.max(outerHeight, singleRowHeight);
            const outerHeightStyle =
                outerHeight + (boxSizing === 'border-box' ? padding + border : 0);
            const overflowing = Math.abs(outerHeight - innerHeight) <= 1;
            const height = Math.max(outerHeightStyle, draggedHeight.current);
            appliedHeight.current = height;
            input.style.height = `${height}px`;
            input.style.overflow = overflowing ? 'hidden' : '';
        }, [maxRows, minRows, other.placeholder]);

        useLayoutEffect(() => {
            syncHeight();
        });

        useEffect(() => {
            const handleResize = debounce(syncHeight);
            const input = inputRef.current;
            window.addEventListener('resize', handleResize);
            const observer =
                typeof ResizeObserver !== 'undefined' && input
                    ? new ResizeObserver(() => {
                          const styled = parseFloat(input.style.height);
                          if (
                              appliedHeight.current !== null &&
                              Math.abs(styled - appliedHeight.current) > 1
                          )
                              draggedHeight.current = styled;
                          handleResize();
                      })
                    : null;
            if (observer && input) observer.observe(input);
            return () => {
                handleResize.clear();
                window.removeEventListener('resize', handleResize);
                observer?.disconnect();
            };
        }, [syncHeight]);

        return (
            <>
                <textarea
                    ref={handleRef}
                    value={value}
                    onChange={event => {
                        syncHeight();
                        onChange?.(event);
                    }}
                    rows={minRows}
                    style={style}
                    {...other}
                />
                <textarea
                    aria-hidden
                    className={other.className}
                    readOnly
                    ref={shadowRef}
                    tabIndex={-1}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        overflow: 'hidden',
                        height: 0,
                        top: 0,
                        left: 0,
                        transform: 'translateZ(0)',
                        padding: 0,
                        ...style,
                    }}
                />
            </>
        );
    }
);
