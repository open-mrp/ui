'use client';

import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

export type StepperStep = {
    label: string;
    description?: string;
};

export type StepperProps = {
    steps: StepperStep[];
    activeIndex: number;
    /** Zero-based index of the furthest step the user can jump to. Defaults to activeIndex. */
    maxReachableIndex?: number;
    orientation?: 'horizontal' | 'vertical';
    onStepClick?: (index: number) => void;
    className?: string;
};

function Stepper({
    steps,
    activeIndex,
    maxReachableIndex,
    orientation = 'horizontal',
    onStepClick,
    className,
}: StepperProps) {
    const maxReach = maxReachableIndex ?? activeIndex;

    if (orientation === 'vertical') {
        return (
            <ol data-slot="stepper" className={cn('flex flex-col gap-2', className)}>
                {steps.map((step, i) => {
                    const state = i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'upcoming';
                    const clickable = onStepClick && i <= maxReach;
                    return (
                        <li key={step.label} className="flex items-start gap-3">
                            <StepIndicator state={state} index={i} />
                            <button
                                type="button"
                                disabled={!clickable}
                                onClick={() => clickable && onStepClick(i)}
                                className={cn(
                                    'flex flex-col items-start text-left pt-0.5',
                                    clickable && 'cursor-pointer',
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        state === 'active'
                                            ? 'text-gray-900 dark:text-gray-100'
                                            : 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {step.label}
                                </span>
                                {step.description && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {step.description}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ol>
        );
    }

    return (
        <ol
            data-slot="stepper"
            className={cn('flex items-center w-full', className)}
        >
            {steps.map((step, i) => {
                const state = i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'upcoming';
                const clickable = onStepClick && i <= maxReach;
                return (
                    <React.Fragment key={step.label}>
                        <li className="flex items-center gap-2 min-w-0">
                            <button
                                type="button"
                                disabled={!clickable}
                                onClick={() => clickable && onStepClick(i)}
                                className={cn(
                                    'flex items-center gap-2 min-w-0',
                                    clickable && 'cursor-pointer',
                                )}
                            >
                                <StepIndicator state={state} index={i} />
                                <span
                                    className={cn(
                                        'text-sm font-medium truncate hidden sm:inline',
                                        state === 'active'
                                            ? 'text-gray-900 dark:text-gray-100'
                                            : 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {step.label}
                                </span>
                            </button>
                        </li>
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    'mx-2 sm:mx-3 h-px flex-1 transition-colors',
                                    i < activeIndex
                                        ? 'bg-[var(--primary)]'
                                        : 'bg-gray-300 dark:bg-gray-600',
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </ol>
    );
}

function StepIndicator({
    state,
    index,
}: {
    state: 'completed' | 'active' | 'upcoming';
    index: number;
}) {
    return (
        <span
            className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                state === 'completed' &&
                    'border-[var(--primary)] bg-[var(--primary)] text-white',
                state === 'active' &&
                    'border-[var(--primary)] bg-white dark:bg-gray-900 text-[var(--primary)]',
                state === 'upcoming' &&
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500',
            )}
        >
            {state === 'completed' ? <Check className="h-4 w-4" /> : index + 1}
        </span>
    );
}

export { Stepper };
