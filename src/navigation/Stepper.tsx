'use client';

import {
    Children,
    cloneElement,
    createContext,
    forwardRef,
    isValidElement,
    useContext,
    type ComponentPropsWithoutRef,
    type ReactElement,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { InternalCheckCircleIcon, InternalWarningIcon } from '@/icons/internal-icons';

interface StepperContextValue {
    activeStep: number;
    alternativeLabel: boolean;
    orientation: 'horizontal' | 'vertical';
    nonLinear: boolean;
}

const StepperContext = createContext<StepperContextValue>({
    activeStep: 0,
    alternativeLabel: false,
    orientation: 'horizontal',
    nonLinear: false,
});

interface StepContextValue {
    index: number;
    active: boolean;
    completed: boolean;
    disabled: boolean;
    last: boolean;
}

const StepContext = createContext<StepContextValue>({
    index: 0,
    active: false,
    completed: false,
    disabled: false,
    last: false,
});

export interface StepperProps extends ComponentPropsWithoutRef<'ol'> {
    activeStep?: number;
    alternativeLabel?: boolean;
    orientation?: 'horizontal' | 'vertical';
    nonLinear?: boolean;
    connector?: ReactElement | null;
}

export function StepConnector({ className }: { className?: string }) {
    const { alternativeLabel, orientation } = useContext(StepperContext);
    const vertical = orientation === 'vertical';
    return (
        <div
            aria-hidden
            className={cn(
                'flex-[1_1_auto]',
                alternativeLabel && 'absolute top-3 right-[calc(50%+20px)] left-[calc(-50%+20px)]',
                vertical && 'ml-3',
                className
            )}
        >
            <span
                className={cn(
                    'block border-grey-400 dark:border-grey-600',
                    vertical ? 'min-h-6 border-l border-solid' : 'border-t border-solid'
                )}
            />
        </div>
    );
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
    {
        activeStep = 0,
        alternativeLabel = false,
        orientation = 'horizontal',
        nonLinear = false,
        connector = <StepConnector />,
        className,
        children,
        ...other
    },
    ref
) {
    const steps = Children.toArray(children).filter(isValidElement) as ReactElement<StepProps>[];
    return (
        <StepperContext.Provider value={{ activeStep, alternativeLabel, orientation, nonLinear }}>
            <ol
                ref={ref}
                className={cn(
                    'm-0 flex list-none p-0',
                    orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
                    alternativeLabel && 'items-start',
                    className
                )}
                {...other}
            >
                {steps.map((step, index) =>
                    cloneElement(step, {
                        key: step.key ?? index,
                        index,
                        last: index + 1 === steps.length,
                        connector: index > 0 ? connector : null,
                    })
                )}
            </ol>
        </StepperContext.Provider>
    );
});

export interface StepProps extends ComponentPropsWithoutRef<'li'> {
    index?: number;
    active?: boolean;
    completed?: boolean;
    disabled?: boolean;
    last?: boolean;
    connector?: ReactNode;
}

export const Step = forwardRef<HTMLLIElement, StepProps>(function Step(
    {
        index = 0,
        active: activeProp,
        completed: completedProp,
        disabled: disabledProp,
        last = false,
        connector,
        className,
        children,
        ...other
    },
    ref
) {
    const { activeStep, alternativeLabel, orientation, nonLinear } = useContext(StepperContext);
    const active = activeProp ?? activeStep === index;
    const completed = completedProp ?? (!nonLinear && activeStep > index);
    const disabled = disabledProp ?? (!nonLinear && activeStep < index);
    const horizontal = orientation === 'horizontal';
    return (
        <StepContext.Provider value={{ index, active, completed, disabled, last }}>
            <li
                ref={ref}
                className={cn(
                    horizontal &&
                        !alternativeLabel &&
                        'flex flex-[1_1_auto] items-center px-2 first:flex-none',
                    alternativeLabel && 'relative flex-1',
                    className
                )}
                {...other}
            >
                {connector}
                {children}
            </li>
        </StepContext.Provider>
    );
});

export function StepIcon({
    active,
    completed,
    error,
    icon,
}: {
    active: boolean;
    completed: boolean;
    error?: boolean;
    icon: ReactNode;
}) {
    const base = 'block h-6 w-6 text-fg-disabled transition-[color] duration-150 ease-standard';
    if (error) return <InternalWarningIcon className={cn(base, 'text-error-main')} />;
    if (completed) return <InternalCheckCircleIcon className={cn(base, 'text-primary-main')} />;
    return (
        <svg
            className={cn(base, 'fill-current', active && 'text-primary-main')}
            viewBox="0 0 24 24"
            aria-hidden
            focusable="false"
        >
            <circle cx="12" cy="12" r="12" />
            <text
                x="12"
                y="12"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-primary-contrast font-plex-sans text-[0.75rem]"
            >
                {icon}
            </text>
        </svg>
    );
}

export interface StepLabelProps extends ComponentPropsWithoutRef<'span'> {
    error?: boolean;
    optional?: ReactNode;
    icon?: ReactNode;
}

export const StepLabel = forwardRef<HTMLSpanElement, StepLabelProps>(function StepLabel(
    { error = false, optional, icon, className, children, ...other },
    ref
) {
    const { alternativeLabel, orientation } = useContext(StepperContext);
    const { index, active, completed, disabled } = useContext(StepContext);
    return (
        <span
            ref={ref}
            className={cn(
                'flex items-center',
                alternativeLabel && 'flex-col',
                orientation === 'vertical' && 'py-2 text-left',
                disabled && 'cursor-default',
                className
            )}
            {...other}
        >
            <span className={cn('flex shrink-0', alternativeLabel ? 'pr-0' : 'pr-2')}>
                <StepIcon
                    active={active}
                    completed={completed}
                    error={error}
                    icon={icon ?? index + 1}
                />
            </span>
            <span className={cn('w-full text-fg-secondary', alternativeLabel && 'text-center')}>
                <span
                    className={cn(
                        'block font-plex-sans text-[0.875rem] leading-[1.57] transition-[color] duration-150 ease-standard',
                        (active || completed) && 'font-medium text-fg',
                        error && 'text-error-main',
                        alternativeLabel && 'mt-4'
                    )}
                >
                    {children}
                </span>
                {optional}
            </span>
        </span>
    );
});
