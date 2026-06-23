import { colorConfigurations, ColorConfiguration } from '../colorConfigurations';
import fragmentShaderSource from './shaders/main.glsl';
import vertexShaderSource from './shaders/vertex.glsl';
import { DEFAULT_BACKGROUND_COLOR, RGBColor } from './types';
import { WaveShaderRenderer } from './WaveShaderRenderer';

export interface CaptureWaveShaderStillOptions {
    /** Output pixel width. */
    width?: number;
    /** Output pixel height. */
    height?: number;
    colorConfiguration?: ColorConfiguration;
    seed?: number;
    numWaves?: number;
    backgroundColor?: RGBColor;
    /** 'image/webp' (smaller) or 'image/png'. */
    type?: string;
    /** Quality for lossy types (0-1). */
    quality?: number;
}

/**
 * Renders the wave shader once to an offscreen canvas and returns a still frame as an
 * image data URL. Requires a working WebGL context — used to generate the bundled
 * fallback still shown when WebGL is unavailable. See the "WaveShader/Capture Still"
 * Storybook story for a UI around this.
 */
export function captureWaveShaderStill(options: CaptureWaveShaderStillOptions = {}): string {
    const {
        // Capture large and wide (16:9). The still is displayed with object-fit: cover,
        // so high resolution + a wide aspect keeps cropping minimal across screen sizes.
        width = 2560,
        height = 1440,
        colorConfiguration = 'default',
        seed = 16192,
        numWaves = 8,
        backgroundColor = DEFAULT_BACKGROUND_COLOR,
        type = 'image/webp',
        quality = 0.85,
    } = options;

    const canvas = document.createElement('canvas');
    const renderer = new WaveShaderRenderer(
        canvas,
        vertexShaderSource,
        fragmentShaderSource,
        colorConfigurations[colorConfiguration],
        seed,
        numWaves,
        1,
        backgroundColor,
    );
    try {
        renderer.setDimensions(width, height, 1);
        return renderer.captureFrame(type, quality);
    } finally {
        renderer.dispose();
    }
}
