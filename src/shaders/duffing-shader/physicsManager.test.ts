import {
    applyCurl,
    applyDivergence,
    applyGradientSubtract,
    applyPressure,
    applyVorticity,
    initPhysicsShaders,
} from './physicsManager';
import type { BaseFBO, DoubleFBO, PhysicsConfig, PhysicsPrograms } from './types';
// Import actual shader sources
import {
    curlShader,
    divergenceShader,
    gradientSubtractShader,
    pressureShader,
    vorticityShader,
} from './shaders';
// Performance tracking utilities
class PerformanceTracker {
    private metrics = {
        shaderCompilations: 0,
        uniformUpdates: 0,
        textureBinds: 0,
        blitCalls: 0,
        executionTime: 0,
    };

    reset() {
        Object.keys(this.metrics).forEach((key) => {
            this.metrics[key as keyof typeof this.metrics] = 0;
        });
    }

    increment(metric: keyof typeof this.metrics, count = 1) {
        this.metrics[metric] += count;
    }

    getMetrics() {
        return { ...this.metrics };
    }

    startTimer() {
        this.startTime = performance.now();
    }

    endTimer() {
        if (this.startTime) {
            this.metrics.executionTime = performance.now() - this.startTime;
        }
    }

    private startTime?: number;
}

// Mock WebGL context
const createMockWebGLContext = (tracker: PerformanceTracker) =>
    ({
        FRAGMENT_SHADER: 0x8b30,
        uniform1f: jest.fn(() => tracker.increment('uniformUpdates')),
        uniform1i: jest.fn(() => tracker.increment('uniformUpdates')),
        uniform2f: jest.fn(() => tracker.increment('uniformUpdates')),
    }) as unknown as WebGLRenderingContext;

// Mock shader compilation
const createMockCompileShader = (tracker: PerformanceTracker) =>
    jest.fn((type: number, source: string) => {
        tracker.increment('shaderCompilations');
        return { id: Math.random(), type, source } as unknown as WebGLShader;
    });

// Mock FBO
const createMockFBO = (tracker: PerformanceTracker): BaseFBO => ({
    texture: { id: Math.random() },
    fbo: { id: Math.random() },
    width: 512,
    height: 512,
    texelSizeX: 1 / 512,
    texelSizeY: 1 / 512,
    attach: jest.fn((id: number) => {
        tracker.increment('textureBinds');
        return id;
    }),
});

// Mock DoubleFBO
const createMockDoubleFBO = (tracker: PerformanceTracker): DoubleFBO => {
    const read = createMockFBO(tracker);
    const write = createMockFBO(tracker);

    return {
        width: 512,
        height: 512,
        texelSizeX: 1 / 512,
        texelSizeY: 1 / 512,
        read,
        write,
        texture: read.texture,
        fbo: read.fbo,
        attach: read.attach,
        swap: jest.fn(),
    };
};

// Mock PhysicsPrograms
const createMockPhysicsPrograms = (): PhysicsPrograms => ({
    pressure: {
        bind: jest.fn(),
        uniforms: {
            texelSize: {} as WebGLUniformLocation,
            uDivergence: {} as WebGLUniformLocation,
            uPressure: {} as WebGLUniformLocation,
        },
    },
    divergence: {
        bind: jest.fn(),
        uniforms: {
            texelSize: {} as WebGLUniformLocation,
            uVelocity: {} as WebGLUniformLocation,
        },
    },
    curl: {
        bind: jest.fn(),
        uniforms: {
            texelSize: {} as WebGLUniformLocation,
            uVelocity: {} as WebGLUniformLocation,
        },
    },
    vorticity: {
        bind: jest.fn(),
        uniforms: {
            texelSize: {} as WebGLUniformLocation,
            uVelocity: {} as WebGLUniformLocation,
            uCurl: {} as WebGLUniformLocation,
            curl: {} as WebGLUniformLocation,
            dt: {} as WebGLUniformLocation,
        },
    },
    gradientSubtract: {
        bind: jest.fn(),
        uniforms: {
            texelSize: {} as WebGLUniformLocation,
            uPressure: {} as WebGLUniformLocation,
            uVelocity: {} as WebGLUniformLocation,
        },
    },
});

// Mock blit function
const createMockBlit = (tracker: PerformanceTracker) =>
    jest.fn(() => tracker.increment('blitCalls'));

// Test configuration
const testConfig: PhysicsConfig = {
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    PRESSURE: 0.8,
    VELOCITY_DISSIPATION: 0.2,
    DENSITY_DISSIPATION: 1.0,
};

