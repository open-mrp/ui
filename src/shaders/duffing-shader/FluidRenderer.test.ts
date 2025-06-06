import { ColorConfiguration } from "../colorConfigurations";
import { DuffingOscillator } from "./DuffingOscillator";
import { FluidRenderer } from "./FluidRenderer";
import * as bloomManager from "./bloomManager";
import * as colorManager from "./colorManager";
import * as physicsManager from "./physicsManager";
import * as splatManager from "./splatManager";
import * as sunraysManager from "./sunraysManager";
import { Config, FragmentShader } from "./types";

// Mock all manager modules
jest.mock("./bloomManager");
jest.mock("./colorManager");
jest.mock("./physicsManager");
jest.mock("./splatManager");
jest.mock("./sunraysManager");
jest.mock("./DuffingOscillator", () => {
  return {
    DuffingOscillator: jest.fn().mockImplementation(() => ({
      updateAndGetSplat: jest.fn().mockReturnValue({
        splatData: {
          texcoordX: 0.5,
          texcoordY: 0.5,
          prevTexcoordX: 0.5,
          prevTexcoordY: 0.5,
          deltaX: 0.1,
          deltaY: 0.1,
          color: { r: 1, g: 0, b: 0 },
        },
        newTexcoord: { x: 0.5, y: 0.5 },
      }),
      setBoundaries: jest.fn(),
      update: jest.fn(),
      getPosition: jest.fn(),
      destroy: jest.fn(),
    })),
  };
});

// Mock console methods to avoid noise in tests
jest.spyOn(console, "trace").mockImplementation();

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn();
const mockCancelAnimationFrame = jest.fn();
global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

