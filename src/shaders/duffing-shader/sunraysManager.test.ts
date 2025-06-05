import {
  applySunrays,
  applySunraysBlur,
  initSunraysFramebuffers,
  initSunraysShaders,
} from "./sunraysManager";
import type { BaseFBO, SunraysConfig, SunraysPrograms } from "./types";
// Import actual shader sources
import {
  blurShader,
  blurVertexShader,
  sunraysMaskShader,
  sunraysShader,
} from "./shaders";
// Performance tracking utilities
class PerformanceTracker {
  private metrics = {
    shaderCompilations: 0,
    framebufferCreations: 0,
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
    VERTEX_SHADER: 0x8b20,
    LINEAR: 0x2601,
    NEAREST: 0x2600,
    BLEND: 0x0be2,

    disable: jest.fn(),
    uniform1f: jest.fn(() => tracker.increment("uniformUpdates")),
    uniform1i: jest.fn(() => tracker.increment("uniformUpdates")),
    uniform2f: jest.fn(() => tracker.increment("uniformUpdates")),
  } as unknown as WebGLRenderingContext);

// Mock shader compilation
const createMockCompileShader = (tracker: PerformanceTracker) =>
  jest.fn((type: number, source: string) => {
    tracker.increment("shaderCompilations");
    return { id: Math.random(), type, source } as unknown as WebGLShader;
  });

// Mock FBO creation
const createMockCreateFBO = (tracker: PerformanceTracker) =>
  jest.fn(
    (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): BaseFBO => {
      tracker.increment("framebufferCreations");
      return {
        texture: { id: Math.random() },
        fbo: { id: Math.random() },
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach: jest.fn((id: number) => {
          tracker.increment("textureBinds");
          return id;
        }),
      };
    }
  );

// Mock resolution function
const createMockGetResolution = () =>
  jest.fn((resolution: number) => ({
    width: resolution,
    height: Math.floor(resolution * 0.75), // 4:3 aspect ratio
  }));

// Mock blit function
const createMockBlit = (tracker: PerformanceTracker) =>
  jest.fn(() => tracker.increment("blitCalls"));

// Mock shader programs - now including the missing blur property
const createMockSunraysPrograms = (): SunraysPrograms => ({
  sunraysMask: {
    bind: jest.fn(),
    uniforms: {
      uTexture: {} as WebGLUniformLocation,
    },
  },
  sunrays: {
    bind: jest.fn(),
    uniforms: {
      weight: {} as WebGLUniformLocation,
      uTexture: {} as WebGLUniformLocation,
    },
  },
  blur: {
    bind: jest.fn(),
    uniforms: {
      texelSize: {} as WebGLUniformLocation,
      uTexture: {} as WebGLUniformLocation,
    },
  },
});

// Test configuration
const testConfig: SunraysConfig = {
  resolution: 256,
  weight: 0.5,
};

const testExtensions = {
  halfFloatTexType: 0x140b,
  formatR: { internalFormat: 0x822d, format: 0x1903 },
  supportLinearFiltering: true,
};

