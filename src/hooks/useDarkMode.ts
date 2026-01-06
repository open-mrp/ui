'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DARK_MODE_KEY = 'dark';
const LIGHT_MODE_KEY = 'light';
const THEME_CHANGE_EVENT = 'augno-theme-change';

type StorageLike = {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
};

type UseDarkModeOptions = {
    /**
     * Storage implementation to use for persisting theme.
     * - Pass `null` to completely disable persistence.
     * - Leave undefined to let the hook safely detect `localStorage` when available.
     */
    storage?: StorageLike | null;
    /**
     * Key to use when reading/writing the theme in storage.
     * Set to `null` to avoid touching storage even if it exists.
     */
    storageKey?: string | null;
};

// Helper to safely obtain a browser storage instance without assuming `window` or `localStorage`
const getBrowserStorage = (): StorageLike | null => {
    if (typeof globalThis === 'undefined') return null;

    try {
        const maybeWindow = globalThis as typeof globalThis & {
            localStorage?: unknown;
        };

        const candidate = maybeWindow.localStorage as
            | (StorageLike & { [key: string]: unknown })
            | undefined;

        if (!candidate) return null;

        // Guard against environments where `localStorage` exists but is not a Web Storage‑like object
        if (typeof candidate.getItem !== 'function' || typeof candidate.setItem !== 'function') {
            return null;
        }

        // Touch localStorage inside try/catch in case access throws (e.g. opaque origins)
        const testKey = '__augno_theme_test__';
        candidate.setItem(testKey, '1');
        candidate.setItem(testKey, '0');

        return candidate;
    } catch {
        return null;
    }
};

const readThemeFromStorage = (storage: StorageLike | null, key: string | null): string | null => {
    if (!storage || !key) return null;
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
};

const writeThemeToStorage = (
    storage: StorageLike | null,
    key: string | null,
    value: string,
): void => {
    if (!storage || !key) return;
    try {
        storage.setItem(key, value);
    } catch {
        // Ignore errors – persistence is a best-effort enhancement
    }
};

export function useDarkMode(options?: UseDarkModeOptions) {
    const [isDark, setIsDark] = useState(false);
    // Track whether the component has mounted and theme detection is complete
    const [hasMounted, setHasMounted] = useState(false);
    // Track if this instance is currently dispatching to avoid self-notification
    const isDispatchingRef = useRef(false);

    // Initialize theme on mount
    useEffect(() => {
        const storage = options?.storage ?? getBrowserStorage();
        const storageKey = options?.storageKey ?? 'theme';

        const theme = readThemeFromStorage(storage, storageKey);

        const prefersDark =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDarkMode = theme === DARK_MODE_KEY || (!theme && prefersDark === true);

        setIsDark(isDarkMode);
        setHasMounted(true);

        if (typeof document !== 'undefined') {
            if (isDarkMode) {
                document.documentElement.classList.add(DARK_MODE_KEY);
            } else {
                document.documentElement.classList.remove(DARK_MODE_KEY);
            }
        }
    }, [options?.storage, options?.storageKey]);

    // Listen for theme changes from other components
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleThemeChange = (event: Event) => {
            // Skip if we're the one who dispatched this event
            if (isDispatchingRef.current) return;

            const customEvent = event as CustomEvent<{ isDark: boolean }>;
            setIsDark(customEvent.detail.isDark);
        };

        window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        return () => {
            window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        };
    }, []);

    const toggleDarkMode = useCallback(() => {
        setIsDark((prevIsDark) => {
            const newIsDark = !prevIsDark;

            if (typeof document !== 'undefined') {
                if (newIsDark) {
                    document.documentElement.classList.add(DARK_MODE_KEY);
                } else {
                    document.documentElement.classList.remove(DARK_MODE_KEY);
                }
            }

            const storage = options?.storage ?? getBrowserStorage();
            const storageKey = options?.storageKey ?? 'theme';

            writeThemeToStorage(storage, storageKey, newIsDark ? DARK_MODE_KEY : LIGHT_MODE_KEY);

            // Dispatch custom event asynchronously to notify other components
            // Using queueMicrotask to avoid "Cannot update a component while rendering" errors
            if (typeof window !== 'undefined') {
                queueMicrotask(() => {
                    isDispatchingRef.current = true;
                    window.dispatchEvent(
                        new CustomEvent(THEME_CHANGE_EVENT, {
                            detail: { isDark: newIsDark },
                        }),
                    );
                    isDispatchingRef.current = false;
                });
            }

            return newIsDark;
        });
    }, [options?.storage, options?.storageKey]);

    return { isDark, hasMounted, toggleDarkMode };
}
