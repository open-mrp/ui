"use client";

import { useEffect, useState } from "react";

const DARK_MODE_KEY = "dark";
const LIGHT_MODE_KEY = "light";

// Helper to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const setLocalStorageItem = (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore errors
    }
};

const hasLocalStorageKey = (key: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
        return key in localStorage;
    } catch {
        return false;
    }
};

export function useDarkMode() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check if dark mode is enabled in localStorage or system preference
        const theme = getLocalStorageItem("theme");
        const isDarkMode =
            theme === DARK_MODE_KEY ||
            (!hasLocalStorageKey("theme") &&
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        setIsDark(isDarkMode);
        if (typeof document !== "undefined") {
            if (isDarkMode) {
                document.documentElement.classList.add(DARK_MODE_KEY);
            } else {
                document.documentElement.classList.remove(DARK_MODE_KEY);
            }
        }
    }, []);

    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (typeof document !== "undefined") {
            if (newIsDark) {
                document.documentElement.classList.add(DARK_MODE_KEY);
            } else {
                document.documentElement.classList.remove(DARK_MODE_KEY);
            }
        }
        setLocalStorageItem(
            "theme",
            newIsDark ? DARK_MODE_KEY : LIGHT_MODE_KEY
        );
    };

    return { isDark, toggleDarkMode };
}
