import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { cn } from '@/utils/cn';
import type { PaletteColorName } from '@/theme/types';

const SIZE = 44;

const colorClasses: Record<PaletteColorName | 'inherit', string> = {
    primary: 'text-primary-main',
    secondary: 'text-secondary-main',
    error: 'text-error-main',
    warning: 'text-warning-main',
    info: 'text-info-main',
    success: 'text-success-main',
    inherit: '',
};

export interface CircularProgressProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
    color?: PaletteColorName | 'inherit';
    size?: number | string;
    thickness?: number;
    value?: number;
    min?: number;
    max?: number;
    variant?: 'determinate' | 'indeterminate';
    disableShrink?: boolean;
    enableTrackSlot?: boolean;
}

export const CircularProgress = forwardRef<HTMLSpanElement, CircularProgressProps>(
    function CircularProgress(
        {
            color = 'primary',
            size = 40,
            thickness = 3.6,
            value,
            min = 0,
            max = 100,
            variant = 'indeterminate',
            disableShrink = false,
            enableTrackSlot = false,
            className,
            style,
            ...other
        },
        ref
    ) {
        const determinate = variant === 'determinate';
        const radius = (SIZE - thickness) / 2;
        const circleStyle: CSSProperties = {};
        const rootStyle: CSSProperties = { width: size, height: size };
        const ariaProps: Record<string, number> = {};
        if (determinate) {
            const current = value ?? min;
            const circumference = 2 * Math.PI * radius;
            const range = max - min;
            circleStyle.strokeDasharray = circumference.toFixed(3);
            circleStyle.strokeDashoffset =
                range > 0
                    ? `${(((max - current) / range) * circumference).toFixed(3)}px`
                    : `${circumference.toFixed(3)}px`;
            rootStyle.transform = 'rotate(-90deg)';
            ariaProps['aria-valuenow'] = current;
            ariaProps['aria-valuemin'] = min;
            ariaProps['aria-valuemax'] = max;
        }
        return (
            <span
                ref={ref}
                role="progressbar"
                className={cn(
                    'inline-block',
                    determinate ? 'transition-transform duration-300 ease-standard' : 'animate-progress-spin',
                    colorClasses[color],
                    className
                )}
                style={{ ...rootStyle, ...style }}
                {...ariaProps}
                {...other}
            >
                <svg className="block" viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
                    {enableTrackSlot ? (
                        <circle
                            className="stroke-current opacity-[0.12]"
                            cx={SIZE}
                            cy={SIZE}
                            r={radius}
                            fill="none"
                            strokeWidth={thickness}
                            aria-hidden="true"
                        />
                    ) : null}
                    <circle
                        className={cn(
                            'stroke-current',
                            determinate
                                ? 'transition-[stroke-dashoffset] duration-300 ease-standard'
                                : '[stroke-dasharray:80px,200px] [stroke-dashoffset:0]',
                            !determinate && !disableShrink && 'animate-progress-dash'
                        )}
                        style={circleStyle}
                        cx={SIZE}
                        cy={SIZE}
                        r={radius}
                        fill="none"
                        strokeWidth={thickness}
                    />
                </svg>
            </span>
        );
    }
);
