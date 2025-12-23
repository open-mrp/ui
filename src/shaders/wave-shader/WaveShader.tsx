"use client";

import { useViewportWidth } from "@/hooks/useViewportWidth";
import { useEffect, useRef, useState } from "react";
import { colorConfigurations } from "../colorConfigurations";
import { calculateShaderCanvasDimensions } from "../utils/calculateShaderCanvasDimensions";
import fragmentShaderSource from "./shaders/main.glsl";
import { FragmentShader } from "./shaders/types";
import vertexShaderSource from "./shaders/vertex.glsl";
import { WaveShaderProps } from "./types";
import { PerformanceMonitor } from "./utils/PerformanceMonitor";
import { WaveShaderRenderer } from "./WaveShaderRenderer";

export function WaveShader({
  animate = true,
  colorConfiguration = "default",
  skew,
  skewDegree = 6,
  minWidth = 600,
  height: initialHeight = 275,
  seed,
  numWaves = 10,
  showPerformanceMetrics = false,
  quality = "high",
}: WaveShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shader, setShader] = useState<FragmentShader | null>(null);
  const [vertexShader, setVertexShader] = useState<string | null>(null);
  const performanceMonitor = useRef<PerformanceMonitor | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const viewportWidth = useViewportWidth();
  const [dimensions, setDimensions] = useState(() => {
    // Use minWidth for initial server render to avoid hydration mismatch
    return [minWidth, initialHeight];
  });

  useEffect(() => {
    if (viewportWidth) {
      const [newWidth, newHeight] = calculateShaderCanvasDimensions(
        { animate, colorConfiguration, skew, minWidth, height: initialHeight },
        viewportWidth
      );
      setDimensions([newWidth, newHeight]);
    }
  }, [
    viewportWidth,
    animate,
    colorConfiguration,
    skew,
    minWidth,
    initialHeight,
  ]);

  const [canvasWidth, canvasHeight] = dimensions;

  // Apply quality-based resolution scaling
  const devicePixelRatio =
    typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // For high quality, use full device pixel ratio for sharp rendering
  // For medium/low, reduce resolution for better performance
  const qualityMultiplier =
    quality === "low" ? 0.5 : quality === "high" ? 1.0 : 0.75;
  const effectiveScale = Math.min(2.0, devicePixelRatio * qualityMultiplier);

  const idealScale = Math.min(1, (viewportWidth ?? minWidth) / canvasWidth);
  const canvasScale = Math.ceil(canvasHeight * idealScale) / canvasHeight;

  const pendingUniformWrites = useRef<[string, number][]>([]);
  const colorConfigurationRef = useRef(colorConfiguration);
  colorConfigurationRef.current = colorConfiguration;

  useEffect(() => {
    async function loadShaders() {
      setVertexShader(vertexShaderSource);
      setShader({ shader: fragmentShaderSource, uniforms: {} });
    }
    loadShaders();
  }, []);

  // Set up intersection observer for visibility detection
  useEffect(() => {
    if (!canvasRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.01 } // Trigger when 1% visible
    );

    observerRef.current.observe(canvasRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shader || !vertexShader) return;

    if (!colorConfigurations[colorConfiguration]) {
      console.warn(colorConfiguration);
    }

    // Calculate effective scale for this effect
    const devicePixelRatio =
      typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const qualityMultiplier =
      quality === "low" ? 0.5 : quality === "high" ? 1.0 : 0.75;
    const effectiveScale = Math.min(2.0, devicePixelRatio * qualityMultiplier);

    // Map quality string to numeric value
    const qualityValue =
      quality === "low" ? 0.0 : quality === "high" ? 1.0 : 0.5;

    const renderer = new WaveShaderRenderer(
      canvas,
      vertexShader,
      shader.shader,
      colorConfigurations[colorConfiguration],
      seed,
      numWaves,
      qualityValue,
      effectiveScale
    );
    for (const [key, value] of Object.entries(shader.uniforms)) {
      pendingUniformWrites.current.push([key, value.value]);
    }
    if (!animate) renderer.setTimeSpeed(0, 0);

    // Initialize performance monitor
    if (showPerformanceMetrics && !performanceMonitor.current) {
      performanceMonitor.current = new PerformanceMonitor();
      performanceMonitor.current.onUpdate(setPerformanceMetrics);
    }

    let lastColorConfiguration = colorConfiguration;
    let resized = true;
    let stop = false;
    let dirty = true; // Track if rendering is needed
    let lastRenderTime = 0;
    const minFrameTime = 1000 / 60; // Cap at 60 FPS

    function tick() {
      if (stop) return;
      requestAnimationFrame(tick);

      // Skip rendering if not visible
      if (!isVisible) return;

      // Skip rendering if not animated and not dirty
      if (!animate && !dirty && !resized) return;

      // Frame rate limiting
      const now = Date.now();
      if (now - lastRenderTime < minFrameTime && !resized) return;
      lastRenderTime = now;

      // Track performance
      if (performanceMonitor.current) {
        performanceMonitor.current.measure();
      }

      if (resized) {
        const [width, height] = calculateShaderCanvasDimensions(
          {
            animate,
            colorConfiguration,
            skew,
            minWidth,
            height: initialHeight,
          },
          window.innerWidth
        );
        renderer.setDimensions(width, height, effectiveScale);
        resized = false;
      }

      if (lastColorConfiguration !== colorConfigurationRef.current) {
        lastColorConfiguration = colorConfigurationRef.current;
        renderer.setColorConfig(colorConfigurations[lastColorConfiguration]);
      }

      for (const [key, value] of pendingUniformWrites.current) {
        renderer.setUniform(key, value);
      }
      pendingUniformWrites.current.length = 0;

      renderer.render();
      dirty = false; // Reset dirty flag after render
    }
    tick();

    const resizeListener = () => (resized = true);
    window.addEventListener("resize", resizeListener);
    return () => {
      stop = true;
      window.removeEventListener("resize", resizeListener);
    };
  }, [
    animate,
    colorConfiguration,
    initialHeight,
    minWidth,
    seed,
    skew,
    shader,
    vertexShader,
    numWaves,
    quality,
    showPerformanceMetrics,
  ]);

  return (
    <div className="relative">
      {showPerformanceMetrics && performanceMetrics && (
        <div className="absolute top-2 left-2 z-10 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>
            FPS: {performanceMetrics.fps} (avg: {performanceMetrics.avgFps})
          </div>
          <div>
            Frame: {performanceMetrics.frameTimeMs}ms (avg:{" "}
            {performanceMetrics.avgFrameTimeMs}ms)
          </div>
          <div>
            Range: {Math.round(performanceMetrics.minFps)}-
            {Math.round(performanceMetrics.maxFps)} FPS
          </div>
        </div>
      )}
      <div
        className="relative max-w-full"
        style={{
          width: canvasWidth,
          ...(skew === "full" ? { transform: `skewY(-${skewDegree}deg)` } : {}),
        }}
      >
        <div style={{ paddingTop: `${(canvasHeight / canvasWidth) * 100}%` }} />
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
            width={Math.round(canvasWidth * effectiveScale)}
            height={Math.round(canvasHeight * effectiveScale)}
            className="absolute top-0 left-0"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              transform: `scale(${canvasScale})`,
              transformOrigin: "0 0",
            }}
          />
        </div>
      </div>
    </div>
  );
}
