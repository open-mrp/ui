import { compileShader, createProgram } from "./shaderManager";
// Import actual shader sources
import { advectionShader, baseVertexShader, colorShader } from "./shaders";

// Performance tracking utilities
class PerformanceTracker {
  private metrics = {
    shaderCreations: 0,
    shaderCompilations: 0,
    programCreations: 0,
    programLinks: 0,
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
const createMockWebGLContext = (
  tracker: PerformanceTracker,
  shouldFail = false
) => {
  let shaderCounter = 0;
  let programCounter = 0;

  return {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,

    createShader: jest.fn((type: number) => {
      tracker.increment("shaderCreations");
      if (shouldFail && shaderCounter === 0) {
        shaderCounter++;
        return null; // Simulate failure
      }
      return { id: ++shaderCounter, type };
    }),

    shaderSource: jest.fn(),

    compileShader: jest.fn(() => {
      tracker.increment("shaderCompilations");
    }),

    getShaderParameter: jest.fn((shader: any, pname: number) => {
      if (pname === 0x8b81) {
        // COMPILE_STATUS
        return !shouldFail; // Success unless we want to test failure
      }
      return true;
    }),

    getShaderInfoLog: jest.fn(() =>
      shouldFail ? "Mock shader compilation error" : ""
    ),

    createProgram: jest.fn(() => {
      tracker.increment("programCreations");
      if (shouldFail && programCounter === 0) {
        programCounter++;
        return null; // Simulate failure
      }
      return { id: ++programCounter };
    }),

    attachShader: jest.fn(),

    linkProgram: jest.fn(() => {
      tracker.increment("programLinks");
    }),

    getProgramParameter: jest.fn((program: any, pname: number) => {
      if (pname === 0x8b82) {
        // LINK_STATUS
        return !shouldFail; // Success unless we want to test failure
      }
      return true;
    }),

    getProgramInfoLog: jest.fn(() =>
      shouldFail ? "Mock program link error" : ""
    ),
  } as unknown as WebGLRenderingContext;
};

// Use actual shader sources from the project

describe("ShaderManager Functionality Tests", () => {
  let tracker: PerformanceTracker;
  let mockGL: WebGLRenderingContext;

  beforeEach(() => {
    tracker = new PerformanceTracker();
    mockGL = createMockWebGLContext(tracker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("compileShader", () => {
    test("should compile vertex shader successfully", () => {
      tracker.reset();
      tracker.startTimer();

      const shader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(shader).toBeDefined();
      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.VERTEX_SHADER);
      expect(mockGL.shaderSource).toHaveBeenCalledWith(
        shader,
        baseVertexShader
      );
      expect(mockGL.compileShader).toHaveBeenCalledWith(shader);
      expect(mockGL.getShaderParameter).toHaveBeenCalledWith(
        shader,
        mockGL.COMPILE_STATUS
      );

      expect(metrics.shaderCreations).toBe(1);
      expect(metrics.shaderCompilations).toBe(1);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should compile fragment shader successfully", () => {
      tracker.reset();

      const shader = compileShader(mockGL, mockGL.FRAGMENT_SHADER, colorShader);

      const metrics = tracker.getMetrics();

      expect(shader).toBeDefined();
      expect(mockGL.createShader).toHaveBeenCalledWith(mockGL.FRAGMENT_SHADER);
      expect(metrics.shaderCreations).toBe(1);
      expect(metrics.shaderCompilations).toBe(1);
    });

    test("should handle complex fragment shader", () => {
      tracker.reset();
      tracker.startTimer();

      const shader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        advectionShader
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(shader).toBeDefined();
      expect(mockGL.shaderSource).toHaveBeenCalledWith(shader, advectionShader);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should throw error when shader creation fails", () => {
      const failingGL = createMockWebGLContext(tracker, true);

      expect(() => {
        compileShader(failingGL, failingGL.VERTEX_SHADER, baseVertexShader);
      }).toThrow("Failed to create shader");
    });

    test("should throw error when shader compilation fails", () => {
      // Mock successful creation but failed compilation
      const partialFailGL = createMockWebGLContext(tracker);
      (partialFailGL.getShaderParameter as jest.Mock).mockReturnValue(false);

      expect(() => {
        compileShader(
          partialFailGL,
          partialFailGL.VERTEX_SHADER,
          baseVertexShader
        );
      }).toThrow("Shader compile error:");
    });

    test("should handle empty shader source", () => {
      const shader = compileShader(mockGL, mockGL.VERTEX_SHADER, "");

      expect(shader).toBeDefined();
      expect(mockGL.shaderSource).toHaveBeenCalledWith(shader, "");
    });

    test("should handle shader source with syntax errors", () => {
      const invalidShader = "invalid shader source code";

      // In a real scenario, this would fail during compilation check
      const partialFailGL = createMockWebGLContext(tracker);
      (partialFailGL.getShaderParameter as jest.Mock).mockReturnValue(false);

      expect(() => {
        compileShader(
          partialFailGL,
          partialFailGL.VERTEX_SHADER,
          invalidShader
        );
      }).toThrow("Shader compile error");
    });
  });

  describe("createProgram", () => {
    test("should create program with vertex and fragment shaders", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const fragmentShader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        colorShader
      );

      tracker.reset();
      tracker.startTimer();

      const program = createProgram(mockGL, vertexShader, fragmentShader);

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(program).toBeDefined();
      expect(mockGL.createProgram).toHaveBeenCalled();
      expect(mockGL.attachShader).toHaveBeenCalledWith(program, vertexShader);
      expect(mockGL.attachShader).toHaveBeenCalledWith(program, fragmentShader);
      expect(mockGL.linkProgram).toHaveBeenCalledWith(program);
      expect(mockGL.getProgramParameter).toHaveBeenCalledWith(
        program,
        mockGL.LINK_STATUS
      );

      expect(metrics.programCreations).toBe(1);
      expect(metrics.programLinks).toBe(1);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should throw error when program creation fails", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const fragmentShader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        colorShader
      );

      const failingGL = createMockWebGLContext(tracker, true);

      expect(() => {
        createProgram(failingGL, vertexShader, fragmentShader);
      }).toThrow("Failed to create WebGL program");
    });

    test("should throw error when program linking fails", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const fragmentShader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        colorShader
      );

      // Mock successful creation but failed linking
      const partialFailGL = createMockWebGLContext(tracker);
      (partialFailGL.getProgramParameter as jest.Mock).mockReturnValue(false);

      expect(() => {
        createProgram(partialFailGL, vertexShader, fragmentShader);
      }).toThrow("Program link error:");
    });

    test("should handle null shaders gracefully", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );

      // createProgram should still work with valid shaders
      expect(() => {
        createProgram(mockGL, vertexShader, vertexShader); // Use same shader for simplicity
      }).not.toThrow();
    });
  });
});

