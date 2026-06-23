import { ColorConfiguration } from '../colorConfigurations';

/**
 * RGB color represented as a tuple of three numbers (0-255).
 */
export type RGBColor = [number, number, number];

/**
 * Default background color for the wave shader: #060815
 */
export const DEFAULT_BACKGROUND_COLOR: RGBColor = [6, 8, 21];

export interface WaveShaderProps {
    skew?: 'full' | 'bottom';
    skewDegree?: number;
    colorConfiguration?: ColorConfiguration;
    width?: number;
    maintainHeight?: number;
    height?: number;
    animate?: boolean;
    seed?: number;
    numWaves?: number;
    showPerformanceMetrics?: boolean;
    /**
     * Background color as RGB tuple (0-255 values).
     * Defaults to #060815 (dark blue).
     */
    backgroundColor?: RGBColor;
    /**
     * Static image shown when WebGL is unavailable (hardware acceleration off, crashed
     * GPU process, etc.) so the area isn't blank. Either a single URL, or a
     * `{ light, dark }` pair — the variant is chosen from `backgroundColor`'s luminance.
     */
    fallbackImage?: string | WaveShaderFallbackImage;
}

export interface WaveShaderFallbackImage {
    light?: string;
    dark?: string;
}