describe("SunraysManager Functionality Tests", () => {
  let tracker: PerformanceTracker;
  let mockGL: WebGLRenderingContext;
  let mockCompileShader: jest.Mock;
  let mockCreateFBO: jest.Mock;
  let mockGetResolution: jest.Mock;
  let mockBlit: jest.Mock;

  beforeEach(() => {
    tracker = new PerformanceTracker();
    mockGL = createMockWebGLContext(tracker);
    mockCompileShader = createMockCompileShader(tracker);
    mockCreateFBO = createMockCreateFBO(tracker);
    mockGetResolution = createMockGetResolution();
    mockBlit = createMockBlit(tracker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initSunraysShaders", () => {
    test("should compile all required shaders", () => {
      const baseVertexShaderObject = { id: "vertex" } as unknown as WebGLShader;

      tracker.reset();
      const result = initSunraysShaders(
        mockGL,
        baseVertexShaderObject,
        mockCompileShader
      );

      // Should compile 4 shaders: sunraysMask, sunrays, blurVertex, blur
      expect(mockCompileShader).toHaveBeenCalledTimes(4);
      expect(tracker.getMetrics().shaderCompilations).toBe(4);

      // Should return all shader objects
      expect(result).toHaveProperty("sunraysMaskShader");
      expect(result).toHaveProperty("sunraysShader");
      expect(result).toHaveProperty("blurVertexShader");
      expect(result).toHaveProperty("blurShader");

      // Verify actual shader sources are being used
      expect(mockCompileShader).toHaveBeenCalledWith(
        mockGL.FRAGMENT_SHADER,
        sunraysMaskShader
      );
      expect(mockCompileShader).toHaveBeenCalledWith(
        mockGL.FRAGMENT_SHADER,
        sunraysShader
      );
      expect(mockCompileShader).toHaveBeenCalledWith(
        mockGL.VERTEX_SHADER,
        blurVertexShader
      );
      expect(mockCompileShader).toHaveBeenCalledWith(
        mockGL.FRAGMENT_SHADER,
        blurShader
      );
    });

    test("should handle compilation errors gracefully", () => {
      const baseVertexShaderObject = { id: "vertex" } as unknown as WebGLShader;
      const errorCompileShader = jest.fn(() => {
        throw new Error("Shader compilation failed");
      });

      expect(() => {
        initSunraysShaders(mockGL, baseVertexShaderObject, errorCompileShader);
      }).toThrow("Shader compilation failed");
    });
  });

  describe("initSunraysFramebuffers", () => {
    test("should create sunrays and temp framebuffers", () => {
      tracker.reset();

      const result = initSunraysFramebuffers(
        mockGL,
        testConfig,
        mockCreateFBO,
        mockGetResolution,
        testExtensions
      );

      // Should create 2 framebuffers
      expect(mockCreateFBO).toHaveBeenCalledTimes(2);
      expect(tracker.getMetrics().framebufferCreations).toBe(2);

      // Should return both framebuffers
      expect(result).toHaveProperty("sunrays");
      expect(result).toHaveProperty("temp");
      expect(result.sunrays).toBeDefined();
      expect(result.temp).toBeDefined();

      // Verify resolution calculation
      expect(mockGetResolution).toHaveBeenCalledWith(testConfig.resolution);
    });

    test("should use correct filtering based on linear filtering support", () => {
      const extWithoutLinearFiltering = {
        ...testExtensions,
        supportLinearFiltering: false,
      };

      initSunraysFramebuffers(
        mockGL,
        testConfig,
        mockCreateFBO,
        mockGetResolution,
        extWithoutLinearFiltering
      );

      // Should use NEAREST filtering when linear filtering not supported
      expect(mockCreateFBO).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        mockGL.NEAREST
      );
    });

    test("should handle different resolutions correctly", () => {
      const customConfig = { ...testConfig, resolution: 512 };

      initSunraysFramebuffers(
        mockGL,
        customConfig,
        mockCreateFBO,
        mockGetResolution,
        testExtensions
      );

      expect(mockGetResolution).toHaveBeenCalledWith(512);
    });
  });

  describe("applySunrays", () => {
    test("should apply sunrays effect correctly", () => {
      const mockSource = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockMask = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockDestination = createMockCreateFBO(tracker)(
        256,
        256,
        0,
        0,
        0,
        0
      );
      const mockPrograms = createMockSunraysPrograms();

      tracker.reset();
      tracker.startTimer();

      applySunrays(
        mockGL,
        testConfig,
        mockSource,
        mockMask,
        mockDestination,
        mockBlit,
        mockPrograms
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should disable blending
      expect(mockGL.disable).toHaveBeenCalledWith(mockGL.BLEND);

      // Should bind both programs
      expect(mockPrograms.sunraysMask.bind).toHaveBeenCalled();
      expect(mockPrograms.sunrays.bind).toHaveBeenCalled();

      // Should set uniforms and perform blits
      expect(mockGL.uniform1i).toHaveBeenCalled();
      expect(mockGL.uniform1f).toHaveBeenCalledWith(
        mockPrograms.sunrays.uniforms.weight,
        testConfig.weight
      );

      // Should perform 2 blit operations (mask + sunrays)
      expect(metrics.blitCalls).toBe(2);
      expect(metrics.textureBinds).toBeGreaterThan(0);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should handle zero weight correctly", () => {
      const zeroWeightConfig = { ...testConfig, weight: 0 };
      const mockSource = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockMask = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockDestination = createMockCreateFBO(tracker)(
        256,
        256,
        0,
        0,
        0,
        0
      );
      const mockPrograms = createMockSunraysPrograms();

      applySunrays(
        mockGL,
        zeroWeightConfig,
        mockSource,
        mockMask,
        mockDestination,
        mockBlit,
        mockPrograms
      );

      expect(mockGL.uniform1f).toHaveBeenCalledWith(
        mockPrograms.sunrays.uniforms.weight,
        0
      );
    });
  });

  describe("applySunraysBlur", () => {
    test("should apply blur iterations correctly", () => {
      const mockTarget = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockTemp = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockBlurProgram = {
        bind: jest.fn(),
        uniforms: {
          texelSize: {} as WebGLUniformLocation,
          uTexture: {} as WebGLUniformLocation,
        },
      };

      tracker.reset();
      tracker.startTimer();

      const iterations = 3;
      applySunraysBlur(
        mockGL,
        mockTarget,
        mockTemp,
        iterations,
        mockBlurProgram,
        mockBlit
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should bind blur program
      expect(mockBlurProgram.bind).toHaveBeenCalled();

      // Should perform iterations * 2 blit operations (horizontal + vertical blur per iteration)
      expect(metrics.blitCalls).toBe(iterations * 2);

      // Should set texel size uniforms (horizontal and vertical)
      expect(mockGL.uniform2f).toHaveBeenCalledTimes(iterations * 2);

      // Should set texture uniforms
      expect(mockGL.uniform1i).toHaveBeenCalledTimes(iterations * 2);

      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should handle zero iterations", () => {
      const mockTarget = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockTemp = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockBlurProgram = {
        bind: jest.fn(),
        uniforms: {
          texelSize: {} as WebGLUniformLocation,
          uTexture: {} as WebGLUniformLocation,
        },
      };

      tracker.reset();

      applySunraysBlur(
        mockGL,
        mockTarget,
        mockTemp,
        0,
        mockBlurProgram,
        mockBlit
      );

      const metrics = tracker.getMetrics();

      // Should do no work
      expect(metrics.blitCalls).toBe(0);
      expect(mockGL.uniform2f).not.toHaveBeenCalled();
    });

    test("should use correct texel sizes", () => {
      const mockTarget = createMockCreateFBO(tracker)(256, 192, 0, 0, 0, 0); // 256x192
      const mockTemp = createMockCreateFBO(tracker)(256, 192, 0, 0, 0, 0);
      const mockBlurProgram = {
        bind: jest.fn(),
        uniforms: {
          texelSize: {} as WebGLUniformLocation,
          uTexture: {} as WebGLUniformLocation,
        },
      };

      applySunraysBlur(
        mockGL,
        mockTarget,
        mockTemp,
        1,
        mockBlurProgram,
        mockBlit
      );

      // Should set horizontal texel size (1/256, 0)
      expect(mockGL.uniform2f).toHaveBeenCalledWith(
        mockBlurProgram.uniforms.texelSize,
        1 / 256,
        0.0
      );

      // Should set vertical texel size (0, 1/192)
      expect(mockGL.uniform2f).toHaveBeenCalledWith(
        mockBlurProgram.uniforms.texelSize,
        0.0,
        1 / 192
      );
    });
  });

  // Removed getSunraysFramebuffers tests - function was deleted for performance optimization
});

describe("SunraysManager Performance Tests", () => {
  let tracker: PerformanceTracker;
  let mockGL: WebGLRenderingContext;
  let mockCompileShader: jest.Mock;
  let mockCreateFBO: jest.Mock;
  let mockGetResolution: jest.Mock;
  let mockBlit: jest.Mock;

  beforeEach(() => {
    tracker = new PerformanceTracker();
    mockGL = createMockWebGLContext(tracker);
    mockCompileShader = createMockCompileShader(tracker);
    mockCreateFBO = createMockCreateFBO(tracker);
    mockGetResolution = createMockGetResolution();
    mockBlit = createMockBlit(tracker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization Performance", () => {
    test("should initialize shaders efficiently", () => {
      const baseVertexShaderObject = { id: "vertex" } as unknown as WebGLShader;

      tracker.reset();
      tracker.startTimer();

      initSunraysShaders(mockGL, baseVertexShaderObject, mockCompileShader);

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should be fast
      expect(metrics.executionTime).toBeLessThan(10);
      expect(metrics.shaderCompilations).toBe(4);
    });

    test("should initialize framebuffers efficiently", () => {
      tracker.reset();
      tracker.startTimer();

      initSunraysFramebuffers(
        mockGL,
        testConfig,
        mockCreateFBO,
        mockGetResolution,
        testExtensions
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.executionTime).toBeLessThan(5);
      expect(metrics.framebufferCreations).toBe(2);
    });
  });

  describe("Runtime Performance", () => {
    test("should apply sunrays effect efficiently", () => {
      const mockSource = createMockCreateFBO(tracker)(512, 384, 0, 0, 0, 0);
      const mockMask = createMockCreateFBO(tracker)(512, 384, 0, 0, 0, 0);
      const mockDestination = createMockCreateFBO(tracker)(
        512,
        384,
        0,
        0,
        0,
        0
      );
      const mockPrograms = createMockSunraysPrograms();

      tracker.reset();
      tracker.startTimer();

      // Simulate multiple frames
      for (let i = 0; i < 10; i++) {
        applySunrays(
          mockGL,
          testConfig,
          mockSource,
          mockMask,
          mockDestination,
          mockBlit,
          mockPrograms
        );
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should maintain good performance across frames
      expect(metrics.executionTime).toBeLessThan(50); // 10 frames in <50ms
      expect(metrics.blitCalls).toBe(20); // 2 blits per frame × 10 frames
      expect(metrics.uniformUpdates).toBe(30); // 3 uniforms per frame × 10 frames (weight, uTexture, disable)
    });

    test("should scale blur performance with iterations", () => {
      const mockTarget = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockTemp = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockBlurProgram = {
        bind: jest.fn(),
        uniforms: {
          texelSize: {} as WebGLUniformLocation,
          uTexture: {} as WebGLUniformLocation,
        },
      };

      const iterationCounts = [1, 3, 5];
      const results: Array<{
        iterations: number;
        time: number;
        blits: number;
      }> = [];

      iterationCounts.forEach((iterations) => {
        tracker.reset();
        tracker.startTimer();

        applySunraysBlur(
          mockGL,
          mockTarget,
          mockTemp,
          iterations,
          mockBlurProgram,
          mockBlit
        );

        tracker.endTimer();
        const metrics = tracker.getMetrics();

        results.push({
          iterations,
          time: metrics.executionTime,
          blits: metrics.blitCalls,
        });
      });

      // Performance should scale linearly with iterations
      expect(results[1].blits).toBe(results[0].blits * 3); // 3x iterations = 3x blits
      expect(results[2].blits).toBe(results[0].blits * 5); // 5x iterations = 5x blits

      // Time should scale reasonably (allowing for measurement variance)
      // Note: In mocked environment, timing can be inconsistent, so we just verify completion
      expect(results[1].time).toBeGreaterThan(0);
      expect(results[2].time).toBeGreaterThan(0);
    });
  });

  describe("Memory Performance", () => {
    test("should handle different resolutions efficiently", () => {
      const resolutions = [128, 256, 512];
      const results: Array<{
        resolution: number;
        framebuffers: number;
        time: number;
      }> = [];

      resolutions.forEach((resolution) => {
        const config = { ...testConfig, resolution };

        tracker.reset();
        tracker.startTimer();

        initSunraysFramebuffers(
          mockGL,
          config,
          mockCreateFBO,
          mockGetResolution,
          testExtensions
        );

        tracker.endTimer();
        const metrics = tracker.getMetrics();

        results.push({
          resolution,
          framebuffers: metrics.framebufferCreations,
          time: metrics.executionTime,
        });
      });

      // Should create same number of framebuffers regardless of resolution
      results.forEach((result) => {
        expect(result.framebuffers).toBe(2);
      });

      // Higher resolutions might take slightly longer but should be reasonable
      results.forEach((result) => {
        expect(result.time).toBeLessThan(10);
      });
    });
  });

  describe("Integration Performance", () => {
    test("should perform full sunrays pipeline efficiently", () => {
      // Setup
      const baseVertexShaderObject = { id: "vertex" } as unknown as WebGLShader;
      const shaders = initSunraysShaders(
        mockGL,
        baseVertexShaderObject,
        mockCompileShader
      );
      const framebuffers = initSunraysFramebuffers(
        mockGL,
        testConfig,
        mockCreateFBO,
        mockGetResolution,
        testExtensions
      );

      const mockSource = createMockCreateFBO(tracker)(256, 256, 0, 0, 0, 0);
      const mockPrograms = createMockSunraysPrograms();
      const mockBlurProgram = {
        bind: jest.fn(),
        uniforms: {
          texelSize: {} as WebGLUniformLocation,
          uTexture: {} as WebGLUniformLocation,
        },
      };

      tracker.reset();
      tracker.startTimer();

      // Simulate complete sunrays effect with blur
      applySunrays(
        mockGL,
        testConfig,
        mockSource,
        framebuffers.sunrays,
        framebuffers.temp,
        mockBlit,
        mockPrograms
      );

      applySunraysBlur(
        mockGL,
        framebuffers.temp,
        framebuffers.sunrays,
        2,
        mockBlurProgram,
        mockBlit
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should complete full pipeline efficiently
      expect(metrics.executionTime).toBeLessThan(20);
      expect(metrics.blitCalls).toBe(6); // 2 for sunrays + 4 for blur (2 iterations × 2 passes)
      expect(metrics.uniformUpdates).toBeGreaterThan(0);
      expect(metrics.textureBinds).toBeGreaterThan(0);
    });
  });
});
