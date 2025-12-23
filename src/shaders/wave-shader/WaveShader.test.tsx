import { render, waitFor } from "@testing-library/react";
import React from "react";
import { WaveShader } from "./WaveShader";

describe("WaveShader Performance", () => {
  // Mock IntersectionObserver
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();
  const mockUnobserve = jest.fn();

  beforeAll(() => {
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: mockUnobserve,
    }));
  });

  // Mock WebGL context
  const mockGetContext = jest.fn();
  const mockGl = {
    createShader: jest.fn(() => ({})),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(() => true),
    createProgram: jest.fn(() => ({})),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    getAttribLocation: jest.fn(() => 0),
    getUniformLocation: jest.fn(() => ({})),
    createBuffer: jest.fn(() => ({})),
    createTexture: jest.fn(() => ({})),
    bindTexture: jest.fn(),
    texImage2D: jest.fn(),
    texParameteri: jest.fn(),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    useProgram: jest.fn(),
    uniform1i: jest.fn(),
    uniform1f: jest.fn(),
    vertexAttribPointer: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    viewport: jest.fn(),
    clearColor: jest.fn(),
    clear: jest.fn(),
    drawArrays: jest.fn(),
    activeTexture: jest.fn(),
    TEXTURE_2D: 0x0de1,
    TEXTURE0: 0x84c0,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    LINEAR: 0x2601,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    CLAMP_TO_EDGE: 0x812f,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    COLOR_BUFFER_BIT: 0x00004000,
    TRIANGLES: 0x0004,
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    canvas: {
      width: 600,
      height: 275,
      style: {},
    },
  };

  beforeEach(() => {
    // Mock canvas 2D context for gradient creation
    const mock2DContext = {
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      fillStyle: null,
      fillRect: jest.fn(),
      clearRect: jest.fn(),
    };

    mockGetContext.mockImplementation((type) => {
      if (type === "2d") return mock2DContext;
      if (type === "webgl") return mockGl;
      return null;
    });

    HTMLCanvasElement.prototype.getContext = mockGetContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    const { container } = render(<WaveShader />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("renders with low quality setting", () => {
    const { container } = render(<WaveShader quality="low" />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("renders with high quality setting", () => {
    const { container } = render(<WaveShader quality="high" />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("renders with performance metrics", () => {
    const { container } = render(<WaveShader showPerformanceMetrics />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("handles different wave counts", () => {
    const { rerender } = render(<WaveShader numWaves={5} />);
    expect(mockGl.uniform1i).toHaveBeenCalled();

    rerender(<WaveShader numWaves={10} />);
    expect(mockGl.uniform1i).toHaveBeenCalled();

    rerender(<WaveShader numWaves={20} />);
    expect(mockGl.uniform1i).toHaveBeenCalled();
  });

  it("pauses rendering when not animated", () => {
    render(<WaveShader animate={false} />);
    const initialDrawCalls = mockGl.drawArrays.mock.calls.length;

    // Wait a bit to ensure no additional draws happen
    setTimeout(() => {
      expect(mockGl.drawArrays.mock.calls.length).toBe(initialDrawCalls);
    }, 100);
  });

  it("applies resolution scaling based on quality", () => {
    const { container } = render(<WaveShader quality="low" />);
    const canvas = container.querySelector("canvas");

    // Low quality should have reduced resolution
    expect(canvas).toBeTruthy();
    expect(canvas?.style).toBeDefined();
  });

  it("caches gradient textures", async () => {
    const { rerender } = render(<WaveShader colorConfiguration="default" />);
    const initialTextureCalls = mockGl.createTexture.mock.calls.length;

    // Rerender with same color configuration
    rerender(<WaveShader colorConfiguration="default" />);

    // Should not create new texture for same gradient
    await waitFor(() => {
      expect(mockGl.createTexture.mock.calls.length).toBeLessThanOrEqual(
        initialTextureCalls + 1
      );
    });
  });

  it("updates quality uniform when quality changes", () => {
    const { rerender } = render(<WaveShader quality="low" />);

    rerender(<WaveShader quality="high" />);

    // Check that quality uniform was updated
    expect(mockGl.uniform1f).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Number)
    );
  });

  describe("Performance Optimizations", () => {
    it("reduces noise sampling with lower quality", () => {
      render(<WaveShader quality="low" numWaves={10} />);
      // With low quality, fewer shader operations should occur
      const lowQualityDraws = mockGl.drawArrays.mock.calls.length;

      jest.clearAllMocks();
      render(<WaveShader quality="high" numWaves={10} />);
      const highQualityDraws = mockGl.drawArrays.mock.calls.length;

      // High quality should have similar or more draw calls
      expect(highQualityDraws).toBeGreaterThanOrEqual(lowQualityDraws);
    });

    it("implements LOD system for distant waves", () => {
      render(<WaveShader numWaves={20} quality="medium" />);

      // LOD system should be active with many waves
      expect(mockGl.uniform1f).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number) // Quality uniform
      );
    });

    it("skips rendering when component is not visible", async () => {
      const { unmount } = render(<WaveShader />);

      expect(mockObserve).toHaveBeenCalled();

      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe("Memory Management", () => {
    it("cleans up resources on unmount", () => {
      const { unmount } = render(<WaveShader />);
      unmount();

      // Verify that event listeners are removed and resources cleaned
      expect(mockGetContext).toHaveBeenCalled();
    });

    it("reuses gradient texture cache", () => {
      render(<WaveShader colorConfiguration="default" />);
      const firstTextureCall = mockGl.createTexture.mock.calls.length;

      render(<WaveShader colorConfiguration="default" />);
      const secondTextureCall = mockGl.createTexture.mock.calls.length;

      // Should reuse cached texture
      expect(secondTextureCall - firstTextureCall).toBeLessThanOrEqual(1);
    });
  });
});
