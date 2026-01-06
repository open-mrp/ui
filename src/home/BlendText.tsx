'use client';

import HomeTextLayer from './HomeTextLayer';

export interface BlendTextProps {
    className?: string;
    baseZIndex?: number;
    color?: string;
    revertColor?: string;
    blendMode?:
        | 'color-burn'
        | 'color-dodge'
        | 'darken'
        | 'lighten'
        | 'multiply'
        | 'screen'
        | 'overlay'
        | 'soft-light'
        | 'hard-light'
        | 'difference'
        | 'exclusion'
        | 'hue'
        | 'saturation'
        | 'color'
        | 'luminosity';
    revertOpacity?: number;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export default function BlendText({
    className,
    baseZIndex = 0,
    color = '#3a3a3a',
    revertColor = '#111',
    blendMode = 'color-burn',
    revertOpacity = 0.8,
    children,
    style = {},
}: BlendTextProps) {
    return (
        <div className="relative">
            <HomeTextLayer
                style={{
                    ...style,
                    position: 'relative',
                    mixBlendMode: blendMode,
                    color,
                    zIndex: baseZIndex + 1,
                }}
                className={className}
            >
                {children}
            </HomeTextLayer>
            <HomeTextLayer
                style={{
                    ...style,
                    position: 'absolute',
                    opacity: revertOpacity,
                    mixBlendMode: 'revert',
                    pointerEvents: 'none',
                    color: revertColor,
                    zIndex: baseZIndex + 1,
                }}
                className={className}
            >
                {children}
            </HomeTextLayer>
            <HomeTextLayer
                style={{
                    ...style,
                    position: 'absolute',
                    mixBlendMode: 'revert',
                    color,
                    pointerEvents: 'none',
                    zIndex: baseZIndex,
                }}
                className={className}
            >
                {children}
            </HomeTextLayer>
        </div>
    );
}
