import { act, renderHook } from '@testing-library/react';
import { useSidenavState } from './useSidenavStore';

const STORAGE_KEY = 'openmrp-sidenav-state';

describe('useSidenavState', () => {
    it('reads the persisted value written by earlier versions', () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { isCollapsed: true }, version: 0 }),
        );
        const { result } = renderHook(() => useSidenavState());

        expect(result.current.isCollapsed).toBe(true);
        expect(result.current.isHydrated).toBe(true);
    });

    it('toggles, notifies every subscriber and persists the same format', () => {
        const first = renderHook(() => useSidenavState());
        const second = renderHook(() => useSidenavState());
        expect(first.result.current.isCollapsed).toBe(true);

        act(() => first.result.current.toggleCollapsed());

        expect(first.result.current.isCollapsed).toBe(false);
        expect(second.result.current.isCollapsed).toBe(false);
        expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({
            state: { isCollapsed: false },
            version: 0,
        });

        act(() => second.result.current.setCollapsed(true));
        expect(first.result.current.isCollapsed).toBe(true);
    });
});
