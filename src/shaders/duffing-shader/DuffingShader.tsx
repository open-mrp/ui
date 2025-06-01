import React, { useEffect, useMemo, useRef } from "react";
import { FluidRenderer } from "./FluidRenderer";
import type { DuffingShaderProps } from "./types";

export function DuffingShader({
  width = 600,
  height = 275,
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

  // Calculate dimensions based on minWidth and maintainHeight
  const dimensions = useMemo(() => {
    const finalWidth = Math.max(width, minWidth);
    const finalHeight = maintainHeight
      ? Math.round(finalWidth * maintainHeight)
      : height;
    return { width: finalWidth, height: finalHeight };
  }, [width, minWidth, maintainHeight, height]);

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
    <div className={`fluid-simulation-container ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
