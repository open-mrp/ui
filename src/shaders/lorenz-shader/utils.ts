import { calculateShaderCanvasDimensions } from "../utils/calculateShaderCanvasDimensions";
import { DisplayParams, LorenzParams, LorenzProps } from "./types";

/**
 * Creates default Lorenz parameters with optional overrides
 * @param overrides - Partial parameters to override defaults
 * @returns Complete LorenzParams object
 */
export function createLorenzParams(
  overrides?: Partial<LorenzParams>
): LorenzParams {
  const defaults: LorenzParams = {
    sigma: 10,
    beta: 8 / 3,
    rho: 28,
    display_rho: 28,
    step_size: 0.002,
    steps_per_frame: 3,
    oscillation: {
      enabled: true,
      sigma: {
        base: 10,
        amplitude: 2,
        frequency: 0.001,
      },
      beta: {
        base: 8 / 3,
        amplitude: 0.5,
        frequency: 0.0008,
      },
      rho: {
        base: 28,
        amplitude: 5,
        frequency: 0.0012,
      },
    },
  };

  return { ...defaults, ...overrides };
}

/**
 * Creates default display parameters with optional overrides
 * @param overrides - Partial parameters to override defaults
 * @returns Complete DisplayParams object
 */
export function createDisplayParams(
  overrides?: Partial<DisplayParams>
): DisplayParams {
  const defaults: DisplayParams = {
    scale: 1 / 25,
    rotation: [1.65, 3.08, -0.93],
    rotationd: [0.0001, 0.0001, 0.0001],
    translation: [0, 0.075, 1.81],
    _length: 512,
  };

  return { ...defaults, ...overrides };
}

/**
 * Calculates responsive canvas dimensions for Lorenz component
 * @param props - LorenzProps containing width, height, minWidth, maintainHeight
 * @param viewportWidth - Current viewport width
 * @returns Tuple of [width, height]
 */
export function getLorenzCanvasDimensions(
  props: Pick<LorenzProps, "width" | "height" | "minWidth" | "maintainHeight">,
  viewportWidth: number
): [number, number] {
  const [width, height] = calculateShaderCanvasDimensions(props, viewportWidth);
  return [width, height];
}

/**
 * Generates random initial conditions for Lorenz particles
 * @param count - Number of initial conditions to generate
 * @param range - Range for random values (default: 20)
 * @returns Array of initial position arrays
 */
export function generateInitialConditions(
  count: number,
  range: number = 20
): [number, number, number][] {
  return Array.from({ length: count }, () => [
    (Math.random() - 0.5) * range,
    (Math.random() - 0.5) * range,
    (Math.random() - 0.5) * range,
  ]);
}

/**
 * Validates and normalizes RGB color values
 * @param color - RGB color array
 * @returns Normalized RGB color array (0-1 range)
 */
export function normalizeColor(
  color: [number, number, number]
): [number, number, number] {
  return color.map((c) => Math.max(0, Math.min(1, c))) as [
    number,
    number,
    number
  ];
}

/**
 * Creates a color palette from hex strings
 * @param hexColors - Array of hex color strings
 * @returns Array of normalized RGB color arrays
 */
export function createColorPalette(
  hexColors: string[]
): [number, number, number][] {
  return hexColors.map(hexToRgb).map(normalizeColor);
}

/**
 * Converts hex color string to RGB array
 * @param hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns RGB color array (0-255 range)
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

/**
 * Predefined color palettes for common use cases
 */
export const COLOR_PALETTES = {
  classic: [
    [0.8, 0.2, 0.2], // Red
    [0.2, 0.8, 0.2], // Green
    [0.2, 0.2, 0.8], // Blue
    [0.8, 0.8, 0.2], // Yellow
    [0.8, 0.2, 0.8], // Magenta
    [0.2, 0.8, 0.8], // Cyan
  ] as [number, number, number][],

  artistic: [
    [0.537, 0.357, 0.482], // Dusky madder violet
    [0.478, 0.537, 0.722], // Deep lyons blue
    [1.0, 0.369, 0.769], // Eosine pink
    [0.502, 0.275, 0.106], // Hay's russet
  ] as [number, number, number][],

  neon: [
    [1.0, 0.0, 1.0], // Neon magenta
    [0.0, 1.0, 1.0], // Neon cyan
    [1.0, 1.0, 0.0], // Neon yellow
    [1.0, 0.2, 0.0], // Neon orange
  ] as [number, number, number][],

  plasma: [
    [0.05, 0.03, 0.529], // Dark purple
    [0.265, 0.004, 0.678], // Purple
    [0.477, 0.001, 0.765], // Magenta
    [0.692, 0.165, 0.564], // Pink
    [0.865, 0.316, 0.226], // Orange
    [0.993, 0.906, 0.144], // Yellow
  ] as [number, number, number][],
} as const;