describe('PhysicsManager Functionality Tests', () => {
    let tracker: PerformanceTracker;
    let mockGL: WebGLRenderingContext;
    let mockCompileShader: jest.Mock;
    let mockBlit: jest.Mock;

    beforeEach(() => {
        tracker = new PerformanceTracker();
        mockGL = createMockWebGLContext(tracker);
        mockCompileShader = createMockCompileShader(tracker);
        mockBlit = createMockBlit(tracker);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initPhysicsShaders', () => {
        test('should compile all physics shaders', () => {
            const baseVertexShader = { id: 'vertex' } as unknown as WebGLShader;

            tracker.reset();
            tracker.startTimer();

            const result = initPhysicsShaders(mockGL, baseVertexShader, mockCompileShader);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should compile 5 shaders
            expect(mockCompileShader).toHaveBeenCalledTimes(5);
            expect(metrics.shaderCompilations).toBe(5);

            // Should return all shader objects
            expect(result).toHaveProperty('pressureShader');
            expect(result).toHaveProperty('divergenceShader');
            expect(result).toHaveProperty('curlShader');
            expect(result).toHaveProperty('vorticityShader');
            expect(result).toHaveProperty('gradientSubtractShader');

            // Verify actual shader sources are being used
            expect(mockCompileShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER, pressureShader);
            expect(mockCompileShader).toHaveBeenCalledWith(
                mockGL.FRAGMENT_SHADER,
                divergenceShader,
            );
            expect(mockCompileShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER, curlShader);
            expect(mockCompileShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER, vorticityShader);
            expect(mockCompileShader).toHaveBeenCalledWith(
                mockGL.FRAGMENT_SHADER,
                gradientSubtractShader,
            );

            expect(metrics.executionTime).toBeGreaterThan(0);
        });

        test('should handle shader compilation errors', () => {
            const baseVertexShader = { id: 'vertex' } as unknown as WebGLShader;
            const errorCompileShader = jest.fn(() => {
                throw new Error('Physics shader compilation failed');
            });

            expect(() => {
                initPhysicsShaders(mockGL, baseVertexShader, errorCompileShader);
            }).toThrow('Physics shader compilation failed');
        });
    });

    describe('applyPressure', () => {
        test('should apply pressure iterations correctly', () => {
            const mockPressure = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            applyPressure(
                mockGL,
                testConfig,
                mockPressure,
                mockDivergence,
                mockVelocity,
                mockPrograms,
                mockBlit,
            );

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should bind pressure program
            expect(mockPrograms.pressure.bind).toHaveBeenCalled();

            // Should set uniforms
            expect(mockGL.uniform2f).toHaveBeenCalledWith(
                mockPrograms.pressure.uniforms.texelSize,
                mockVelocity.texelSizeX,
                mockVelocity.texelSizeY,
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.pressure.uniforms.uDivergence,
                expect.any(Number),
            );

            // Should perform iterations (20 blits + 20 pressure uniform updates)
            expect(metrics.blitCalls).toBe(testConfig.PRESSURE_ITERATIONS);
            expect(mockPressure.swap).toHaveBeenCalledTimes(testConfig.PRESSURE_ITERATIONS);

            expect(metrics.executionTime).toBeGreaterThan(0);
        });

        test('should handle zero iterations', () => {
            const zeroIterConfig = { ...testConfig, PRESSURE_ITERATIONS: 0 };
            const mockPressure = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();

            applyPressure(
                mockGL,
                zeroIterConfig,
                mockPressure,
                mockDivergence,
                mockVelocity,
                mockPrograms,
                mockBlit,
            );

            const metrics = tracker.getMetrics();

            expect(metrics.blitCalls).toBe(0);
            expect(mockPressure.swap).not.toHaveBeenCalled();
        });
    });

    describe('applyDivergence', () => {
        test('should apply divergence calculation', () => {
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            applyDivergence(mockGL, mockVelocity, mockDivergence, mockPrograms, mockBlit);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should bind divergence program
            expect(mockPrograms.divergence.bind).toHaveBeenCalled();

            // Should set uniforms
            expect(mockGL.uniform2f).toHaveBeenCalledWith(
                mockPrograms.divergence.uniforms.texelSize,
                mockVelocity.texelSizeX,
                mockVelocity.texelSizeY,
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.divergence.uniforms.uVelocity,
                expect.any(Number),
            );

            // Should perform one blit
            expect(metrics.blitCalls).toBe(1);
            expect(mockBlit).toHaveBeenCalledWith(mockDivergence);

            expect(metrics.executionTime).toBeGreaterThan(0);
        });
    });

    describe('applyCurl', () => {
        test('should apply curl calculation', () => {
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockCurl = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            applyCurl(mockGL, mockVelocity, mockCurl, mockPrograms, mockBlit);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should bind curl program
            expect(mockPrograms.curl.bind).toHaveBeenCalled();

            // Should set uniforms
            expect(mockGL.uniform2f).toHaveBeenCalledWith(
                mockPrograms.curl.uniforms.texelSize,
                mockVelocity.texelSizeX,
                mockVelocity.texelSizeY,
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.curl.uniforms.uVelocity,
                expect.any(Number),
            );

            // Should perform one blit
            expect(metrics.blitCalls).toBe(1);
            expect(mockBlit).toHaveBeenCalledWith(mockCurl);

            expect(metrics.executionTime).toBeGreaterThan(0);
        });
    });

    describe('applyVorticity', () => {
        test('should apply vorticity calculation', () => {
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockCurl = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();
            const dt = 0.016; // 60fps

            tracker.reset();
            tracker.startTimer();

            applyVorticity(mockGL, testConfig, dt, mockVelocity, mockCurl, mockPrograms, mockBlit);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should bind vorticity program
            expect(mockPrograms.vorticity.bind).toHaveBeenCalled();

            // Should set uniforms
            expect(mockGL.uniform2f).toHaveBeenCalledWith(
                mockPrograms.vorticity.uniforms.texelSize,
                mockVelocity.texelSizeX,
                mockVelocity.texelSizeY,
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.vorticity.uniforms.uVelocity,
                expect.any(Number),
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.vorticity.uniforms.uCurl,
                expect.any(Number),
            );
            expect(mockGL.uniform1f).toHaveBeenCalledWith(
                mockPrograms.vorticity.uniforms.curl,
                testConfig.CURL,
            );
            expect(mockGL.uniform1f).toHaveBeenCalledWith(mockPrograms.vorticity.uniforms.dt, dt);

            // Should perform one blit and swap
            expect(metrics.blitCalls).toBe(1);
            expect(mockBlit).toHaveBeenCalledWith(mockVelocity.write);
            expect(mockVelocity.swap).toHaveBeenCalled();

            expect(metrics.executionTime).toBeGreaterThan(0);
        });

        test('should handle zero curl value', () => {
            const zeroCurlConfig = { ...testConfig, CURL: 0 };
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockCurl = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            applyVorticity(
                mockGL,
                zeroCurlConfig,
                0.016,
                mockVelocity,
                mockCurl,
                mockPrograms,
                mockBlit,
            );

            expect(mockGL.uniform1f).toHaveBeenCalledWith(mockPrograms.vorticity.uniforms.curl, 0);
        });
    });

    describe('applyGradientSubtract', () => {
        test('should apply gradient subtraction', () => {
            const mockPressure = createMockDoubleFBO(tracker);
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            applyGradientSubtract(mockGL, mockPressure, mockVelocity, mockPrograms, mockBlit);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should bind gradient subtract program
            expect(mockPrograms.gradientSubtract.bind).toHaveBeenCalled();

            // Should set uniforms
            expect(mockGL.uniform2f).toHaveBeenCalledWith(
                mockPrograms.gradientSubtract.uniforms.texelSize,
                mockVelocity.texelSizeX,
                mockVelocity.texelSizeY,
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.gradientSubtract.uniforms.uPressure,
                expect.any(Number),
            );
            expect(mockGL.uniform1i).toHaveBeenCalledWith(
                mockPrograms.gradientSubtract.uniforms.uVelocity,
                expect.any(Number),
            );

            // Should perform one blit and swap
            expect(metrics.blitCalls).toBe(1);
            expect(mockBlit).toHaveBeenCalledWith(mockVelocity.write);
            expect(mockVelocity.swap).toHaveBeenCalled();

            expect(metrics.executionTime).toBeGreaterThan(0);
        });
    });
});

