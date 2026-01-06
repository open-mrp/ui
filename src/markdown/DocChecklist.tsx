'use client';

import { cn } from '@/utils/cn';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ChecklistContextValue {
    checkedItems: Set<string>;
    toggleItem: (id: string) => void;
    isHydrated: boolean;
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

export interface DocChecklistProps {
    children: React.ReactNode;
    storageKey: string;
    className?: string;
}

export default function DocChecklist({ children, storageKey, className }: DocChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [isHydrated, setIsHydrated] = useState(false);

    // Load checked items from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`checklist-${storageKey}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setCheckedItems(new Set(parsed));
                }
            }
        } catch {
            // Ignore localStorage errors
        }
        setIsHydrated(true);
    }, [storageKey]);

    // Save checked items to localStorage when they change
    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(
                `checklist-${storageKey}`,
                JSON.stringify(Array.from(checkedItems)),
            );
        } catch {
            // Ignore localStorage errors
        }
    }, [checkedItems, storageKey, isHydrated]);

    const toggleItem = (id: string) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const completedCount = checkedItems.size;
    const totalCount = React.Children.count(children);
    const allComplete = completedCount === totalCount && totalCount > 0;

    return (
        <ChecklistContext.Provider value={{ checkedItems, toggleItem, isHydrated }}>
            <div className={cn('mt-6', className)}>
                {/* Progress indicator */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full transition-all duration-300 ease-out rounded-full',
                                allComplete ? 'bg-emerald-500' : 'bg-[var(--primary)]',
                            )}
                            style={{
                                width: isHydrated
                                    ? `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`
                                    : '0%',
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-secondary)] min-w-[4rem] text-right">
                        {isHydrated ? completedCount : 0} / {totalCount}
                    </span>
                </div>

                {/* Checklist items */}
                <div className="flex flex-col gap-3">{children}</div>

                {/* Completion message */}
                {allComplete && isHydrated && (
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <p className="!pt-0 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            All items completed!
                        </p>
                    </div>
                )}
            </div>
        </ChecklistContext.Provider>
    );
}

export interface DocChecklistItemProps {
    children: React.ReactNode;
    id: string;
    className?: string;
}

export function DocChecklistItem({ children, id, className }: DocChecklistItemProps) {
    const context = useContext(ChecklistContext);

    if (!context) {
        throw new Error('DocChecklistItem must be used within a DocChecklist');
    }

    const { checkedItems, toggleItem, isHydrated } = context;
    const isChecked = checkedItems.has(id);

    return (
        <div
            onClick={() => toggleItem(id)}
            className={cn(
                'flex items-start gap-4 pl-6 pr-5 py-4 rounded-lg border transition-all duration-200 cursor-pointer select-none',
                isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-[var(--content-background)] border-[var(--border-color)] hover:border-[var(--primary)]/50',
                className,
            )}
            role="checkbox"
            aria-checked={isChecked}
        >
            <div
                className={cn(
                    'mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
                    isHydrated && isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-[var(--border-color)] bg-transparent',
                )}
            >
                {isHydrated && isChecked && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
            <div
                className={cn(
                    'flex-1 text-sm leading-relaxed transition-all duration-200 [&>*:first-child]:!pt-0 [&>*:first-child]:!mt-0',
                    isChecked && isHydrated
                        ? 'text-[var(--text-secondary)]'
                        : 'text-[var(--foreground)]',
                )}
            >
                {children}
            </div>
        </div>
    );
}
