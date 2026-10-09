import { useCallback, useLayoutEffect, useRef, type Ref, type RefCallback } from 'react';

export function setRef<T>(ref: Ref<T> | undefined | null, value: T | null): void {
    if (typeof ref === 'function') {
        ref(value);
        return;
    }
    if (ref) {
        (ref as { current: T | null }).current = value;
    }
}

export function useForkRef<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
    const refsRef = useRef(refs);
    useLayoutEffect(() => {
        refsRef.current = refs;
    });
    return useCallback((value: T | null) => {
        refsRef.current.forEach(ref => setRef(ref, value));
    }, []);
}
