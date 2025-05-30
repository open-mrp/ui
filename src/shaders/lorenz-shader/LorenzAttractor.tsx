import React, { useEffect, useRef, useState } from "react";
import { colorConfigurations } from "../colorConfigurations";
import { calculateShaderCanvasDimensions } from "../utils/calculateShaderCanvasDimensions";
import { HSLAtoRGB } from "./colorManager";
import { Lorenz } from "./Lorenz";
import { LorenzProps } from "./types";

export function LorenzAttractor({
  width = 800,
  height = 600,
  minWidth,
  maintainHeight,
  className = "",
  onSolutionCountChange,
  onFpsChange,
  initialParams,
  initialDisplay,
  particleCount = 12,
  colorScheme = "default",
  useDistanceBasedColoring = false,
  oscillationCenters,
}: LorenzProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lorenzRef = useRef<Lorenz | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800
  );

  // Convert color scheme to RGB colors
  const getRGBColors = (scheme: string) => {
    const config =
      colorConfigurations[scheme as keyof typeof colorConfigurations];
    if (!config) return undefined;
    return config.gradient.map((hsla) => HSLAtoRGB(hsla));
  };

  // Handle viewport width changes for responsive behavior
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate responsive canvas dimensions
  const [canvasWidth, canvasHeight] = calculateShaderCanvasDimensions(
    { width, height, minWidth, maintainHeight },
    viewportWidth
  );

  // Initialize Lorenz system
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      const colors = useDistanceBasedColoring
        ? undefined
        : getRGBColors(colorScheme);
      const lorenz = new Lorenz(
        canvasRef.current,
        colors,
        useDistanceBasedColoring
      );

      // Apply initial parameters if provided
      if (initialParams) {
        Object.assign(lorenz.params, initialParams);
      }

      if (initialDisplay) {
        Object.assign(lorenz.display, initialDisplay);
      }

      // Configure distance-based coloring if enabled
      if (useDistanceBasedColoring) {
        const rosolaneToHelvetia =
          colorConfigurations.rosolane_to_helvetia.gradient;
        const colorA = HSLAtoRGB(rosolaneToHelvetia[1]); // Rosolane purple
        const colorB = HSLAtoRGB(rosolaneToHelvetia[0]); // Helvetia blue
        lorenz.enableDistanceBasedColoring(colorA, colorB);
        lorenz.setOscillationCenters(
          oscillationCenters || [
            [-8, -8, 27],
            [8, 8, 27],
          ]
        );
      }

      // Add initial solutions
      for (let i = 0; i < particleCount; i++) {
        lorenz.add(Lorenz.generate());
      }

      lorenzRef.current = lorenz;
      setIsInitialized(true);

      // Initial solution count callback
      onSolutionCountChange?.(lorenz.solutions.length);
    } catch (error) {
      console.error("Failed to initialize Lorenz system:", error);
    }
  }, [
    isInitialized,
    initialParams,
    initialDisplay,
    onSolutionCountChange,
    particleCount,
    colorScheme,
    useDistanceBasedColoring,
    oscillationCenters,
  ]);

  // Handle color updates
  useEffect(() => {
    if (!isInitialized || !lorenzRef.current) return;

    if (useDistanceBasedColoring) {
      const rosolaneToHelvetia =
        colorConfigurations.rosolane_to_helvetia.gradient;
      const colorA = HSLAtoRGB(rosolaneToHelvetia[1]); // Rosolane purple
      const colorB = HSLAtoRGB(rosolaneToHelvetia[0]); // Helvetia blue
      lorenzRef.current.enableDistanceBasedColoring(colorA, colorB);
      lorenzRef.current.setOscillationCenters(
        oscillationCenters || [
          [-8, -8, 27],
          [8, 8, 27],
        ]
      );
    } else {
      const colors = getRGBColors(colorScheme);
      lorenzRef.current.disableDistanceBasedColoring();
      if (colors) {
        lorenzRef.current.setCustomColors(colors);
      } else {
        lorenzRef.current.clearCustomColors();
      }
    }
  }, [
    colorScheme,
    useDistanceBasedColoring,
    oscillationCenters,
    isInitialized,
  ]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !lorenzRef.current) return;

    const animate = () => {
      if (lorenzRef.current) {
        lorenzRef.current.step();
        lorenzRef.current.draw();

        // Update FPS callback
        onFpsChange?.(lorenzRef.current.fps);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, onFpsChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`lorenz-container ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          display: "block",
          background: "#1a1a1a",
        }}
      />
    </div>
  );
}
