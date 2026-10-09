import {
    forwardRef,
    useRef,
    useState,
    type ChangeEvent,
    type ComponentPropsWithoutRef,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import type { PaletteColorName } from '@/theme/types';

export interface SliderMark {
    value: number;
    label?: ReactNode;
}

export interface SliderProps extends Omit<
    ComponentPropsWithoutRef<'span'>,
    'onChange' | 'defaultValue' | 'color'
> {
    value?: number;
    defaultValue?: number;
    onChange?: (event: Event | React.SyntheticEvent, value: number, activeThumb: number) => void;
    onChangeCommitted?: (event: Event | React.SyntheticEvent, value: number) => void;
    min?: number;
    max?: number;
    step?: number | null;
    shiftStep?: number;
    marks?: boolean | SliderMark[];
    disabled?: boolean;
    size?: 'small' | 'medium';
    color?: PaletteColorName;
    valueLabelDisplay?: 'on' | 'auto' | 'off';
    valueLabelFormat?: (value: number) => ReactNode;
    name?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    getAriaValueText?: (value: number) => string;
}

const colorClasses: Record<PaletteColorName, string> = {
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    error: 'text-error-main',
    warning: 'text-warning-main',
    info: 'text-info-main',
    success: 'text-success-main',
};

const haloClasses: Record<PaletteColorName, string> = {
    primary:
        'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-primary-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-primary-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-primary-main)_16%,transparent)]',
    secondary:
        'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-secondary-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-secondary-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-secondary-main)_16%,transparent)]',
    error: 'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-error-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-error-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-error-main)_16%,transparent)]',
    warning:
        'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-warning-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-warning-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-warning-main)_16%,transparent)]',
    info: 'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-info-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-info-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-info-main)_16%,transparent)]',
    success:
        'hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-success-main)_16%,transparent)] has-focus-visible:shadow-[0_0_0_8px_color-mix(in_srgb,var(--palette-success-main)_16%,transparent)] data-active:shadow-[0_0_0_14px_color-mix(in_srgb,var(--palette-success-main)_16%,transparent)]',
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, step: number, min: number): number {
    const nearest = Math.round((value - min) / step) * step + min;
    const decimals = (String(step).split('.')[1] ?? '').length;
    return Number(nearest.toFixed(decimals));
}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
    {
        value: valueProp,
        defaultValue = 0,
        onChange,
        onChangeCommitted,
        min = 0,
        max = 100,
        step = 1,
        shiftStep = 10,
        marks = false,
        disabled = false,
        size = 'medium',
        color = 'primary',
        valueLabelDisplay = 'off',
        valueLabelFormat,
        name,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        getAriaValueText,
        className,
        ...other
    },
    ref
) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const value = clamp(valueProp ?? uncontrolled, min, max);
    const [active, setActive] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const railRef = useRef<HTMLSpanElement | null>(null);
    const percent = ((value - min) * 100) / (max - min || 1);
    const small = size === 'small';

    const commit = (event: Event | React.SyntheticEvent, next: number) => {
        if (next === value) return;
        if (valueProp === undefined) setUncontrolled(next);
        onChange?.(event, next, 0);
    };

    const valueFromPointer = (clientX: number): number => {
        const rail = railRef.current;
        if (!rail) return value;
        const rect = rail.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
        let next = min + ratio * (max - min);
        if (step) next = roundToStep(next, step, min);
        else if (Array.isArray(marks) && marks.length) {
            next = marks.reduce(
                (closest, mark) =>
                    Math.abs(mark.value - next) < Math.abs(closest - next) ? mark.value : closest,
                marks[0]!.value
            );
        }
        return clamp(next, min, max);
    };

    const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
        if (disabled || event.button !== 0) return;
        event.preventDefault();
        const target = event.currentTarget;
        target.setPointerCapture(event.pointerId);
        setActive(true);
        let latest = valueFromPointer(event.clientX);
        commit(event, latest);
        const input = target.querySelector('input');
        input?.focus({ preventScroll: true });
        const move = (moveEvent: globalThis.PointerEvent) => {
            latest = valueFromPointer(moveEvent.clientX);
            commit(moveEvent, latest);
        };
        const up = (upEvent: globalThis.PointerEvent) => {
            setActive(false);
            target.removeEventListener('pointermove', move);
            target.removeEventListener('pointerup', up);
            onChangeCommitted?.(upEvent, latest);
        };
        target.addEventListener('pointermove', move);
        target.addEventListener('pointerup', up);
    };

    const stepMarks: number[] =
        marks === true && step
            ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, index) =>
                  roundToStep(min + index * step, step, min)
              )
            : Array.isArray(marks)
              ? marks.map(mark => mark.value)
              : [];
    const markLabels = Array.isArray(marks) ? marks.filter(mark => mark.label != null) : [];

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const increment = ['ArrowRight', 'ArrowUp', 'PageUp', 'End'];
        const decrement = ['ArrowLeft', 'ArrowDown', 'PageDown', 'Home'];
        if (!increment.includes(event.key) && !decrement.includes(event.key)) return;
        event.preventDefault();
        let next: number | null = null;
        if (step != null) {
            const size = event.key.startsWith('Page') || event.shiftKey ? shiftStep : step;
            if (event.key === 'Home') next = min;
            else if (event.key === 'End') next = max;
            else if (increment.includes(event.key)) next = Math.min(value + size, max);
            else next = Math.max(value - size, min);
        } else if (stepMarks.length) {
            const sorted = [...stepMarks].sort((a, b) => a - b);
            const index = sorted.indexOf(value);
            if (increment.includes(event.key))
                next = sorted[Math.min(index + 1, sorted.length - 1)] ?? null;
            else next = index === -1 ? null : (sorted[Math.max(index - 1, 0)] ?? null);
        }
        if (next == null) return;
        next = clamp(next, min, max);
        commit(event, next);
        onChangeCommitted?.(event, next);
    };
    const showLabel =
        valueLabelDisplay === 'on' ||
        (valueLabelDisplay === 'auto' && (active || hovered || focused));

    return (
        <span
            ref={ref}
            onPointerDown={handlePointerDown}
            data-disabled={disabled ? '' : undefined}
            className={cn(
                'relative box-content! inline-block w-full cursor-pointer touch-none rounded-[12px] py-[13px] [-webkit-tap-highlight-color:transparent] print:[color-adjust:exact]',
                small ? 'h-0.5' : 'h-1',
                colorClasses[color],
                markLabels.length > 0 && 'mb-5',
                disabled && 'pointer-events-none cursor-default text-grey-400 dark:text-grey-600',
                className
            )}
            {...other}
        >
            <span
                ref={railRef}
                className="absolute top-1/2 block h-[inherit] w-full -translate-y-1/2 rounded-[inherit] bg-current opacity-38"
            />
            <span
                className={cn(
                    'absolute top-1/2 block h-[inherit] -translate-y-1/2 rounded-[inherit] border border-solid border-current bg-current',
                    small && 'border-0',
                    !active && 'transition-[left,width,bottom,height] duration-150 ease-standard'
                )}
                style={{ left: '0%', width: `${percent}%` }}
            />
            {stepMarks.map(markValue => {
                const markPercent = ((markValue - min) * 100) / (max - min || 1);
                return (
                    <span
                        key={markValue}
                        className={cn(
                            'absolute top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-current',
                            markValue <= value && 'bg-paper opacity-80'
                        )}
                        style={{ left: `${markPercent}%` }}
                    />
                );
            })}
            {markLabels.map(mark => (
                <span
                    key={`label-${mark.value}`}
                    className={cn(
                        'absolute top-[30px] -translate-x-1/2 font-plex-sans text-[0.875rem] leading-[1.57] whitespace-nowrap text-fg-secondary',
                        mark.value <= value && 'text-fg'
                    )}
                    style={{ left: `${((mark.value - min) * 100) / (max - min || 1)}%` }}
                >
                    {mark.label}
                </span>
            ))}
            <span
                data-active={active ? '' : undefined}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    'absolute top-1/2 box-border flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-current outline-0',
                    small ? 'h-3 w-3' : 'h-5 w-5',
                    !active && 'transition-[box-shadow,left,bottom] duration-150 ease-standard',
                    "before:absolute before:h-full before:w-full before:rounded-[inherit] before:shadow-elevation-2 before:content-['']",
                    "after:absolute after:top-1/2 after:left-1/2 after:h-[42px] after:w-[42px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:content-['']",
                    !disabled && haloClasses[color],
                    disabled && 'hover:shadow-none'
                )}
                style={{ left: `${percent}%` }}
            >
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step ?? undefined}
                    value={value}
                    name={name}
                    disabled={disabled}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-orientation="horizontal"
                    aria-valuemax={max}
                    aria-valuemin={min}
                    aria-valuenow={value}
                    aria-valuetext={getAriaValueText?.(value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        commit(event, Number(event.target.value))
                    }
                    className="absolute -m-px h-full w-full overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0_0_0_0)] [direction:ltr]"
                />
                {valueLabelDisplay !== 'off' ? (
                    <span
                        aria-hidden
                        className={cn(
                            'absolute -top-2.5 z-[1] flex origin-[bottom_center] items-center justify-center rounded-[2px] bg-grey-600 px-3 py-1 font-plex-sans text-[0.875rem] font-medium leading-[1.57] whitespace-nowrap text-white transition-transform duration-150 ease-standard',
                            "before:absolute before:bottom-0 before:left-1/2 before:h-2 before:w-2 before:translate-x-[-50%] before:translate-y-1/2 before:rotate-45 before:bg-inherit before:content-['']",
                            small && 'px-2 text-[0.75rem]',
                            showLabel
                                ? '-translate-y-full scale-100'
                                : 'translate-y-[-100%] scale-0'
                        )}
                    >
                        {valueLabelFormat ? valueLabelFormat(value) : value}
                    </span>
                ) : null}
            </span>
        </span>
    );
});