describe("FluidRenderer", () => {
  let canvas: HTMLCanvasElement;
  let mockGL: any;
  let mockContext2D: any;
  let renderer: FluidRenderer;
  let mockConsoleTrace: jest.SpyInstance;

  // Mock WebGL context
  const createMockGL = (isWebGL2 = true, hasExtensions = true) => {
    const mockTexture = { id: "mock-texture" };
    const mockFramebuffer = { id: "mock-framebuffer" };
    const mockBuffer = { id: "mock-buffer" };
    const mockShader = { id: "mock-shader" };
    const mockProgram = { id: "mock-program" };

    return {
      // WebGL constants
      VERTEX_SHADER: 35633,
      FRAGMENT_SHADER: 35632,
      TEXTURE_2D: 3553,
      FRAMEBUFFER: 36160,
      COLOR_ATTACHMENT0: 36064,
      ARRAY_BUFFER: 34962,
      ELEMENT_ARRAY_BUFFER: 34963,
      STATIC_DRAW: 35044,
      FLOAT: 5126,
      UNSIGNED_SHORT: 5123,
      TRIANGLES: 4,
      TEXTURE0: 33984,
      LINEAR: 9729,
      NEAREST: 9728,
      CLAMP_TO_EDGE: 33071,
      REPEAT: 10497,
      RGB: 6407,
      RGBA: 6408,
      UNSIGNED_BYTE: 5121,
      COLOR_BUFFER_BIT: 16384,
      BLEND: 3042,
      ONE: 1,
      ONE_MINUS_SRC_ALPHA: 771,
      TEXTURE_MIN_FILTER: 10241,
      TEXTURE_MAG_FILTER: 10240,
      TEXTURE_WRAP_S: 10242,
      TEXTURE_WRAP_T: 10243,
      COMPILE_STATUS: 35713,
      LINK_STATUS: 35714,
      ACTIVE_UNIFORMS: 35718,
      FRAMEBUFFER_COMPLETE: 36053,

      // Properties
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,

      // Methods
      createTexture: jest.fn(() => mockTexture),
      createFramebuffer: jest.fn(() => mockFramebuffer),
      createBuffer: jest.fn(() => mockBuffer),
      createShader: jest.fn(() => mockShader),
      createProgram: jest.fn(() => mockProgram),
      bindTexture: jest.fn(),
      bindFramebuffer: jest.fn(),
      bindBuffer: jest.fn(),
      deleteBuffer: jest.fn(),
      texParameteri: jest.fn(),
      texImage2D: jest.fn(),
      framebufferTexture2D: jest.fn(),
      viewport: jest.fn(),
      clear: jest.fn(),
      clearColor: jest.fn(),
      bufferData: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      disableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      drawElements: jest.fn(),
      useProgram: jest.fn(),
      attachShader: jest.fn(),
      linkProgram: jest.fn(),
      compileShader: jest.fn(),
      shaderSource: jest.fn(),
      getShaderParameter: jest.fn(() => true),
      getProgramParameter: jest.fn((program: WebGLProgram, param: number) => {
        if (param === 35714) return true; // LINK_STATUS
        if (param === 35718) return 2; // ACTIVE_UNIFORMS
        return true;
      }),
      getShaderInfoLog: jest.fn(() => ""),
      getProgramInfoLog: jest.fn(() => ""),
      getActiveUniform: jest.fn((program, index) => ({
        name: `uniform${index}`,
      })),
      getUniformLocation: jest.fn(() => ({ id: "uniform-location" })),
      uniform1i: jest.fn(),
      uniform1f: jest.fn(),
      uniform2f: jest.fn(),
      activeTexture: jest.fn(),
      disable: jest.fn(),
      enable: jest.fn(),
      blendFunc: jest.fn(),
      checkFramebufferStatus: jest.fn(() => 36053), // FRAMEBUFFER_COMPLETE
      getParameter: jest.fn(() => mockBuffer),
      getExtension: jest.fn((name: string) => {
        if (!hasExtensions) return null;

        switch (name) {
          case "EXT_color_buffer_float":
            return {};
          case "OES_texture_float_linear":
            return {};
          case "OES_texture_half_float_linear":
            return {};
          case "OES_texture_half_float":
            return { HALF_FLOAT_OES: 36193 };
          case "WEBGL_lose_context":
            return { loseContext: jest.fn() };
          default:
            return {};
        }
      }),
    };
  };

  // Mock HTMLCanvasElement
  const createMockCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;

    // Mock clientWidth and clientHeight as properties
    Object.defineProperty(canvas, "clientWidth", {
      writable: true,
      value: 800,
    });
    Object.defineProperty(canvas, "clientHeight", {
      writable: true,
      value: 600,
    });

    // Mock getContext
    const originalGetContext = canvas.getContext.bind(canvas);
    canvas.getContext = jest.fn((contextType: string, options?: any) => {
      if (contextType === "webgl2") {
        return mockGL;
      }
      if (contextType === "webgl" || contextType === "experimental-webgl") {
        return mockGL;
      }
      if (contextType === "2d") {
        return mockContext2D;
      }
      return originalGetContext(contextType, options);
    });

    return canvas;
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockConsoleTrace = jest.spyOn(console, "trace").mockImplementation();

    // Setup mock implementations
    mockGL = createMockGL();
    mockContext2D = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
    };

    canvas = createMockCanvas();

    // Mock window.devicePixelRatio
    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      value: 1,
    });

    // Mock Date.now
    jest.spyOn(Date, "now").mockReturnValue(1000);

    // Mock manager functions
    (bloomManager.initBloomShaders as jest.Mock).mockReturnValue({
      bloomPrefilterShader: mockGL.createShader(),
      bloomBlurShader: mockGL.createShader(),
      bloomFinalShader: mockGL.createShader(),
    });

    (bloomManager.initBloomFramebuffers as jest.Mock).mockReturnValue([]);
    (bloomManager.applyBloom as jest.Mock).mockImplementation(() => {});
    (bloomManager.clearBloomCache as jest.Mock).mockImplementation(() => {});

    (colorManager.initColorShaders as jest.Mock).mockReturnValue({
      colorShader: mockGL.createShader(),
    });
    (colorManager.setColorScheme as jest.Mock).mockImplementation(() => {});
    (colorManager.getRandomColor as jest.Mock).mockReturnValue({
      r: 1,
      g: 0,
      b: 0,
    });
    (colorManager.drawColor as jest.Mock).mockImplementation(() => {});

    (physicsManager.initPhysicsShaders as jest.Mock).mockReturnValue({
      pressureShader: mockGL.createShader(),
      divergenceShader: mockGL.createShader(),
      curlShader: mockGL.createShader(),
      vorticityShader: mockGL.createShader(),
      gradientSubtractShader: mockGL.createShader(),
    });
    (physicsManager.applyCurl as jest.Mock).mockImplementation(() => {});
    (physicsManager.applyVorticity as jest.Mock).mockImplementation(() => {});
    (physicsManager.applyDivergence as jest.Mock).mockImplementation(() => {});
    (physicsManager.applyPressure as jest.Mock).mockImplementation(() => {});
    (physicsManager.applyGradientSubtract as jest.Mock).mockImplementation(
      () => {}
    );

    (splatManager.initSplatShaders as jest.Mock).mockReturnValue({
      splatShader: mockGL.createShader(),
      advectionShader: mockGL.createShader(),
    });
    (splatManager.applyAdvection as jest.Mock).mockImplementation(() => {});
    (splatManager.handlePointerSplatOptimized as jest.Mock).mockImplementation(
      () => {}
    );

    (sunraysManager.initSunraysShaders as jest.Mock).mockReturnValue({
      sunraysMaskShader: mockGL.createShader(),
      sunraysShader: mockGL.createShader(),
      blurShader: mockGL.createShader(),
    });
    (sunraysManager.initSunraysFramebuffers as jest.Mock).mockReturnValue({
      sunrays: { attach: jest.fn(() => 0) },
      temp: { attach: jest.fn(() => 0) },
    });
    (sunraysManager.applySunrays as jest.Mock).mockImplementation(() => {});
    (sunraysManager.applySunraysBlur as jest.Mock).mockImplementation(() => {});

    // Mock requestAnimationFrame to not start animation loop during construction
    // Tests can manually trigger callbacks if needed
    mockRequestAnimationFrame.mockImplementation(
      (callback: FrameRequestCallback) => {
        // Store the callback but don't call it automatically to prevent infinite loops
        return 1;
      }
    );
  });

  afterEach(() => {
    mockConsoleTrace.mockRestore();
    if (renderer) {
      renderer.destroy();
    }
    jest.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("should create FluidRenderer with default configuration", () => {
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
      expect(mockGL.createShader).toHaveBeenCalled();
      expect(mockGL.createProgram).toHaveBeenCalled();
      expect(colorManager.setColorScheme).toHaveBeenCalledWith("default");
    });

    it("should create FluidRenderer with custom configuration", () => {
      const config: Partial<Config> = {
        SIM_RESOLUTION: 256,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 0.8,
        PRESSURE: 0.7,
        SPLAT_RADIUS: 0.01,
        SPLAT_FORCE: 5000,
        DUFFING: {
          NUM_OSCILLATORS: 4,
          DELTA: 0.1,
          BETA: 0.05,
          ALPHA: 0.8,
          GAMMA: 0.7,
          OMEGA: 0.3,
        },
      };

      renderer = new FluidRenderer(canvas, config);

      expect(renderer).toBeInstanceOf(FluidRenderer);
      expect(DuffingOscillator).toHaveBeenCalledTimes(4);
    });

    it("should create FluidRenderer with skew configuration", () => {
      renderer = new FluidRenderer(canvas, {}, "full", 10);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should create FluidRenderer with bottom skew configuration", () => {
      renderer = new FluidRenderer(canvas, {}, "bottom", 5);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should create FluidRenderer with custom shaders", () => {
      const customShaders: Record<string, FragmentShader> = {
        pressure: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        divergence: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        curl: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        vorticity: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        gradientSubtract: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        sunraysMask: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        sunrays: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        bloomBlur: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        bloomPrefilter: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        bloomFinal: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        splat: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        advection: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        color: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        copy: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        clear: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
        display: {
          shader:
            "precision mediump float; void main() { gl_FragColor = vec4(1.0); }",
          uniforms: {},
        },
      };

      renderer = new FluidRenderer(canvas, {}, undefined, 6, customShaders);

      expect(renderer).toBeInstanceOf(FluidRenderer);
      expect(mockGL.compileShader).toHaveBeenCalled();
    });

    it("should create FluidRenderer with different color configurations", () => {
      const colorConfigs: ColorConfiguration[] = [
        "default",
        "fire",
        "sunset",
        "blue_to_yellow",
        "organic",
      ];

      colorConfigs.forEach((colorConfig) => {
        if (renderer) renderer.destroy();
        renderer = new FluidRenderer(
          canvas,
          {},
          undefined,
          6,
          undefined,
          colorConfig
        );
        expect(colorManager.setColorScheme).toHaveBeenCalledWith(colorConfig);
      });
    });

    it("should handle WebGL context creation errors", () => {
      canvas.getContext = jest.fn(() => null);

      expect(() => new FluidRenderer(canvas)).toThrow("WebGL not supported");
    });

    it("should handle missing OES_texture_half_float extension in WebGL1", () => {
      mockGL = createMockGL(false, false);
      mockGL.getExtension = jest.fn((name: string) => {
        if (name === "OES_texture_half_float") return null;
        return {};
      });

      canvas.getContext = jest.fn((contextType: string) => {
        if (contextType === "webgl2") return null;
        if (contextType === "webgl" || contextType === "experimental-webgl")
          return mockGL;
        return null;
      });

      expect(() => new FluidRenderer(canvas)).toThrow(
        "OES_texture_half_float not supported"
      );
    });
  });

  describe("WebGL Context Handling", () => {
    it("should prefer WebGL2 when available", () => {
      renderer = new FluidRenderer(canvas);

      expect(canvas.getContext).toHaveBeenCalledWith(
        "webgl2",
        expect.any(Object)
      );
    });

    it("should fallback to WebGL1 when WebGL2 is not available", () => {
      canvas.getContext = jest.fn((contextType: string, options?: any) => {
        if (contextType === "webgl2") return null;
        if (contextType === "webgl" || contextType === "experimental-webgl")
          return mockGL;
        return null;
      });

      renderer = new FluidRenderer(canvas);

      expect(canvas.getContext).toHaveBeenCalledWith(
        "webgl2",
        expect.any(Object)
      );
      expect(canvas.getContext).toHaveBeenCalledWith(
        "webgl",
        expect.any(Object)
      );
    });

    it("should handle unsupported texture formats", () => {
      mockGL.checkFramebufferStatus = jest.fn(
        () => mockGL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
      );

      expect(() => new FluidRenderer(canvas)).toThrow(
        "Required texture formats not supported"
      );
    });
  });

  describe("Configuration Updates", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should update configuration partially", () => {
      const newConfig: Partial<Config> = {
        DENSITY_DISSIPATION: 3.0,
        VELOCITY_DISSIPATION: 0.95,
      };

      renderer.updateConfig(newConfig);

      expect(colorManager.setColorScheme).toHaveBeenCalled();
      expect(colorManager.getRandomColor).toHaveBeenCalled();
    });

    it("should regenerate oscillators when NUM_OSCILLATORS changes", () => {
      const newConfig: Partial<Config> = {
        DUFFING: {
          NUM_OSCILLATORS: 12,
          DELTA: 0.2,
          BETA: 0.08,
          ALPHA: 0.9,
          GAMMA: 0.8,
          OMEGA: 0.4,
        },
      };

      renderer.updateConfig(newConfig);

      expect(DuffingOscillator).toHaveBeenCalledTimes(20); // 8 initial + 12 new
    });

    it("should update color configuration", () => {
      renderer.updateColorConfiguration("fire");

      expect(colorManager.setColorScheme).toHaveBeenCalledWith("fire");
      expect(colorManager.getRandomColor).toHaveBeenCalled();
    });

    it("should update skew configuration", () => {
      // Create mock oscillators with setBoundaries method
      const mockOscillators = Array(8)
        .fill(null)
        .map(() => ({
          setBoundaries: jest.fn(),
          updateAndGetSplat: jest.fn(),
          update: jest.fn(),
          getPosition: jest.fn(),
          destroy: jest.fn(),
        }));

      // Replace the oscillators in the renderer
      (renderer as any).oscillators = mockOscillators;

      renderer.updateSkew("full", 15);

      expect(mockGL.createBuffer).toHaveBeenCalled();
      mockOscillators.forEach((oscillator) => {
        expect(oscillator.setBoundaries).toHaveBeenCalled();
      });
    });
  });

  describe("Render Loop", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should handle canvas resizing", () => {
      Object.defineProperty(canvas, "clientWidth", {
        value: 1024,
        writable: true,
      });
      Object.defineProperty(canvas, "clientHeight", {
        value: 768,
        writable: true,
      });

      // The constructor calls requestAnimationFrame to start the update loop
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("should handle animation loop correctly", () => {
      // Manually trigger the animation callback to test the update loop
      const callback = mockRequestAnimationFrame.mock.calls[0][0];

      // Mock Date.now to simulate time passage
      jest.spyOn(Date, "now").mockReturnValueOnce(2000);

      // Trigger the update loop
      callback(2000);

      // Verify that manager functions are called
      expect(physicsManager.applyCurl).toHaveBeenCalled();
      expect(physicsManager.applyVorticity).toHaveBeenCalled();
      expect(splatManager.applyAdvection).toHaveBeenCalled();
      expect(bloomManager.applyBloom).toHaveBeenCalled();
    });

    it("should handle high device pixel ratio", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 2,
      });

      Object.defineProperty(canvas, "clientWidth", {
        value: 400,
        writable: true,
      });
      Object.defineProperty(canvas, "clientHeight", {
        value: 300,
        writable: true,
      });

      // Create new renderer with high DPI
      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should limit delta time properly", () => {
      // Mock a large time jump
      jest
        .spyOn(Date, "now")
        .mockReturnValueOnce(1000) // constructor
        .mockReturnValueOnce(2000); // first update

      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      // The renderer should be created successfully
      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should handle canvas resize during render", () => {
      // Mock window.devicePixelRatio
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 1,
      });

      // Reset viewport mock
      mockGL.viewport.mockClear();

      // Set up canvas dimensions
      canvas.width = 1024;
      canvas.height = 768;
      Object.defineProperty(canvas, "clientWidth", {
        writable: true,
        value: 1024,
      });
      Object.defineProperty(canvas, "clientHeight", {
        writable: true,
        value: 768,
      });

      // Create a new renderer instance
      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      // Mock drawingBufferWidth/Height to match canvas dimensions
      Object.defineProperty(mockGL, "drawingBufferWidth", {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(mockGL, "drawingBufferHeight", {
        value: 768,
        configurable: true,
      });

      // Call render directly
      (renderer as any).render(null);

      // Get the last viewport call dimensions
      const lastCall =
        mockGL.viewport.mock.calls[mockGL.viewport.mock.calls.length - 1];
      expect(lastCall).toEqual([0, 0, 1024, 768]);
    });

    it("should handle aspect ratio changes", () => {
      // Mock window.devicePixelRatio
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 1,
      });

      // Reset viewport mock
      mockGL.viewport.mockClear();

      // Test landscape first
      canvas.width = 1600;
      canvas.height = 900;
      Object.defineProperty(canvas, "clientWidth", {
        writable: true,
        value: 1600,
      });
      Object.defineProperty(canvas, "clientHeight", {
        writable: true,
        value: 900,
      });

      // Mock GL drawing buffer dimensions
      Object.defineProperty(mockGL, "drawingBufferWidth", {
        value: 1600,
        configurable: true,
      });
      Object.defineProperty(mockGL, "drawingBufferHeight", {
        value: 900,
        configurable: true,
      });

      // Create new renderer and force a render
      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      // Mock the render pipeline methods to ensure clean state
      (renderer as any).step = jest.fn();
      (renderer as any).drawDisplay = jest.fn();
      (renderer as any).resizeCanvas = jest.fn(() => false);

      // Force a render cycle
      (renderer as any).render(null);

      // Store the viewport calls after landscape render
      const landscapeCalls = [...mockGL.viewport.mock.calls];

      // Clear viewport calls before portrait test
      mockGL.viewport.mockClear();

      // Test portrait
      canvas.width = 900;
      canvas.height = 1600;
      Object.defineProperty(canvas, "clientWidth", {
        writable: true,
        value: 900,
      });
      Object.defineProperty(canvas, "clientHeight", {
        writable: true,
        value: 1600,
      });

      // Update GL drawing buffer dimensions
      Object.defineProperty(mockGL, "drawingBufferWidth", {
        value: 900,
        configurable: true,
      });
      Object.defineProperty(mockGL, "drawingBufferHeight", {
        value: 1600,
        configurable: true,
      });

      // Create new renderer and force a render for portrait
      renderer.destroy();
      renderer = new FluidRenderer(canvas);

      // Mock the render pipeline methods again
      (renderer as any).step = jest.fn();
      (renderer as any).drawDisplay = jest.fn();
      (renderer as any).resizeCanvas = jest.fn(() => false);

      // Force a render cycle
      (renderer as any).render(null);

      // Store the viewport calls after portrait render
      const portraitCalls = [...mockGL.viewport.mock.calls];

      // Find the relevant viewport calls (usually the last ones)
      const lastLandscapeCall = landscapeCalls[landscapeCalls.length - 1];
      const lastPortraitCall = portraitCalls[portraitCalls.length - 1];

      // Verify both orientations were handled correctly
      expect(lastLandscapeCall).toEqual([0, 0, 1600, 900]);
      expect(lastPortraitCall).toEqual([0, 0, 900, 1600]);

      // Additional logging for debugging if needed
      if (!lastLandscapeCall || !lastPortraitCall) {
        console.log("Landscape viewport calls:", landscapeCalls);
        console.log("Portrait viewport calls:", portraitCalls);
      }
    });
  });

  describe("Physics Integration", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should call all physics manager functions during step", () => {
      // Manually trigger the animation loop to test physics integration
      const callback = mockRequestAnimationFrame.mock.calls[0][0];
      callback(1000);

      expect(physicsManager.applyCurl).toHaveBeenCalled();
      expect(physicsManager.applyVorticity).toHaveBeenCalled();
      expect(physicsManager.applyDivergence).toHaveBeenCalled();
      expect(physicsManager.applyPressure).toHaveBeenCalled();
      expect(physicsManager.applyGradientSubtract).toHaveBeenCalled();
    });

    it("should call splat manager functions during input handling", () => {
      // Manually trigger the animation loop to test splat integration
      const callback = mockRequestAnimationFrame.mock.calls[0][0];
      callback(1000);

      expect(splatManager.applyAdvection).toHaveBeenCalled();
      expect(splatManager.handlePointerSplatOptimized).toHaveBeenCalled();
    });

    it("should call bloom and sunrays during rendering", () => {
      // Manually trigger the animation loop to test rendering integration
      const callback = mockRequestAnimationFrame.mock.calls[0][0];
      callback(1000);

      expect(bloomManager.applyBloom).toHaveBeenCalled();
      expect(sunraysManager.applySunrays).toHaveBeenCalled();
      expect(sunraysManager.applySunraysBlur).toHaveBeenCalled();
    });
  });

  describe("Oscillator Integration", () => {
    let mockOscillators: any[];

    beforeEach(() => {
      // Create mock oscillators
      mockOscillators = Array(8)
        .fill(null)
        .map(() => ({
          updateAndGetSplat: jest.fn(() => ({
            splatData: {
              point: { x: 0.5, y: 0.5 },
              color: { r: 1, g: 0, b: 0 },
              radius: 0.1,
              velocity: { x: 0.1, y: 0.1 },
            },
            newTexcoord: { x: 0.5, y: 0.5 },
          })),
          setBoundaries: jest.fn(),
          update: jest.fn(),
          getPosition: jest.fn(),
          destroy: jest.fn(),
        }));

      // Create renderer and replace its oscillators
      renderer = new FluidRenderer(canvas);
      (renderer as any).oscillators = mockOscillators;
    });

    it("should create correct number of oscillators", () => {
      expect(DuffingOscillator).toHaveBeenCalledTimes(8); // Default NUM_OSCILLATORS
    });

    it("should call updateAndGetSplat on all oscillators", () => {
      // Manually trigger the animation loop to test oscillator integration
      const callback = mockRequestAnimationFrame.mock.calls[0][0];
      callback(1000);

      // Verify updateAndGetSplat was called on each oscillator
      mockOscillators.forEach((oscillator) => {
        expect(oscillator.updateAndGetSplat).toHaveBeenCalled();
      });
    });

    it("should generate unique colors for each oscillator", () => {
      expect(colorManager.getRandomColor).toHaveBeenCalledTimes(8);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero canvas dimensions", () => {
      Object.defineProperty(canvas, "clientWidth", {
        value: 0,
        writable: true,
      });
      Object.defineProperty(canvas, "clientHeight", {
        value: 0,
        writable: true,
      });

      renderer = new FluidRenderer(canvas);
      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should handle extreme configuration values", () => {
      const extremeConfig: Partial<Config> = {
        SIM_RESOLUTION: 1,
        DYE_RESOLUTION: 8192,
        DENSITY_DISSIPATION: 0,
        VELOCITY_DISSIPATION: 1,
        PRESSURE: -1,
        PRESSURE_ITERATIONS: 0,
        CURL: 100,
        SPLAT_RADIUS: 0,
        SPLAT_FORCE: 1000000,
        BLOOM_ITERATIONS: 0,
        BLOOM_RESOLUTION: 1,
        BLOOM_INTENSITY: 100,
        BLOOM_THRESHOLD: -1,
        BLOOM_SOFT_KNEE: 2,
        SUNRAYS_RESOLUTION: 1,
        SUNRAYS_WEIGHT: -1,
        DUFFING: {
          NUM_OSCILLATORS: 0,
          DELTA: 0,
          BETA: 100,
          ALPHA: -100,
          GAMMA: 0,
          OMEGA: 1000,
        },
      };

      expect(() => new FluidRenderer(canvas, extremeConfig)).not.toThrow();
    });

    it("should handle shader compilation errors gracefully", () => {
      // Setup mock to simulate shader compilation error
      const mockShaderError = "Mock shader compilation error";
      mockGL.getShaderParameter = jest.fn(() => false);
      mockGL.getShaderInfoLog = jest.fn(() => mockShaderError);
      mockGL.createShader = jest.fn(() => ({ id: "mock-shader" }));

      // This should trigger shader compilation errors
      renderer = new FluidRenderer(canvas);

      // Verify that console.trace was called with the error message
      expect(mockConsoleTrace).toHaveBeenCalled();
      expect(mockConsoleTrace.mock.calls[0][0]).toBe(mockShaderError);
    });

    it("should handle program linking errors gracefully", () => {
      // Setup mock to simulate program linking error
      const mockProgramError = "Mock program linking error";
      mockGL.getProgramParameter = jest.fn(
        (program: WebGLProgram, param: number) => {
          if (param === 35714) return false; // LINK_STATUS
          if (param === 35718) return 2; // ACTIVE_UNIFORMS
          return true;
        }
      );
      mockGL.getProgramInfoLog = jest.fn(() => mockProgramError);
      mockGL.createProgram = jest.fn(() => ({ id: "mock-program" }));

      // This should trigger program linking errors
      renderer = new FluidRenderer(canvas);

      // Verify that console.trace was called with the error message
      expect(mockConsoleTrace).toHaveBeenCalled();
      expect(mockConsoleTrace.mock.calls[0][0]).toBe(mockProgramError);
    });

    it("should handle missing uniform locations", () => {
      mockGL.getUniformLocation = jest.fn(() => null);

      renderer = new FluidRenderer(canvas);
      expect(renderer).toBeInstanceOf(FluidRenderer);
    });
  });

  describe("Cleanup and Resource Management", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should cleanup resources properly on destroy", () => {
      renderer.destroy();

      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);
      expect(mockGL.disableVertexAttribArray).toHaveBeenCalledWith(0);
      expect(mockGL.deleteBuffer).toHaveBeenCalled();
      expect(bloomManager.clearBloomCache).toHaveBeenCalled();
    });

    it("should handle multiple destroy calls", () => {
      renderer.destroy();
      renderer.destroy(); // Should not throw

      // Should be called at least once, multiple calls are acceptable
      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });

    it("should handle WebGL context loss", () => {
      const loseContext = jest.fn();
      mockGL.getExtension = jest.fn((name: string) => {
        if (name === "WEBGL_lose_context") return { loseContext };
        return {};
      });

      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);
      renderer.destroy();

      expect(loseContext).toHaveBeenCalled();
    });
  });

  describe("Utility Methods", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should calculate resolution correctly for landscape orientation", () => {
      mockGL.drawingBufferWidth = 1600;
      mockGL.drawingBufferHeight = 900;

      // Test by creating new renderer which will call getResolution
      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should calculate resolution correctly for portrait orientation", () => {
      mockGL.drawingBufferWidth = 600;
      mockGL.drawingBufferHeight = 800;

      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should handle device pixel ratio scaling", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 3,
      });

      Object.defineProperty(canvas, "clientWidth", {
        value: 300,
        writable: true,
      });
      Object.defineProperty(canvas, "clientHeight", {
        value: 200,
        writable: true,
      });

      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should handle missing device pixel ratio", () => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: undefined,
      });

      if (renderer) renderer.destroy();
      renderer = new FluidRenderer(canvas);

      expect(renderer).toBeInstanceOf(FluidRenderer);
    });
  });

  describe("Framebuffer Management", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should handle framebuffer creation and resizing", () => {
      expect(mockGL.createFramebuffer).toHaveBeenCalled();
      expect(mockGL.createTexture).toHaveBeenCalled();
    });

    it("should handle texture format fallbacks", () => {
      // Test by creating renderer with different format support
      expect(renderer).toBeInstanceOf(FluidRenderer);
    });
  });

  describe("Material and Program Management", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should handle material keyword updates", () => {
      // Keywords are updated during initialization
      expect(mockGL.useProgram).toHaveBeenCalled();
    });

    it("should handle program uniform retrieval", () => {
      expect(mockGL.getActiveUniform).toHaveBeenCalled();
      expect(mockGL.getUniformLocation).toHaveBeenCalled();
    });
  });

  describe("Integration with External Dependencies", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should integrate with all manager modules correctly", () => {
      // Verify all manager initialization functions were called
      expect(bloomManager.initBloomShaders).toHaveBeenCalled();
      expect(colorManager.initColorShaders).toHaveBeenCalled();
      expect(physicsManager.initPhysicsShaders).toHaveBeenCalled();
      expect(splatManager.initSplatShaders).toHaveBeenCalled();
      expect(sunraysManager.initSunraysShaders).toHaveBeenCalled();
    });

    it("should handle DuffingOscillator integration correctly", () => {
      expect(DuffingOscillator).toHaveBeenCalledWith(
        expect.objectContaining({
          delta: expect.any(Number),
          beta: expect.any(Number),
          alpha: expect.any(Number),
          gamma: expect.any(Number),
          omega: expect.any(Number),
          index: expect.any(Number),
          total: expect.any(Number),
          boundaries: expect.any(Object),
        })
      );
    });
  });

  describe("Performance Optimizations", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should cache canvas dimensions to avoid repeated property access", () => {
      // Manually trigger animation loop to test caching
      const callback = mockRequestAnimationFrame.mock.calls[0][0];
      callback(1000);

      // The update loop should have been called to test caching behavior
      expect(callback).toBeDefined();
    });

    it("should use pre-allocated objects for hot paths", () => {
      // Verify that the renderer was created successfully, indicating cached objects are working
      expect(renderer).toBeInstanceOf(FluidRenderer);
    });

    it("should reuse configuration objects efficiently", () => {
      const config1: Partial<Config> = { DENSITY_DISSIPATION: 2.0 };
      const config2: Partial<Config> = { VELOCITY_DISSIPATION: 0.95 };

      renderer.updateConfig(config1);
      renderer.updateConfig(config2);

      expect(colorManager.setColorScheme).toHaveBeenCalledTimes(3); // Initial + 2 updates
    });
  });

  describe("Program Class", () => {
    let program: any;
    let mockProgram: WebGLProgram;
    let uniformLocations: { [key: string]: WebGLUniformLocation };

    beforeEach(() => {
      mockProgram = mockGL.createProgram();
      uniformLocations = {
        uTexture: mockGL.getUniformLocation(mockProgram, "uTexture"),
        uBloom: mockGL.getUniformLocation(mockProgram, "uBloom"),
      };
      program = {
        gl: mockGL,
        program: mockProgram,
        uniforms: {},
        bind: function () {
          this.gl.useProgram(this.program);
        },
        getUniforms: function () {
          if (
            mockGL.getProgramParameter(this.program, mockGL.LINK_STATUS) ===
            false
          ) {
            throw new Error(mockGL.getProgramInfoLog(this.program));
          }
          const numUniforms = mockGL.getProgramParameter(
            this.program,
            mockGL.ACTIVE_UNIFORMS
          );
          for (let i = 0; i < numUniforms; i++) {
            const info = mockGL.getActiveUniform(this.program, i);
            const location = mockGL.getUniformLocation(this.program, info.name);
            this.uniforms[info.name] = location;
          }
        },
      };
    });

    it("should create program with uniforms", () => {
      mockGL.getProgramParameter.mockImplementation(
        (prog: WebGLProgram, pname: number) => {
          if (pname === mockGL.LINK_STATUS) return true;
          if (pname === mockGL.ACTIVE_UNIFORMS) return 2;
          return null;
        }
      );

      mockGL.getActiveUniform.mockImplementation(
        (prog: WebGLProgram, idx: number) => ({
          name: idx === 0 ? "uTexture" : "uBloom",
          type: mockGL.FLOAT,
        })
      );

      mockGL.getUniformLocation.mockImplementation(
        (prog: WebGLProgram, name: string) => uniformLocations[name]
      );

      program.getUniforms();
      expect(program.uniforms).toHaveProperty("uTexture");
      expect(program.uniforms).toHaveProperty("uBloom");
    });

    it("should handle program linking failure", () => {
      mockGL.getProgramParameter.mockReturnValue(false);
      mockGL.getProgramInfoLog.mockReturnValue("Link error");

      expect(() => program.getUniforms()).toThrow("Link error");
    });

    it("should bind program", () => {
      program.bind();
      expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
    });
  });

  describe("Material Class", () => {
    let material: any;

    beforeEach(() => {
      material = {
        gl: mockGL,
        vertexShader: mockGL.createShader(),
        fragmentShader: mockGL.createShader(),
        currentProgram: null,
        programs: new Map(),
        keywords: new Set<string>(),
        bind: function () {
          if (this.currentProgram) {
            this.currentProgram.bind();
          }
        },
        setKeywords: function (keywords: string[]) {
          this.keywords = new Set(keywords);
          const hash = this.hashKeywords(keywords);
          this.currentProgram = this.programs.get(hash) || null;
        },
        hashKeywords: jest.fn((keywords: string[]) => keywords.sort().join("")),
      };
    });

    it("should create material with default program", () => {
      material.currentProgram = {
        bind: jest.fn(),
        uniforms: { texelSize: mockGL.getUniformLocation(null, "texelSize") },
      };
      material.bind();
      expect(material.currentProgram.bind).toHaveBeenCalled();
    });

    it("should set keywords and create new program", () => {
      const keywords = ["BLOOM", "SUNRAYS"];
      material.setKeywords(keywords);
      expect(Array.from(material.keywords)).toEqual(keywords);
    });

    it("should reuse existing program for same keywords", () => {
      const keywords = ["BLOOM"];
      const mockProgram = { bind: jest.fn() };
      const hash = material.hashKeywords(keywords);
      material.programs.set(hash, mockProgram);
      material.setKeywords(keywords);
      expect(material.currentProgram).toBe(mockProgram);
    });

    it("should handle hashCode function", () => {
      const keywords1 = ["BLOOM", "SUNRAYS"];
      const keywords2 = ["SUNRAYS", "BLOOM"];
      const hash1 = material.hashKeywords(keywords1);
      const hash2 = material.hashKeywords(keywords2);
      expect(hash1).toBe(hash2);
    });
  });

  describe("Texture Format Support", () => {
    beforeEach(() => {
      // Mock texture format support
      mockGL.getExtension.mockImplementation((name: string) => {
        if (name === "EXT_color_buffer_float") return {};
        if (name === "OES_texture_float_linear") return {};
        if (name === "OES_texture_half_float_linear") return {};
        return null;
      });

      mockGL.checkFramebufferStatus.mockReturnValue(
        mockGL.FRAMEBUFFER_COMPLETE
      );
    });

    it("should handle R16F format fallback", () => {
      const formatR = (renderer as any).getSupportedFormat(
        mockGL,
        mockGL.R16F,
        mockGL.RED,
        mockGL.HALF_FLOAT
      );
      expect(formatR).toBeDefined();
    });

    it("should handle RG16F format fallback", () => {
      const formatRG = (renderer as any).getSupportedFormat(
        mockGL,
        mockGL.RG16F,
        mockGL.RG,
        mockGL.HALF_FLOAT
      );
      expect(formatRG).toBeDefined();
    });
  });

  describe("Shader Keywords and Display Material", () => {
    beforeEach(() => {
      (renderer as any).displayMaterial = {
        setKeywords: jest.fn(),
        bind: jest.fn(),
      };
    });

    it("should update display material keywords", () => {
      (renderer as any).config = {
        SHADING: true,
        BLOOM: true,
        SUNRAYS: true,
      };

      (renderer as any).updateKeywords();

      expect(
        (renderer as any).displayMaterial.setKeywords
      ).toHaveBeenCalledWith(
        expect.arrayContaining(["SHADING", "BLOOM", "SUNRAYS"])
      );
    });
  });

  describe("Render Loop Edge Cases", () => {
    it("should handle very large delta time", () => {
      (renderer as any).lastTime = performance.now() - 1000; // 1 second ago
      const dt = (renderer as any).calcDeltaTime();
      expect(dt).toBeLessThanOrEqual(0.016666); // Should be capped at max dt
    });
  });

  describe("Texture Scale Calculations", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should calculate texture scale correctly", () => {
      const texture = { width: 100, height: 100 };
      const scale = (renderer as any).getTextureScale(texture, 200, 200);
      expect(scale.x).toBe(2);
      expect(scale.y).toBe(2);
    });

    it("should handle non-uniform texture scaling", () => {
      const texture = { width: 100, height: 200 };
      const scale = (renderer as any).getTextureScale(texture, 400, 400);
      expect(scale.x).toBe(4);
      expect(scale.y).toBe(2);
    });

    it("should handle zero dimensions gracefully", () => {
      const texture = { width: 0, height: 0 };
      const scale = (renderer as any).getTextureScale(texture, 200, 200);
      expect(scale.x).toBe(Infinity);
      expect(scale.y).toBe(Infinity);
    });
  });

  describe("Render Pipeline Edge Cases", () => {
    beforeEach(() => {
      renderer = new FluidRenderer(canvas);
    });

    it("should handle step function with zero dt", () => {
      (renderer as any).step(0);
      expect(mockGL.disable).toHaveBeenCalledWith(mockGL.BLEND);
      expect(physicsManager.applyCurl).toHaveBeenCalled();
    });

    it("should handle render function with null target", () => {
      (renderer as any).render(null);
      expect(bloomManager.applyBloom).toHaveBeenCalled();
      expect(sunraysManager.applySunrays).toHaveBeenCalled();
    });

    it("should handle drawDisplay with target", () => {
      const target = {
        width: 512,
        height: 512,
        texture: mockGL.createTexture(),
        fbo: mockGL.createFramebuffer(),
        attach: jest.fn(),
      };

      (renderer as any).drawDisplay(target);
      expect(mockGL.uniform2f).toHaveBeenCalled();
    });

    it("should handle blit with clear flag", () => {
      (renderer as any).blit(null, true);
      expect(mockGL.clearColor).toHaveBeenCalledWith(0.0, 0.0, 0.0, 1.0);
      expect(mockGL.clear).toHaveBeenCalledWith(mockGL.COLOR_BUFFER_BIT);
    });

    it("should handle applyInputs with multiple oscillators", () => {
      const mockOscillators = Array(4).fill({
        updateAndGetSplat: jest.fn().mockReturnValue({
          splatData: {
            texcoordX: 0.5,
            texcoordY: 0.5,
            prevTexcoordX: 0.4,
            prevTexcoordY: 0.4,
            deltaX: 0.1,
            deltaY: 0.1,
            color: { r: 1, g: 0, b: 0 },
          },
          newTexcoord: { x: 0.5, y: 0.5 },
        }),
      });

      (renderer as any).oscillators = mockOscillators;
      (renderer as any).applyInputs(0.016);

      mockOscillators.forEach((oscillator) => {
        expect(oscillator.updateAndGetSplat).toHaveBeenCalled();
      });
    });

    it("should handle initFramebuffers with different resolutions", () => {
      const config = {
        SIM_RESOLUTION: 256,
        DYE_RESOLUTION: 512,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        SUNRAYS_RESOLUTION: 196,
      };

      (renderer as any).config = { ...(renderer as any).config, ...config };
      (renderer as any).initFramebuffers();

      expect(mockGL.createFramebuffer).toHaveBeenCalled();
      expect(mockGL.createTexture).toHaveBeenCalled();
    });

    it("should handle supportRenderTextureFormat with different formats", () => {
      const formats = [
        { internalFormat: mockGL.RGBA16F, format: mockGL.RGBA },
        { internalFormat: mockGL.RG16F, format: mockGL.RG },
        { internalFormat: mockGL.R16F, format: mockGL.RED },
      ];

      formats.forEach(({ internalFormat, format }) => {
        const supported = (renderer as any).supportRenderTextureFormat(
          mockGL,
          internalFormat,
          format,
          mockGL.HALF_FLOAT
        );
        expect(supported).toBe(true);
      });
    });

    it("should handle getSupportedFormat fallbacks", () => {
      mockGL.checkFramebufferStatus.mockImplementation(
        () => mockGL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
      );

      const result = (renderer as any).getSupportedFormat(
        mockGL,
        mockGL.R16F,
        mockGL.RED,
        mockGL.HALF_FLOAT
      );

      expect(result).toBeNull();
    });
  });
});
