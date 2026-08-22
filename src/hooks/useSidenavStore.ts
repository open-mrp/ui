'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidenavState {
    isCollapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    toggleCollapsed: () => void;
}

export const useSidenavStore = create<SidenavState>()(
    persist(
        (set) => ({
            isCollapsed: false,
            setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
            toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
        }),
        {
            name: 'openmrp-sidenav-state',
        },
    ),
);

/**
 * Hook to safely use sidenav state with SSR.
 * Returns the hydrated state only after the client has mounted.
 */
export function useSidenavState() {
    const store = useSidenavStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return {
        ...store,
        // During SSR and initial hydration, always return false to avoid mismatch
        isCollapsed: isHydrated ? store.isCollapsed : false,
        isHydrated,
    };
}
