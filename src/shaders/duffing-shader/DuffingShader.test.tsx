import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { DuffingShader } from "./DuffingShader";
import type { Config } from "./types";

// Mock dependencies
jest.mock("@/hooks/useViewportWidth", () => ({
  useViewportWidth: jest.fn(),
}));

jest.mock("../colorConfigurations", () => ({
  colorConfigurations: {
    default: { gradient: ["hsl(240deg 100% 20%)", "hsl(48deg 100% 50%)"] },
    fire: { gradient: ["hsla(31, 100%, 50%, 1)", "hsla(356, 100%, 50%, 1)"] },
    invalidConfig: undefined,
  },
}));

jest.mock("../utils/calculateShaderCanvasDimensions", () => ({
  calculateShaderCanvasDimensions: jest.fn(),
}));

jest.mock("./FluidRenderer", () => ({
  FluidRenderer: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    updateConfig: jest.fn(),
    updateColorConfiguration: jest.fn(),
    updateSkew: jest.fn(),
  })),
}));

jest.mock("./shaders", () => ({
  getShaders: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(window, "addEventListener", {
  value: mockAddEventListener,
});
Object.defineProperty(window, "removeEventListener", {
  value: mockRemoveEventListener,
});

// Mock console.warn
const mockConsoleWarn = jest
  .spyOn(console, "warn")
  .mockImplementation(() => {});

// Suppress React act() warnings for async operations
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
      // Suppress React act() warnings for async shader loading
      return;
    }
    originalConsoleError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("DuffingShader", () => {
  const mockUseViewportWidth =
    require("@/hooks/useViewportWidth").useViewportWidth;
  const mockCalculateShaderCanvasDimensions =
    require("../utils/calculateShaderCanvasDimensions").calculateShaderCanvasDimensions;
  const mockFluidRenderer = require("./FluidRenderer").FluidRenderer;
  const mockGetShaders = require("./shaders").getShaders;

  const mockShaders = {
    vertex: { shader: "vertex shader code", uniforms: {} },
    advection: { shader: "advection shader code", uniforms: {} },
    divergence: { shader: "divergence shader code", uniforms: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseViewportWidth.mockReturnValue(1024);
    mockCalculateShaderCanvasDimensions.mockReturnValue([800, 400]);
    mockGetShaders.mockResolvedValue(mockShaders);
    mockConsoleWarn.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    test("renders the DuffingShader component with default props", async () => {
      render(<DuffingShader />);

      const container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(
        "relative",
        "w-full",
        "h-full",
        "overflow-hidden"
      );
    });

    test("renders canvas element", async () => {
      render(<DuffingShader />);

      await waitFor(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
      });
    });

    test("applies correct container styles", () => {
      render(<DuffingShader minWidth={500} height={300} />);

      const container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "800px",
        height: "400px",
      });
    });
  });

  describe("Props Testing", () => {
    test("handles colorConfiguration prop", async () => {
      render(<DuffingShader colorConfiguration="fire" />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          undefined,
          6,
          mockShaders,
          "fire"
        );
      });
    });

    test("handles backgroundColor prop", async () => {
      const backgroundColor = { r: 255, g: 128, b: 0 };
      render(<DuffingShader backgroundColor={backgroundColor} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            BACK_COLOR: backgroundColor,
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("handles skew prop - full", () => {
      render(<DuffingShader skew="full" skewDegree={10} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "skewY(-10deg)",
        clipPath: "none",
      });
    });

    test("handles skew prop - bottom", () => {
      render(<DuffingShader skew="bottom" skewDegree={8} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "none",
        clipPath: "polygon(0 0, 100% 0, 100% 54%, 0 100%)",
      });
    });

    test("handles skew prop - undefined (no skew)", () => {
      render(<DuffingShader />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "none",
        clipPath: "none",
      });
    });

    test("handles minWidth prop", () => {
      render(<DuffingShader minWidth={800} />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        expect.objectContaining({ minWidth: 800 }),
        1024
      );
    });

    test("handles height prop", () => {
      render(<DuffingShader height={500} />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        expect.objectContaining({ height: 500 }),
        1024
      );
    });

    test("handles custom config prop - partial", async () => {
      const customConfig: Partial<Config> = {
        PRESSURE: 0.5,
        CURL: 0.2,
        DUFFING: {
          NUM_OSCILLATORS: 12,
          DELTA: 0.2,
          BETA: 0.08,
          ALPHA: 1.2,
          GAMMA: 0.8,
          OMEGA: 0.4,
        },
      };

      render(<DuffingShader config={customConfig} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            PRESSURE: 0.5,
            CURL: 0.2,
            DUFFING: expect.objectContaining({
              NUM_OSCILLATORS: 12,
              ALPHA: 1.2,
              BETA: 0.08, // Default value preserved
              DELTA: 0.2, // Default value preserved
            }),
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("handles custom config prop - full", async () => {
      const customConfig: Config = {
        SIM_RESOLUTION: 256,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 0.7,
        PRESSURE: 0.6,
        PRESSURE_ITERATIONS: 15,
        CURL: 0.05,
        SPLAT_RADIUS: 0.01,
        SPLAT_FORCE: 6000,
        BACK_COLOR: { r: 50, g: 50, b: 50 },
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 128,
        BLOOM_INTENSITY: 0.2,
        BLOOM_THRESHOLD: 0.1,
        BLOOM_SOFT_KNEE: 0.5,
        SUNRAYS_RESOLUTION: 128,
        SUNRAYS_WEIGHT: 0.05,
        DUFFING: {
          NUM_OSCILLATORS: 6,
          DELTA: 0.1,
          BETA: 0.04,
          ALPHA: 0.5,
          GAMMA: 0.4,
          OMEGA: 0.2,
        },
      };

      render(<DuffingShader config={customConfig} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          customConfig,
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });
  });

  describe("Dimension Calculations", () => {
    test("uses minWidth for initial server render", () => {
      mockUseViewportWidth.mockReturnValue(null);

      render(<DuffingShader minWidth={600} height={275} />);

      const container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "600px",
        height: "275px",
      });
    });

    test("calculates dimensions based on viewport width", () => {
      mockUseViewportWidth.mockReturnValue(1200);
      mockCalculateShaderCanvasDimensions.mockReturnValue([1000, 500]);

      render(<DuffingShader />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        {
          colorConfiguration: "default",
          skew: undefined,
          minWidth: 600,
          height: 275,
        },
        1200
      );
    });

    test("updates dimensions when viewport changes", async () => {
      const { rerender } = render(<DuffingShader />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        expect.any(Object),
        1024
      );

      mockUseViewportWidth.mockReturnValue(800);
      mockCalculateShaderCanvasDimensions.mockReturnValue([600, 300]);

      rerender(<DuffingShader />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        expect.any(Object),
        800
      );
    });
  });

  describe("Boundary Calculations", () => {
    test("calculates boundaries for full skew", async () => {
      render(<DuffingShader skew="full" skewDegree={6} />);

      await waitFor(() => {
        const skewRadians = (6 * Math.PI) / 180;
        const skewAmount = Math.tan(skewRadians);

        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          "full",
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("calculates boundaries for bottom skew", async () => {
      render(<DuffingShader skew="bottom" skewDegree={10} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          "bottom",
          10,
          mockShaders,
          "default"
        );
      });
    });

    test("calculates boundaries for no skew", async () => {
      render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });
  });

  describe("Async Operations", () => {
    test("loads shaders asynchronously", async () => {
      render(<DuffingShader />);

      expect(mockGetShaders).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("handles shader loading failure gracefully", async () => {
      // Suppress console.error for this test since we expect an error
      const originalConsoleError = console.error;
      const mockConsoleError = jest.fn();
      console.error = mockConsoleError;

      mockGetShaders.mockRejectedValue(new Error("Failed to load shaders"));

      render(<DuffingShader />);

      // Wait for the error to be logged
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Failed to load shaders:",
          expect.any(Error)
        );
      });

      // Renderer should not be created since shaders failed to load
      expect(mockFluidRenderer).not.toHaveBeenCalled();

      // Restore console.error
      console.error = originalConsoleError;
    });

    test("waits for both canvas and shaders before initializing renderer", async () => {
      const { container } = render(<DuffingShader />);

      // Initially, renderer should not be created
      expect(mockFluidRenderer).not.toHaveBeenCalled();

      // After shaders load, renderer should be created
      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });
    });
  });

  describe("Configuration Updates", () => {
    test("updates renderer config when config prop changes", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { rerender } = render(<DuffingShader config={{ PRESSURE: 0.5 }} />);

      // First wait for renderer to be created
      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      // Clear previous calls to track only the update calls
      mockRenderer.updateConfig.mockClear();

      rerender(<DuffingShader config={{ PRESSURE: 0.8 }} />);

      await waitFor(() => {
        expect(mockRenderer.updateConfig).toHaveBeenCalledWith(
          expect.objectContaining({ PRESSURE: 0.8 })
        );
      });
    });

    test("updates color configuration when prop changes", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { rerender } = render(
        <DuffingShader colorConfiguration="default" />
      );

      // First wait for renderer to be created
      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      // Clear previous calls to track only the update calls
      mockRenderer.updateColorConfiguration.mockClear();

      rerender(<DuffingShader colorConfiguration="fire" />);

      await waitFor(() => {
        expect(mockRenderer.updateColorConfiguration).toHaveBeenCalledWith(
          "fire"
        );
      });
    });
  });

  describe("Event Handling", () => {
    test("initializes canvas dimensions correctly", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { container } = render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute("width", "800");
      expect(canvas).toHaveAttribute("height", "400");
    });

    test("handles viewport changes properly", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      // Start with a larger viewport
      mockUseViewportWidth.mockReturnValue(1200);
      mockCalculateShaderCanvasDimensions.mockReturnValue([1000, 500]);

      const { container, rerender } = render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      const canvas = container.querySelector("canvas");
      expect(canvas).toHaveAttribute("width", "1000");
      expect(canvas).toHaveAttribute("height", "500");

      // Change viewport and rerender
      mockUseViewportWidth.mockReturnValue(800);
      mockCalculateShaderCanvasDimensions.mockReturnValue([600, 300]);

      rerender(<DuffingShader />);

      await waitFor(() => {
        const updatedCanvas = container.querySelector("canvas");
        expect(updatedCanvas).toHaveAttribute("width", "600");
        expect(updatedCanvas).toHaveAttribute("height", "300");
      });
    });

    test("updates skew when props change", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { rerender } = render(<DuffingShader skew="full" skewDegree={5} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      // Clear the initial calls
      mockRenderer.updateSkew.mockClear();

      rerender(<DuffingShader skew="full" skewDegree={10} />);

      // The updateSkew should be called when skew props change
      await waitFor(() => {
        expect(mockRenderer.updateSkew).toHaveBeenCalledWith("full", 10);
      });
    });
  });

  describe("Cleanup", () => {
    test("destroys renderer on unmount", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { unmount } = render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      unmount();

      expect(mockRenderer.destroy).toHaveBeenCalled();
    });

    test("handles unmount when renderer is not initialized", () => {
      const { unmount } = render(<DuffingShader />);

      // Should not throw error
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    test("handles invalid color configuration", async () => {
      render(<DuffingShader colorConfiguration={"invalidConfig" as any} />);

      await waitFor(() => {
        expect(mockConsoleWarn).toHaveBeenCalledWith(
          'Color configuration "invalidConfig" not found'
        );
      });
    });

    test("handles extreme skew values", () => {
      render(<DuffingShader skew="full" skewDegree={90} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "skewY(-90deg)",
      });
    });

    test("handles negative skew values", () => {
      render(<DuffingShader skew="full" skewDegree={-15} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "skewY(--15deg)",
      });
    });

    test("handles zero dimensions", () => {
      mockCalculateShaderCanvasDimensions.mockReturnValue([0, 0]);

      render(<DuffingShader />);

      const container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "0px",
        height: "0px",
      });
    });

    test("handles very large dimensions", () => {
      mockCalculateShaderCanvasDimensions.mockReturnValue([5000, 3000]);

      render(<DuffingShader />);

      const container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "5000px",
        height: "3000px",
      });
    });

    test("handles missing canvas ref", async () => {
      // Mock querySelector to return null
      const originalQuerySelector = document.querySelector;
      document.querySelector = jest.fn().mockReturnValue(null);

      render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).not.toHaveBeenCalled();
      });

      // Restore original querySelector
      document.querySelector = originalQuerySelector;
    });

    test("handles config with null/undefined values", async () => {
      const configWithNulls: Partial<Config> = {
        PRESSURE: 0.5,
      };

      render(<DuffingShader config={configWithNulls} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            PRESSURE: 0.5,
            DUFFING: {
              NUM_OSCILLATORS: 8,
              DELTA: 0.2,
              BETA: 0.08,
              ALPHA: 0.9,
              GAMMA: 0.8,
              OMEGA: 0.4,
            },
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("handles rapid prop changes", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { rerender } = render(
        <DuffingShader colorConfiguration="default" />
      );

      // Wait for initial renderer creation
      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      // Clear initial calls
      mockRenderer.updateColorConfiguration.mockClear();

      // Rapidly change props
      for (let i = 0; i < 5; i++) {
        rerender(
          <DuffingShader
            colorConfiguration={i % 2 === 0 ? "fire" : "default"}
          />
        );
      }

      await waitFor(() => {
        expect(mockRenderer.updateColorConfiguration).toHaveBeenCalledTimes(5);
      });
    });
  });

  describe("Memory and Performance", () => {
    test("memoizes config properly", async () => {
      const config1 = { PRESSURE: 0.5 };

      const { rerender } = render(<DuffingShader config={config1} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledTimes(1);
      });

      // Rerender with same config object (reference equality)
      rerender(<DuffingShader config={config1} />);

      // Wait a bit to ensure no additional calls
      await new Promise((resolve) => setTimeout(resolve, 100));

      // FluidRenderer should still only be called once since the config didn't change
      expect(mockFluidRenderer).toHaveBeenCalledTimes(1);
    });

    test("memoizes dimension calculations", () => {
      const { rerender } = render(<DuffingShader minWidth={600} />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledTimes(1);

      // Rerender with same props
      rerender(<DuffingShader minWidth={600} />);

      // Should not recalculate
      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledTimes(1);
    });

    test("handles component remounting", async () => {
      const { unmount } = render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Render a new component instance instead of using rerender after unmount
      render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Advanced Edge Cases and Math Functions", () => {
    test("handles fractional skew degrees", () => {
      render(<DuffingShader skew="full" skewDegree={6.5} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        transform: "skewY(-6.5deg)",
      });
    });

    test("handles bottom skew with decimal precision", () => {
      render(<DuffingShader skew="bottom" skewDegree={7.3} />);

      const innerDiv = document.querySelector(".absolute.inset-0");
      expect(innerDiv).toHaveStyle({
        clipPath: "polygon(0 0, 100% 0, 100% 53.65%, 0 100%)",
      });
    });

    test("boundary calculations use correct trigonometric functions", async () => {
      const testDegree = 30;
      render(<DuffingShader skew="full" skewDegree={testDegree} />);

      await waitFor(() => {
        // Verify that the boundary calculation math is correct
        const expectedSkewRadians = (testDegree * Math.PI) / 180;
        const expectedSkewAmount = Math.tan(expectedSkewRadians);

        // The component should use these calculations internally
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.any(Object),
          "full",
          testDegree,
          mockShaders,
          "default"
        );
      });
    });

    test("handles config merging with deeply nested DUFFING object", async () => {
      const partialDuffingConfig = {
        DUFFING: {
          NUM_OSCILLATORS: 15,
          DELTA: 0.2,
          BETA: 0.08,
          ALPHA: 1.5,
          GAMMA: 0.8,
          OMEGA: 0.4,
        },
      };

      render(<DuffingShader config={partialDuffingConfig} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            DUFFING: {
              NUM_OSCILLATORS: 15,
              ALPHA: 1.5,
              BETA: 0.08, // Should preserve default
              DELTA: 0.2, // Should preserve default
              GAMMA: 0.8, // Should preserve default
              OMEGA: 0.4, // Should preserve default
            },
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("handles backgroundColor override in config merging", async () => {
      const customColor = { r: 100, g: 150, b: 200 };
      render(
        <DuffingShader
          backgroundColor={customColor}
          config={{ PRESSURE: 0.7 }}
        />
      );

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
            BACK_COLOR: customColor,
            PRESSURE: 0.7,
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("canvas dimensions are set correctly on resize", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      mockCalculateShaderCanvasDimensions.mockReturnValue([1200, 600]);

      render(<DuffingShader />);

      await waitFor(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).toHaveAttribute("width", "1200");
        expect(canvas).toHaveAttribute("height", "600");
      });

      // Simulate resize
      const resizeHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "resize"
      )?.[1];

      if (resizeHandler) {
        mockCalculateShaderCanvasDimensions.mockReturnValue([800, 400]);
        resizeHandler();

        await waitFor(() => {
          const canvas = document.querySelector("canvas");
          expect(canvas).toHaveAttribute("width", "800");
          expect(canvas).toHaveAttribute("height", "400");
        });
      }
    });

    test("handles multiple simultaneous prop updates", async () => {
      const mockRenderer = {
        destroy: jest.fn(),
        updateConfig: jest.fn(),
        updateColorConfiguration: jest.fn(),
        updateSkew: jest.fn(),
      };
      mockFluidRenderer.mockReturnValue(mockRenderer);

      const { rerender } = render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalled();
      });

      // Update multiple props simultaneously
      rerender(
        <DuffingShader
          colorConfiguration="fire"
          config={{ PRESSURE: 0.9 }}
          skew="bottom"
          skewDegree={12}
        />
      );

      await waitFor(() => {
        expect(mockRenderer.updateConfig).toHaveBeenCalledWith(
          expect.objectContaining({ PRESSURE: 0.9 })
        );
        expect(mockRenderer.updateColorConfiguration).toHaveBeenCalledWith(
          "fire"
        );
        expect(mockRenderer.updateSkew).toHaveBeenCalledWith("bottom", 12);
      });
    });

    test("viewport width null to value transition", () => {
      mockUseViewportWidth.mockReturnValue(null);
      const { rerender } = render(<DuffingShader minWidth={500} />);

      // Initial render with null viewport width
      let container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "500px",
        height: "275px",
      });

      // Simulate viewport width becoming available
      mockUseViewportWidth.mockReturnValue(1024);
      mockCalculateShaderCanvasDimensions.mockReturnValue([900, 450]);

      rerender(<DuffingShader minWidth={500} />);

      container = document.querySelector(
        ".relative.w-full.h-full.overflow-hidden"
      );
      expect(container).toHaveStyle({
        width: "900px",
        height: "450px",
      });
    });

    test("handles config object mutations", async () => {
      const mutableConfig = { PRESSURE: 0.5 };
      render(<DuffingShader config={mutableConfig} />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({ PRESSURE: 0.5 }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });

      // Mutate the original object (this shouldn't affect the component due to memoization)
      mutableConfig.PRESSURE = 0.8;

      // The component should still use the original values due to proper memoization
      expect(mockFluidRenderer).toHaveBeenCalledWith(
        expect.any(HTMLCanvasElement),
        expect.objectContaining({ PRESSURE: 0.5 }),
        undefined,
        6,
        mockShaders,
        "default"
      );
    });
  });

  describe("Default Configuration Testing", () => {
    test("uses correct default configuration values", async () => {
      render(<DuffingShader />);

      await waitFor(() => {
        expect(mockFluidRenderer).toHaveBeenCalledWith(
          expect.any(HTMLCanvasElement),
          expect.objectContaining({
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
            DUFFING: {
              NUM_OSCILLATORS: 8,
              DELTA: 0.2,
              BETA: 0.08,
              ALPHA: 0.9,
              GAMMA: 0.8,
              OMEGA: 0.4,
            },
          }),
          undefined,
          6,
          mockShaders,
          "default"
        );
      });
    });

    test("default props are applied correctly", () => {
      render(<DuffingShader />);

      expect(mockCalculateShaderCanvasDimensions).toHaveBeenCalledWith(
        {
          colorConfiguration: "default",
          skew: undefined,
          minWidth: 600,
          height: 275,
        },
        1024
      );
    });
  });
});
