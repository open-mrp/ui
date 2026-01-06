'use client';

import { useIsomorphicViewportWidth } from '@/hooks/useViewportWidth';
import { useEffect, useRef, useState } from 'react';
import { colorConfigurations } from '../colorConfigurations';
import { calculateShaderCanvasDimensions } from '../utils/calculateShaderCanvasDimensions';
import fragmentShaderSource from './shaders/main.glsl';
import { FragmentShader } from './shaders/types';
import vertexShaderSource from './shaders/vertex.glsl';
import { DEFAULT_BACKGROUND_COLOR, WaveShaderProps } from './types';
import { PerformanceMonitor } from './utils/PerformanceMonitor';
import { WaveShaderRenderer } from './WaveShaderRenderer';

export function WaveShader({
    animate = true,
    colorConfiguration = 'default',
    skew,
    skewDegree = 6,
    width,
    height: initialHeight = 275,
    seed,
    numWaves = 8,
    showPerformanceMetrics = false,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
}: WaveShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shader, setShader] = useState<FragmentShader | null>(null);
    const [vertexShader, setVertexShader] = useState<string | null>(null);
    const performanceMonitor = useRef<PerformanceMonitor | null>(null);
    const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Use isomorphic viewport width to ensure SSR/client initial values match (both start as null)
    const viewportWidth = useIsomorphicViewportWidth();
    const [dimensions, setDimensions] = useState(() => {
        // Use width or a reasonable default for initial server render
        return [width ?? 600, initialHeight];
    });

    useEffect(() => {
        if (viewportWidth) {
            const [newWidth, newHeight] = calculateShaderCanvasDimensions(
                { animate, colorConfiguration, skew, width, height: initialHeight },
                viewportWidth,
            );
            setDimensions([newWidth, newHeight]);
        }
    }, [viewportWidth, animate, colorConfiguration, skew, width, initialHeight]);

    const [canvasWidth, canvasHeight] = dimensions;

    // Initialize with server-safe default (1) to avoid hydration mismatch
    const [effectiveScale, setEffectiveScale] = useState(1);

    // Update scale on client after hydration
    useEffect(() => {
        const dpr = window.devicePixelRatio ?? 1;
        setEffectiveScale(Math.min(2.0, dpr));
    }, []);

    // Use consistent default width for canvasScale calculation during SSR
    const effectiveViewportWidth = viewportWidth ?? width ?? 600;
    const idealScale = Math.min(1, effectiveViewportWidth / canvasWidth);
    const canvasScale = Math.ceil(canvasHeight * idealScale) / canvasHeight;

    const pendingUniformWrites = useRef<[string, number][]>([]);
    const colorConfigurationRef = useRef(colorConfiguration);
    colorConfigurationRef.current = colorConfiguration;
    const backgroundColorRef = useRef(backgroundColor);
    backgroundColorRef.current = backgroundColor;

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
            { threshold: 0.01 }, // Trigger when 1% visible
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
        const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
        const currentEffectiveScale = Math.min(2.0, devicePixelRatio);

        const renderer = new WaveShaderRenderer(
            canvas,
            vertexShader,
            shader.shader,
            colorConfigurations[colorConfiguration],
            seed,
            numWaves,
            currentEffectiveScale,
            backgroundColor,
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
        let lastBackgroundColor = backgroundColor;
        let resized = true;
        let stop = false;
        let dirty = true; // Track if rendering is needed
        let lastRenderTime = 0;
        const minFrameTime = 1000 / 60; // Cap at 60 FPS

        function tick() {
            // Check both stop flag and renderer disposed state
            if (stop || renderer.isDisposed()) return;
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
                const [newWidth, newHeight] = calculateShaderCanvasDimensions(
                    {
                        animate,
                        colorConfiguration,
                        skew,
                        width,
                        height: initialHeight,
                    },
                    window.innerWidth,
                );
                renderer.setDimensions(newWidth, newHeight, currentEffectiveScale);
                resized = false;
            }

            if (lastColorConfiguration !== colorConfigurationRef.current) {
                lastColorConfiguration = colorConfigurationRef.current;
                renderer.setColorConfig(colorConfigurations[lastColorConfiguration]);
            }

            // Update background color if changed
            const currentBgColor = backgroundColorRef.current;
            if (
                lastBackgroundColor[0] !== currentBgColor[0] ||
                lastBackgroundColor[1] !== currentBgColor[1] ||
                lastBackgroundColor[2] !== currentBgColor[2]
            ) {
                lastBackgroundColor = currentBgColor;
                renderer.setBackgroundColor(currentBgColor);
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
        window.addEventListener('resize', resizeListener);
        return () => {
            stop = true;
            window.removeEventListener('resize', resizeListener);
            // Properly dispose of WebGL resources
            renderer.dispose();
        };
    }, [
        animate,
        colorConfiguration,
        initialHeight,
        width,
        seed,
        skew,
        shader,
        vertexShader,
        numWaves,
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
                        Frame: {performanceMetrics.frameTimeMs}ms (avg:{' '}
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
                    ...(skew === 'full' ? { transform: `skewY(-${skewDegree}deg)` } : {}),
                }}
            >
                <div style={{ paddingTop: `${(canvasHeight / canvasWidth) * 100}%` }} />
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        clipPath:
                            skew === 'bottom'
                                ? `polygon(0 0, 100% 0, 100% ${50 + skewDegree / 2}%, 0 100%)`
                                : 'none',
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
                            transformOrigin: '0 0',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
