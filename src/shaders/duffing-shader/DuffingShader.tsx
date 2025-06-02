"use client";

import { useViewportWidth } from "@/hooks/useViewportWidth";
import { useEffect, useRef, useState } from "react";
import { colorConfigurations } from "../colorConfigurations";
import { calculateShaderCanvasDimensions } from "../utils/calculateShaderCanvasDimensions";
import { FluidRenderer } from "./FluidRenderer";
import { getShaders } from "./shaders";
import { Config, DuffingShaderProps, FragmentShader } from "./types";

const DEFAULT_CONFIG: Config = {
  SIM_RESOLUTION: 512,
  DYE_RESOLUTION: 1024,
  DENSITY_DISSIPATION: 2.5,
  VELOCITY_DISSIPATION: 0.9,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 0.1,
  SPLAT_RADIUS: 0.005,
  SPLAT_FORCE: 8000,
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  BLOOM_ITERATIONS: 10,
  BLOOM_RESOLUTION: 256,
  BLOOM_INTENSITY: 0.15,
  BLOOM_THRESHOLD: 0.0,
  BLOOM_SOFT_KNEE: 0.7,
  SUNRAYS_RESOLUTION: 256,
  SUNRAYS_WEIGHT: 0.1,
  COLOR_SCHEME: "default",
  DUFFING: {
    NUM_OSCILLATORS: 8,
    DELTA: 0.2,
    BETA: 0.08,
    ALPHA: 0.9,
    GAMMA: 0.8,
    OMEGA: 0.4,
  },
};

export function DuffingShader({
  colorConfiguration = "default",
  skew,
  skewDegree = 6,
  minWidth = 600,
  height: initialHeight = 275,
  config: userConfig,
}: DuffingShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FluidRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shaders, setShaders] = useState<Record<string, FragmentShader> | null>(
    null
  );

  const viewportWidth = useViewportWidth();
  const [dimensions, setDimensions] = useState(() => {
    // Use minWidth for initial server render to avoid hydration mismatch
    return [minWidth, initialHeight];
  });

  useEffect(() => {
    if (viewportWidth) {
      const [newWidth, newHeight] = calculateShaderCanvasDimensions(
        { colorConfiguration, skew, minWidth, height: initialHeight },
        viewportWidth
      );
      setDimensions([newWidth, newHeight]);
    }
  }, [viewportWidth, colorConfiguration, skew, minWidth, initialHeight]);

  const [canvasWidth, canvasHeight] = dimensions;

  // Load shaders
  useEffect(() => {
    async function loadShaders() {
      const loadedShaders = await getShaders();
      setShaders(loadedShaders);
    }
    loadShaders();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shaders) return;

    if (!colorConfigurations[colorConfiguration]) {
      console.warn(`Color configuration "${colorConfiguration}" not found`);
    }

    // Merge default config with user config
    const mergedConfig: Config = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      COLOR_SCHEME: colorConfiguration,
    };

    // Calculate boundaries based on skew
    const skewRadians = (skewDegree * Math.PI) / 180;
    const skewAmount = Math.tan(skewRadians);
    let boundaries;

    if (skew === "full") {
      boundaries = {
        botLeft: [-1, -1 - skewAmount] as [number, number],
        botRight: [1, -1 + skewAmount] as [number, number],
        topLeft: [-1, 1 - skewAmount] as [number, number],
        topRight: [1, 1 + skewAmount] as [number, number],
      };
    } else if (skew === "bottom") {
      const rightEdgeY = (50 + skewDegree / 2) / 50 - 1;
      boundaries = {
        botLeft: [-1, -1] as [number, number],
        botRight: [1, rightEdgeY] as [number, number],
        topLeft: [-1, 1] as [number, number],
        topRight: [1, 1] as [number, number],
      };
    } else {
      boundaries = {
        botLeft: [-1, -1] as [number, number],
        botRight: [1, -1] as [number, number],
        topLeft: [-1, 1] as [number, number],
        topRight: [1, 1] as [number, number],
      };
    }

    // Initialize the FluidRenderer with the canvas and configuration
    rendererRef.current = new FluidRenderer(
      canvas,
      mergedConfig,
      skew,
      skewDegree,
      shaders
    );

    // Clean up the renderer on unmount
    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [colorConfiguration, userConfig, skew, skewDegree, shaders]);

  // Update renderer configuration when props change
  useEffect(() => {
    if (!rendererRef.current) return;

    const mergedConfig: Config = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      COLOR_SCHEME: colorConfiguration,
    };

    rendererRef.current.updateConfig(mergedConfig);
  }, [colorConfiguration, userConfig]);

  // Handle resize
  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current) return;

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;
      rendererRef.current?.updateSkew(skew, skewDegree);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasWidth, canvasHeight, skew, skewDegree]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: skew === "full" ? `skewY(-${skewDegree}deg)` : "none",
          clipPath:
            skew === "bottom"
              ? `polygon(0 0, 100% 0, 100% ${50 + skewDegree / 2}%, 0 100%)`
              : "none",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
