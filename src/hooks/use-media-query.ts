import { useCallback, useSyncExternalStore } from 'react';
import { breakpoints, type AppTheme, type BreakpointKey, lightTheme } from '@/theme/theme';

type MediaQueryInput = string | ((theme: AppTheme) => string);

function normalizeQuery(query: string): string {
    return query.replace(/^@media( ?)/m, '');
}

function serverSnapshot(): boolean {
    return false;
}

export interface UseMediaQueryOptions {
    defaultMatches?: boolean;
    noSsr?: boolean;
}

export function useMediaQuery(input: MediaQueryInput, _options?: UseMediaQueryOptions): boolean {
    const query = normalizeQuery(typeof input === 'function' ? input(lightTheme) : input);
    const subscribe = useCallback(
        (onChange: () => void) => {
            if (typeof window === 'undefined' || !window.matchMedia) return () => {};
            const list = window.matchMedia(query);
            list.addEventListener('change', onChange);
            return () => {
                list.removeEventListener('change', onChange);
            };
        },
        [query]
    );
    const getSnapshot = useCallback(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia(query).matches;
    }, [query]);
    return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

export function useBreakpointUp(key: BreakpointKey): boolean {
    return useMediaQuery(breakpoints.up(key));
}

export function useBreakpointDown(key: BreakpointKey): boolean {
    return useMediaQuery(breakpoints.down(key));
}

export function useBreakpointBetween(start: BreakpointKey, end: BreakpointKey): boolean {
    return useMediaQuery(breakpoints.between(start, end));
}
