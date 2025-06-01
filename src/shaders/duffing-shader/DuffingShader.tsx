import React, { useEffect, useRef } from "react";
import { FluidRenderer } from "./FluidRenderer";
import type { DuffingShaderProps } from "./types";

export function DuffingShader({
  width = 600,
  height = 275,
  className = "",
  config,
  skew,
  skewDegree = 6,
}: DuffingShaderProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FluidRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const renderer = new FluidRenderer(
        canvasRef.current,
        config,
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
  }, [config, skew, skewDegree]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (config) {
      renderer.updateConfig(config);
    }
  }, [config]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.updateSkew(skew, skewDegree);
  }, [skew, skewDegree]);

  return (
    <div className={`fluid-simulation-container ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
