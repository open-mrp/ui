'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'openmrp-sidenav-state';

const listeners = new Set<() => void>();
let collapsed: boolean | null = null;

function readCollapsed(): boolean {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw)?.state?.isCollapsed === true : false;
    } catch {
        return false;
    }
}

function getCollapsed(): boolean {
    if (collapsed === null) collapsed = readCollapsed();
    return collapsed;
}

function persist(value: boolean): void {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { isCollapsed: value }, version: 0 }),
        );
    } catch {
        return;
    }
}

function setCollapsed(next: boolean): void {
    collapsed = next;
    persist(next);
    listeners.forEach((listener) => listener());
}

function toggleCollapsed(): void {
    setCollapsed(!getCollapsed());
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const noopSubscribe = () => () => {};

export function useSidenavState() {
    const isCollapsed = useSyncExternalStore(subscribe, getCollapsed, () => false);
    const isHydrated = useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false,
    );
    return { isCollapsed, setCollapsed, toggleCollapsed, isHydrated };
}