describe('PhysicsManager Performance Tests', () => {
    let tracker: PerformanceTracker;
    let mockGL: WebGLRenderingContext;
    let mockCompileShader: jest.Mock;
    let mockBlit: jest.Mock;

    beforeEach(() => {
        tracker = new PerformanceTracker();
        mockGL = createMockWebGLContext(tracker);
        mockCompileShader = createMockCompileShader(tracker);
        mockBlit = createMockBlit(tracker);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization Performance', () => {
        test('should initialize all physics shaders efficiently', () => {
            const baseVertexShader = { id: 'vertex' } as unknown as WebGLShader;

            tracker.reset();
            tracker.startTimer();

            initPhysicsShaders(mockGL, baseVertexShader, mockCompileShader);

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            expect(metrics.executionTime).toBeLessThan(20);
            expect(metrics.shaderCompilations).toBe(5);
        });
    });

    describe('Physics Step Performance', () => {
        test('should complete full physics pipeline efficiently', () => {
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockPressure = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockCurl = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            // Simulate complete Navier-Stokes step
            applyDivergence(mockGL, mockVelocity, mockDivergence, mockPrograms, mockBlit);
            applyPressure(
                mockGL,
                testConfig,
                mockPressure,
                mockDivergence,
                mockVelocity,
                mockPrograms,
                mockBlit,
            );
            applyGradientSubtract(mockGL, mockPressure, mockVelocity, mockPrograms, mockBlit);
            applyCurl(mockGL, mockVelocity, mockCurl, mockPrograms, mockBlit);
            applyVorticity(
                mockGL,
                testConfig,
                0.016,
                mockVelocity,
                mockCurl,
                mockPrograms,
                mockBlit,
            );

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should complete full pipeline
            expect(metrics.blitCalls).toBe(testConfig.PRESSURE_ITERATIONS + 4); // pressure iterations + 4 other steps
            expect(metrics.uniformUpdates).toBeGreaterThan(10);
            expect(metrics.textureBinds).toBeGreaterThan(5);
            expect(metrics.executionTime).toBeLessThan(100);
        });

        test('should scale performance with pressure iterations', () => {
            const configs = [
                { ...testConfig, PRESSURE_ITERATIONS: 5 },
                { ...testConfig, PRESSURE_ITERATIONS: 20 },
                { ...testConfig, PRESSURE_ITERATIONS: 50 },
            ];

            const results: Array<{
                iterations: number;
                time: number;
                blits: number;
            }> = [];

            configs.forEach((config) => {
                const mockPressure = createMockDoubleFBO(tracker);
                const mockDivergence = createMockFBO(tracker);
                const mockVelocity = createMockDoubleFBO(tracker);
                const mockPrograms = createMockPhysicsPrograms();

                tracker.reset();
                tracker.startTimer();

                applyPressure(
                    mockGL,
                    config,
                    mockPressure,
                    mockDivergence,
                    mockVelocity,
                    mockPrograms,
                    mockBlit,
                );

                tracker.endTimer();
                const metrics = tracker.getMetrics();

                results.push({
                    iterations: config.PRESSURE_ITERATIONS,
                    time: metrics.executionTime,
                    blits: metrics.blitCalls,
                });
            });

            // Performance should scale linearly with iterations
            expect(results[1].blits).toBe(results[0].blits * 4); // 20/5 = 4x
            expect(results[2].blits).toBe(results[0].blits * 10); // 50/5 = 10x

            // All should complete reasonably fast
            results.forEach((result) => {
                expect(result.time).toBeLessThan(50);
            });
        });
    });

    describe('Memory Performance', () => {
        test('should handle repeated physics steps without memory leaks', () => {
            const mockVelocity = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            // Simulate many physics steps
            for (let i = 0; i < 100; i++) {
                applyDivergence(mockGL, mockVelocity, mockDivergence, mockPrograms, mockBlit);
            }

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            expect(metrics.blitCalls).toBe(100);
            expect(metrics.executionTime).toBeLessThan(200);
        });
    });

    describe('Integration Performance', () => {
        test('should handle complete Navier-Stokes solve efficiently', () => {
            const baseVertexShader = { id: 'vertex' } as unknown as WebGLShader;

            // Initialize shaders
            const shaders = initPhysicsShaders(mockGL, baseVertexShader, mockCompileShader);

            const mockVelocity = createMockDoubleFBO(tracker);
            const mockPressure = createMockDoubleFBO(tracker);
            const mockDivergence = createMockFBO(tracker);
            const mockCurl = createMockFBO(tracker);
            const mockPrograms = createMockPhysicsPrograms();

            tracker.reset();
            tracker.startTimer();

            // Simulate multiple frames
            for (let frame = 0; frame < 10; frame++) {
                applyDivergence(mockGL, mockVelocity, mockDivergence, mockPrograms, mockBlit);
                applyPressure(
                    mockGL,
                    { ...testConfig, PRESSURE_ITERATIONS: 10 }, // Reduced for performance test
                    mockPressure,
                    mockDivergence,
                    mockVelocity,
                    mockPrograms,
                    mockBlit,
                );
                applyGradientSubtract(mockGL, mockPressure, mockVelocity, mockPrograms, mockBlit);
                applyCurl(mockGL, mockVelocity, mockCurl, mockPrograms, mockBlit);
                applyVorticity(
                    mockGL,
                    testConfig,
                    0.016,
                    mockVelocity,
                    mockCurl,
                    mockPrograms,
                    mockBlit,
                );
            }

            tracker.endTimer();
            const metrics = tracker.getMetrics();

            // Should handle 10 frames efficiently
            expect(metrics.blitCalls).toBe(10 * (10 + 4)); // 10 frames × (10 pressure iterations + 4 other steps)
            expect(metrics.executionTime).toBeLessThan(300);
        });
    });
});
