import { useViewportWidth } from "@/hooks/useViewportWidth";
import React, { useEffect, useMemo, useRef } from "react";
import { FluidRenderer } from "./FluidRenderer";
import type { DuffingShaderProps } from "./types";

export function DuffingShader({
  width = 600,
  height = 400,
  className = "",
  config,
  skew,
  skewDegree = 6,
  minWidth = 600,
  maintainHeight = 0.3,
  colorConfiguration = "dusk",
}: DuffingShaderProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FluidRenderer | null>(null);
  const viewportWidth = useViewportWidth();

  // Calculate dimensions based on container size
  const dimensions = useMemo(() => {
    const containerWidth = viewportWidth ?? width;
    const finalWidth = Math.max(containerWidth, minWidth);
    const finalHeight = maintainHeight
      ? Math.round(finalWidth * maintainHeight)
      : height;
    return { width: finalWidth, height: finalHeight };
  }, [width, minWidth, maintainHeight, height, viewportWidth]);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const renderer = new FluidRenderer(
        canvasRef.current,
        {
          ...config,
          COLOR_SCHEME: colorConfiguration,
        },
        skew,
        skewDegree
      );
      rendererRef.current = renderer;

      return () => {
        renderer.destroy();
      };
    } catch (error) {
      console.error("Failed to initialize Fluid Simulation:", error);
    }
  }, [config, skew, skewDegree, colorConfiguration]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (config) {
      renderer.updateConfig({
        ...config,
        COLOR_SCHEME: colorConfiguration,
      });
    }
  }, [config, colorConfiguration]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.updateSkew(skew, skewDegree);
  }, [skew, skewDegree]);

  return (
    <div
      className="relative w-full h-full"
      style={{
        minWidth,
        ...(skew === "full" ? { transform: `skewY(-${skewDegree}deg)` } : {}),
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          clipPath:
            skew === "bottom"
              ? `polygon(0 0, 100% 0, 100% ${50 + skewDegree / 2}%, 0 100%)`
              : "none",
        }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full ${className}`}
          style={{
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
}
