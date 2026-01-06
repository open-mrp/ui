import { DEFAULT_HEIGHT } from '@/shaders/wave-shader/constants';
import { clamp } from '@/utils/clamp';

interface ShaderDimensionProps {
    height?: number;
    minWidth?: number;
    width?: number;
    maintainHeight?: number;
    [key: string]: unknown; // Allow additional props
}

export function calculateShaderCanvasDimensions(
    props: ShaderDimensionProps,
    viewportWidth: number,
) {
    const { height, minWidth, width, maintainHeight } = props;
    let finalHeight = height ?? DEFAULT_HEIGHT;

    const finalWidth = clamp(
        viewportWidth,
        minWidth ?? width ?? viewportWidth,
        width ?? viewportWidth,
    );
    if (maintainHeight != null) {
        const fac = (Math.max(1, finalWidth / viewportWidth) - 1) * maintainHeight;
        finalHeight *= 1 + fac;
    }
    finalHeight = Math.round(finalHeight); // A fractional canvas height causes visual artifacts

    return [finalWidth, finalHeight];
}