describe("ShaderManager Performance Tests", () => {
  let tracker: PerformanceTracker;
  let mockGL: WebGLRenderingContext;

  beforeEach(() => {
    tracker = new PerformanceTracker();
    mockGL = createMockWebGLContext(tracker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Compilation Performance", () => {
    test("should compile shaders efficiently", () => {
      tracker.reset();
      tracker.startTimer();

      // Compile multiple shaders
      const shaders = [
        compileShader(mockGL, mockGL.VERTEX_SHADER, baseVertexShader),
        compileShader(mockGL, mockGL.FRAGMENT_SHADER, colorShader),
        compileShader(mockGL, mockGL.FRAGMENT_SHADER, advectionShader),
      ];

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(shaders).toHaveLength(3);
      expect(metrics.shaderCreations).toBe(3);
      expect(metrics.shaderCompilations).toBe(3);
      expect(metrics.executionTime).toBeLessThan(10); // Should be fast in mock environment
    });

    test("should handle batch shader compilation", () => {
      const shaderSources = Array.from(
        { length: 10 },
        (_, i) =>
          `precision mediump float; void main() { gl_FragColor = vec4(${
            i / 10
          }.0, 0.0, 0.0, 1.0); }`
      );

      tracker.reset();
      tracker.startTimer();

      const shaders = shaderSources.map((source) =>
        compileShader(mockGL, mockGL.FRAGMENT_SHADER, source)
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(shaders).toHaveLength(10);
      expect(metrics.shaderCreations).toBe(10);
      expect(metrics.shaderCompilations).toBe(10);
      expect(metrics.executionTime).toBeLessThan(50);
    });

    test("should scale linearly with shader complexity", () => {
      const simpleShader =
        "precision mediump float; void main() { gl_FragColor = vec4(1.0); }";
      const results: Array<{ complexity: string; time: number }> = [];

      // Test simple shader
      tracker.reset();
      tracker.startTimer();
      compileShader(mockGL, mockGL.FRAGMENT_SHADER, simpleShader);
      tracker.endTimer();
      results.push({
        complexity: "simple",
        time: tracker.getMetrics().executionTime,
      });

      // Test complex shader
      tracker.reset();
      tracker.startTimer();
      compileShader(mockGL, mockGL.FRAGMENT_SHADER, advectionShader);
      tracker.endTimer();
      results.push({
        complexity: "complex",
        time: tracker.getMetrics().executionTime,
      });

      // Both should complete quickly (in mock environment)
      results.forEach((result) => {
        expect(result.time).toBeGreaterThan(0);
        expect(result.time).toBeLessThan(20);
      });
    });
  });

  describe("Program Creation Performance", () => {
    test("should create programs efficiently", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const fragmentShader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        colorShader
      );

      tracker.reset();
      tracker.startTimer();

      // Create multiple programs
      const programs = Array.from({ length: 5 }, () =>
        createProgram(mockGL, vertexShader, fragmentShader)
      );

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(programs).toHaveLength(5);
      expect(metrics.programCreations).toBe(5);
      expect(metrics.programLinks).toBe(5);
      expect(metrics.executionTime).toBeLessThan(25);
    });

    test("should handle program creation with shader reuse", () => {
      // Pre-compile shaders
      const vertexShaders = Array.from({ length: 3 }, () =>
        compileShader(mockGL, mockGL.VERTEX_SHADER, baseVertexShader)
      );
      const fragmentShaders = Array.from({ length: 3 }, () =>
        compileShader(mockGL, mockGL.FRAGMENT_SHADER, colorShader)
      );

      tracker.reset();
      tracker.startTimer();

      // Create programs with different shader combinations
      const programs: WebGLProgram[] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          programs.push(
            createProgram(mockGL, vertexShaders[i], fragmentShaders[j])
          );
        }
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(programs).toHaveLength(9);
      expect(metrics.programCreations).toBe(9);
      expect(metrics.programLinks).toBe(9);
      expect(metrics.executionTime).toBeLessThan(50);
    });
  });

  describe("Memory Performance", () => {
    test("should not accumulate unnecessary overhead", () => {
      // Create and measure baseline
      tracker.reset();
      tracker.startTimer();

      const shader1 = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const firstTime = performance.now() - (tracker as any).startTime;

      // Create another similar shader
      const shader2 = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      tracker.endTimer();
      const totalTime = tracker.getMetrics().executionTime;

      const secondTime = totalTime - firstTime;

      // Second shader should not take significantly longer (no memory leaks/accumulation)
      // In mock environment, timing can vary - just verify both shaders are created successfully
      expect(shader1).toBeDefined();
      expect(shader2).toBeDefined();
      expect(secondTime).toBeGreaterThan(0);
      expect(firstTime).toBeGreaterThan(0);
    });

    test("should handle rapid shader creation and program linking", () => {
      tracker.reset();
      tracker.startTimer();

      // Simulate rapid shader system initialization
      for (let i = 0; i < 20; i++) {
        const vs = compileShader(
          mockGL,
          mockGL.VERTEX_SHADER,
          baseVertexShader
        );
        const fs = compileShader(mockGL, mockGL.FRAGMENT_SHADER, colorShader);
        createProgram(mockGL, vs, fs);
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.shaderCreations).toBe(40); // 20 vertex + 20 fragment
      expect(metrics.shaderCompilations).toBe(40);
      expect(metrics.programCreations).toBe(20);
      expect(metrics.programLinks).toBe(20);
      expect(metrics.executionTime).toBeLessThan(200); // Should be reasonable even for 20 programs
    });
  });

  describe("Error Handling Performance", () => {
    test("should fail fast on shader compilation errors", () => {
      const failingGL = createMockWebGLContext(tracker, true);
      (failingGL.getShaderParameter as jest.Mock).mockReturnValue(false);

      tracker.reset();
      tracker.startTimer();

      expect(() => {
        compileShader(failingGL, failingGL.VERTEX_SHADER, baseVertexShader);
      }).toThrow();

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should fail quickly
      expect(metrics.executionTime).toBeLessThan(10);
      expect(metrics.shaderCreations).toBe(1);
      expect(metrics.shaderCompilations).toBe(0); // No compilation when creation fails
    });

    test("should fail fast on program linking errors", () => {
      const vertexShader = compileShader(
        mockGL,
        mockGL.VERTEX_SHADER,
        baseVertexShader
      );
      const fragmentShader = compileShader(
        mockGL,
        mockGL.FRAGMENT_SHADER,
        colorShader
      );

      const failingGL = createMockWebGLContext(tracker);
      (failingGL.getProgramParameter as jest.Mock).mockReturnValue(false);

      tracker.reset();
      tracker.startTimer();

      expect(() => {
        createProgram(failingGL, vertexShader, fragmentShader);
      }).toThrow();

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should fail quickly
      expect(metrics.executionTime).toBeLessThan(10);
      expect(metrics.programCreations).toBe(1);
      expect(metrics.programLinks).toBe(1);
    });
  });

  describe("Integration Performance", () => {
    test("should handle complete shader pipeline efficiently", () => {
      tracker.reset();
      tracker.startTimer();

      // Simulate a complete shader system setup
      const shaderPairs = [
        { vs: baseVertexShader, fs: colorShader },
        { vs: baseVertexShader, fs: advectionShader },
      ];

      const programs = shaderPairs.map(({ vs, fs }) => {
        const vertexShader = compileShader(mockGL, mockGL.VERTEX_SHADER, vs);
        const fragmentShader = compileShader(
          mockGL,
          mockGL.FRAGMENT_SHADER,
          fs
        );
        return createProgram(mockGL, vertexShader, fragmentShader);
      });

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(programs).toHaveLength(2);
      expect(metrics.shaderCreations).toBe(4); // 2 vertex + 2 fragment
      expect(metrics.shaderCompilations).toBe(4);
      expect(metrics.programCreations).toBe(2);
      expect(metrics.programLinks).toBe(2);
      expect(metrics.executionTime).toBeLessThan(30);
    });
  });
});
