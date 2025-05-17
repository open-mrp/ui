"use client";

import React from "react";

import { useViewportWidth } from "@/hooks/useViewportWidth";
import { useEffect, useRef, useState } from "react";
import { calculateShaderCanvasDimensions } from "../utils/calculateShaderCanvasDimensions";
import { WaveShaderRenderer } from "./WaveShaderRenderer";
import { colorConfigurations } from "./colorConfigurations";
import fragmentShaderSource from "./shaders/main.glsl";
import { FragmentShader } from "./shaders/types";
import vertexShaderSource from "./shaders/vertex.glsl";
import { WaveShaderProps } from "./types";

export function WaveShader({
  animate = true,
  colorConfiguration = "default",
  skew,
  skewDegree = 6,
  minWidth = 600,
  height: initialHeight = 275,
  seed,
}: WaveShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shader, setShader] = useState<FragmentShader | null>(null);
  const [vertexShader, setVertexShader] = useState<string | null>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shader || !vertexShader) return;

    if (!colorConfigurations[colorConfiguration]) {
      console.warn(colorConfiguration);
    }
    const renderer = new WaveShaderRenderer(
      canvas,
      vertexShader,
      shader.shader,
      colorConfigurations[colorConfiguration],
      seed
    );
    for (const [key, value] of Object.entries(shader.uniforms)) {
      pendingUniformWrites.current.push([key, value.value]);
    }
    if (!animate) renderer.setTimeSpeed(0, 0);

    let lastColorConfiguration = colorConfiguration;
    let resized = true;
    let stop = false;

    function tick() {
      if (stop) return;
      requestAnimationFrame(tick);

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
        renderer.setDimensions(width, height);
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
  ]);

  return (
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
          width={canvasWidth}
          height={canvasHeight}
          className="absolute top-0 left-0"
          style={{
            transform: `scale(${canvasScale})`,
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
}
