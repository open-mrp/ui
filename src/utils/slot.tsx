import {
    cloneElement,
    forwardRef,
    isValidElement,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    type Ref,
} from 'react';
import { useForkRef } from '@/hooks/use-fork-ref';
import { cn } from './cn';

type AnyProps = Record<string, unknown>;

export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
    const merged: AnyProps = { ...slotProps, ...childProps };
    for (const key of Object.keys(slotProps)) {
        const slotValue = slotProps[key];
        const childValue = childProps[key];
        if (/^on[A-Z]/.test(key) && typeof slotValue === 'function') {
            merged[key] =
                typeof childValue === 'function'
                    ? (...args: unknown[]) => {
                          const result = (childValue as (...a: unknown[]) => unknown)(...args);
                          (slotValue as (...a: unknown[]) => unknown)(...args);
                          return result;
                      }
                    : slotValue;
        } else if (key === 'className') {
            merged[key] = cn(slotValue as string, childValue as string);
        } else if (key === 'style') {
            merged[key] = { ...(slotValue as CSSProperties), ...(childValue as CSSProperties) };
        }
    }
    return merged;
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot({ children, ...props }, ref) {
    const child = isValidElement<AnyProps & { ref?: Ref<HTMLElement> }>(children) ? children : null;
    const handleRef = useForkRef<HTMLElement>(ref, child?.props.ref);
    if (!child) return null;
    return cloneElement(child, { ...mergeSlotProps(props, child.props), ref: handleRef });
});
