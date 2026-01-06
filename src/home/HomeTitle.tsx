'use client';

import HomeTextLayer from './HomeTextLayer';

const styles = {
    title: {
        fontWeight: 600,
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
        pb: '0.1em',
        margin: '0px',
    },
    description: {
        fontWeight: 500,
        lineHeight: 1.6,
        padding: '0px',
        margin: '0px',
    },
} as const;

export interface HomeTitleProps {
    title: string;
    description: string;
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
}

export default function HomeTitle({
    title,
    description,
    baseZIndex = 0,
    color = '#3a3a3a',
    revertColor = '#111',
    blendMode = 'color-burn',
    revertOpacity = 0.8,
}: HomeTitleProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <HomeTextLayer
                    style={{
                        ...styles.title,
                        position: 'relative',
                        mixBlendMode: blendMode,
                        color,
                        zIndex: baseZIndex + 1,
                    }}
                    className="text-[2rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6rem]"
                >
                    {title}
                </HomeTextLayer>
                <HomeTextLayer
                    style={{
                        ...styles.title,
                        position: 'absolute',
                        opacity: revertOpacity,
                        mixBlendMode: 'revert',
                        pointerEvents: 'none',
                        color: revertColor,
                        zIndex: baseZIndex + 1,
                    }}
                    className="text-[2rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6rem]"
                >
                    {title}
                </HomeTextLayer>
                <HomeTextLayer
                    style={{
                        ...styles.title,
                        position: 'absolute',
                        mixBlendMode: 'revert',
                        color,
                        pointerEvents: 'none',
                        zIndex: baseZIndex,
                    }}
                    className="text-[2rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6rem]"
                >
                    {title}
                </HomeTextLayer>
            </div>
            <div className="relative">
                <HomeTextLayer
                    style={{
                        ...styles.description,
                        position: 'relative',
                        mixBlendMode: blendMode,
                        color,
                        zIndex: baseZIndex + 1,
                    }}
                    className="text-[1.1rem] sm:text-[1.3rem] lg:text-[1.6rem] xl:text-[1.8rem]"
                >
                    {description}
                </HomeTextLayer>
                <HomeTextLayer
                    style={{
                        ...styles.description,
                        position: 'absolute',
                        opacity: revertOpacity,
                        mixBlendMode: 'revert',
                        pointerEvents: 'none',
                        color: revertColor,
                        zIndex: baseZIndex + 1,
                    }}
                    className="text-[1.1rem] sm:text-[1.3rem] lg:text-[1.6rem] xl:text-[1.8rem]"
                >
                    {description}
                </HomeTextLayer>
                <HomeTextLayer
                    style={{
                        ...styles.description,
                        position: 'absolute',
                        mixBlendMode: 'revert',
                        color,
                        pointerEvents: 'none',
                        zIndex: baseZIndex,
                    }}
                    className="text-[1.1rem] sm:text-[1.3rem] lg:text-[1.6rem] xl:text-[1.8rem]"
                >
                    {description}
                </HomeTextLayer>
            </div>
        </div>
    );
}
