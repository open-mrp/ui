import { DEFAULT_HEIGHT } from "@/shaders/wave-shader/constants";
import { WaveShaderProps } from "@/shaders/wave-shader/types";
import { clamp } from "@/utils/clamp";

export function calculateShaderCanvasDimensions(
  { height, minWidth, width, maintainHeight }: WaveShaderProps,
  viewportWidth: number
) {
  let finalHeight = height ?? DEFAULT_HEIGHT;

  const finalWidth = clamp(
    viewportWidth,
    minWidth ?? width ?? viewportWidth,
    width ?? viewportWidth
  );
  if (maintainHeight != null) {
    const fac = (Math.max(1, finalWidth / viewportWidth) - 1) * maintainHeight;
    finalHeight *= 1 + fac;
  }
  finalHeight = Math.round(finalHeight); // A fractional canvas height causes visual artifacts

  return [finalWidth, finalHeight];
}
