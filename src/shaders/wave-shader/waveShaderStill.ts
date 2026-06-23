import { RGBColor, WaveShaderFallbackImage } from './types';

/**
 * Pre-rendered still frames of the default WaveShader, shown as a fallback when WebGL
 * is unavailable (e.g. hardware acceleration disabled, GPU process crashed after a
 * macOS split-screen GPU switch).
 *
 * Two variants are bundled — one captured over a dark background, one over light — and
 * the right one is chosen from the `backgroundColor` the shader is rendered with.
 *
 * These are base64 image data URLs. To (re)generate them:
 *   1. Run `bun run storybook` and open "Shaders / WaveShader Capture Still".
 *   2. Set the `variant` (dark/light) and matching background RGB, click Capture, then
 *      "Download still" — it downloads `wave-shader-still-<variant>.webp`.
 *   3. Inline each file:
 *        bun scripts/inline-still.mjs ~/Downloads/wave-shader-still-dark.webp dark
 *        bun scripts/inline-still.mjs ~/Downloads/wave-shader-still-light.webp light
 *
 * Empty string means that variant isn't bundled yet.
 */
export const WAVE_SHADER_STILL_DARK = '';
export const WAVE_SHADER_STILL_LIGHT = '';

/** Rec. 601 luma (0-1) of an RGB tuple. */
function luminance([r, g, b]: RGBColor): number {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Resolves the fallback still for the given background color. A caller-provided
 * `override` (a single URL or a `{ light, dark }` pair) takes precedence over the
 * bundled base64 stills. Returns '' if nothing is available.
 */
export function getWaveShaderStill(
    backgroundColor: RGBColor,
    override?: string | WaveShaderFallbackImage,
): string {
    const isLight = luminance(backgroundColor) > 0.5;

    if (typeof override === 'string') return override;
    if (override) {
        const preferred = isLight ? override.light : override.dark;
        const other = isLight ? override.dark : override.light;
        if (preferred || other) return preferred ?? other ?? '';
    }

    const preferred = isLight ? WAVE_SHADER_STILL_LIGHT : WAVE_SHADER_STILL_DARK;
    const fallback = isLight ? WAVE_SHADER_STILL_DARK : WAVE_SHADER_STILL_LIGHT;
    return preferred || fallback;
}
