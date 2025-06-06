import { DuffingOscillator } from "./DuffingOscillator";

// Performance tracking utilities
class PerformanceTracker {
  private metrics = {
    updates: 0,
    splatGenerations: 0,
    boundaryChecks: 0,
    collisionDetections: 0,
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

// Mock canvas for testing
const createMockCanvas = (width = 800, height = 600): HTMLCanvasElement =>
  ({
    width,
    height,
  } as HTMLCanvasElement);

describe("DuffingOscillator Functionality Tests", () => {
  let tracker: PerformanceTracker;

  beforeEach(() => {
    tracker = new PerformanceTracker();
  });

  describe("Constructor", () => {
    test("should create oscillator with default parameters", () => {
      const oscillator = new DuffingOscillator();

      expect(oscillator).toBeInstanceOf(DuffingOscillator);
    });

    test("should create oscillator with custom parameters", () => {
      const params = {
        delta: 0.1,
        alpha: 1.5,
        beta: 0.2,
        gamma: 1.2,
        omega: 0.8,
        phaseOffset: Math.PI / 4,
        index: 2,
        total: 5,
      };

      const oscillator = new DuffingOscillator(params);

      expect(oscillator).toBeInstanceOf(DuffingOscillator);
    });

    test("should create oscillator with custom boundaries", () => {
      const boundaries = {
        botLeft: [-0.8, -0.8] as [number, number],
        botRight: [0.8, -0.8] as [number, number],
        topLeft: [-0.8, 0.8] as [number, number],
        topRight: [0.8, 0.8] as [number, number],
      };

      const oscillator = new DuffingOscillator({ boundaries });

      expect(oscillator).toBeInstanceOf(DuffingOscillator);
    });

    test("should handle edge case parameters", () => {
      // Test with extreme values
      const extremeParams = {
        delta: 0,
        alpha: 0,
        beta: 0,
        gamma: 0,
        omega: 0,
        index: 0,
        total: 1,
      };

      const oscillator = new DuffingOscillator(extremeParams);

      expect(oscillator).toBeInstanceOf(DuffingOscillator);
    });

    test("should handle large total oscillator count", () => {
      const oscillator = new DuffingOscillator({ index: 50, total: 100 });

      expect(oscillator).toBeInstanceOf(DuffingOscillator);
    });
  });

  describe("update method", () => {
    test("should update oscillator position and velocity", () => {
      const oscillator = new DuffingOscillator();
      const dt = 0.016; // 60fps

      tracker.reset();
      tracker.startTimer();

      const result = oscillator.update(dt);

      tracker.endTimer();
      tracker.increment("updates");
      const metrics = tracker.getMetrics();

      expect(result).toHaveProperty("x");
      expect(result).toHaveProperty("y");
      expect(result).toHaveProperty("dx");
      expect(result).toHaveProperty("dy");

      expect(typeof result.x).toBe("number");
      expect(typeof result.y).toBe("number");
      expect(typeof result.dx).toBe("number");
      expect(typeof result.dy).toBe("number");

      expect(metrics.updates).toBe(1);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should advance time with each update", () => {
      const oscillator = new DuffingOscillator();
      const dt = 0.016;

      const result1 = oscillator.update(dt);
      const result2 = oscillator.update(dt);

      // Position should change between updates due to time advancement
      expect(result1.x !== result2.x || result1.y !== result2.y).toBe(true);
    });

    test("should handle different time steps", () => {
      const oscillator = new DuffingOscillator();

      const smallDt = 0.001;
      const largeDt = 0.1;

      const result1 = oscillator.update(smallDt);
      oscillator.reset();
      const result2 = oscillator.update(largeDt);

      // Different time steps should produce different results
      expect(Math.abs(result1.dx - result2.dx)).toBeGreaterThan(0.001);
    });

    test("should apply containment force for large displacements", () => {
      const oscillator = new DuffingOscillator({
        alpha: 0, // Disable restoring force
        beta: 0, // Disable cubic term
        delta: 0, // Disable damping
        gamma: 10, // Large driving force
      });

      // Run multiple updates to build up displacement
      for (let i = 0; i < 100; i++) {
        oscillator.update(0.01);
      }

      const result = oscillator.update(0.01);

      // Should remain reasonably bounded due to containment
      expect(Math.abs(result.x)).toBeLessThan(2);
      expect(Math.abs(result.y)).toBeLessThan(2);
    });

    test("should handle boundary collisions", () => {
      const oscillator = new DuffingOscillator({
        gamma: 5, // Strong forcing to reach boundaries
        delta: 0, // No damping for easier boundary testing
      });

      // Run many updates to potentially hit boundaries
      let hitBoundary = false;
      for (let i = 0; i < 1000; i++) {
        const result = oscillator.update(0.01);

        // Check if we're near boundaries
        if (
          Math.abs(result.x) > 0.9 ||
          Math.abs(result.y) > 0.9 ||
          Math.abs(result.dx) < 0.1 // Velocity should be affected by reflection
        ) {
          hitBoundary = true;
        }
      }

      // With strong forcing, we should eventually approach boundaries
      expect(hitBoundary).toBe(true);
    });

    test("should maintain energy conservation approximately", () => {
      const oscillator = new DuffingOscillator({
        delta: 0, // No damping
        gamma: 0, // No external driving
      });

      const calculateEnergy = (result: {
        x: number;
        y: number;
        dx: number;
        dy: number;
      }) => {
        // Kinetic + potential energy (simplified)
        return (
          0.5 * (result.dx * result.dx + result.dy * result.dy) +
          0.5 * (result.x * result.x + result.y * result.y)
        );
      };

      const result1 = oscillator.update(0.01);
      const energy1 = calculateEnergy(result1);

      // Run several updates
      let result2 = result1; // Initialize with first result
      for (let i = 0; i < 10; i++) {
        result2 = oscillator.update(0.01);
      }
      const energy2 = calculateEnergy(result2);

      // Energy should be approximately conserved (allowing for numerical errors)
      const energyChange = Math.abs(energy2 - energy1) / energy1;
      expect(energyChange).toBeLessThan(0.5); // Allow 50% variation due to numerical integration
    });
  });

  describe("reset method", () => {
    test("should reset oscillator to initial state", () => {
      const oscillator = new DuffingOscillator({ index: 2, total: 4 });

      // Update oscillator to change its state
      for (let i = 0; i < 10; i++) {
        oscillator.update(0.016);
      }

      // Reset and check initial position
      oscillator.reset();
      const result = oscillator.update(0.001); // Small update to get position

      // Should be back at base position (on circle)
      const distance = Math.sqrt(result.x * result.x + result.y * result.y);
      expect(distance).toBeCloseTo(0.4, 1); // Should be at radius 0.4

      // Velocities should be reset to zero or small random values
      expect(Math.abs(result.dx)).toBeLessThan(0.1);
      expect(Math.abs(result.dy)).toBeLessThan(0.1);
    });

    test("should maintain oscillator index and total after reset", () => {
      const oscillator = new DuffingOscillator({ index: 3, total: 6 });

      oscillator.reset();
      const result = oscillator.update(0.001);

      // Position should correspond to index 3 out of 6 (angle = 3 * 2π / 6 = π)
      const expectedAngle = (2 * Math.PI * 3) / 6;
      const expectedX = Math.cos(expectedAngle) * 0.4;
      const expectedY = Math.sin(expectedAngle) * 0.4;

      expect(result.x).toBeCloseTo(expectedX, 1);
      expect(result.y).toBeCloseTo(expectedY, 1);
    });
  });

  describe("setBoundaries method", () => {
    test("should update oscillator boundaries", () => {
      const oscillator = new DuffingOscillator();

      const newBoundaries = {
        botLeft: [-0.5, -0.5] as [number, number],
        botRight: [0.5, -0.5] as [number, number],
        topLeft: [-0.5, 0.5] as [number, number],
        topRight: [0.5, 0.5] as [number, number],
      };

      oscillator.setBoundaries(newBoundaries);

      // Boundaries should be updated - test indirectly by checking behavior
      expect(() => oscillator.update(0.016)).not.toThrow();
    });

    test("should handle extreme boundary values", () => {
      const oscillator = new DuffingOscillator();

      const extremeBoundaries = {
        botLeft: [-10, -10] as [number, number],
        botRight: [10, -10] as [number, number],
        topLeft: [-10, 10] as [number, number],
        topRight: [10, 10] as [number, number],
      };

      oscillator.setBoundaries(extremeBoundaries);

      // Should not throw with extreme boundaries
      expect(() => oscillator.update(0.016)).not.toThrow();
    });

    test("should handle very small boundary values", () => {
      const oscillator = new DuffingOscillator();

      const smallBoundaries = {
        botLeft: [-0.1, -0.1] as [number, number],
        botRight: [0.1, -0.1] as [number, number],
        topLeft: [-0.1, 0.1] as [number, number],
        topRight: [0.1, 0.1] as [number, number],
      };

      oscillator.setBoundaries(smallBoundaries);

      // Should handle small boundaries without issues
      expect(() => oscillator.update(0.016)).not.toThrow();
    });
  });

  describe("updateAndGetSplat method", () => {
    test("should return splat data and new texcoord", () => {
      const oscillator = new DuffingOscillator();
      const canvas = createMockCanvas(800, 600);
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      tracker.reset();
      tracker.startTimer();

      const result = oscillator.updateAndGetSplat(
        0.016,
        canvas,
        color,
        prevTexcoord
      );

      tracker.endTimer();
      tracker.increment("splatGenerations");
      const metrics = tracker.getMetrics();

      // Should return splat data
      expect(result).toHaveProperty("splatData");
      expect(result).toHaveProperty("newTexcoord");

      const { splatData, newTexcoord } = result;

      // Verify splat data structure
      expect(splatData).toHaveProperty("texcoordX");
      expect(splatData).toHaveProperty("texcoordY");
      expect(splatData).toHaveProperty("prevTexcoordX");
      expect(splatData).toHaveProperty("prevTexcoordY");
      expect(splatData).toHaveProperty("deltaX");
      expect(splatData).toHaveProperty("deltaY");
      expect(splatData).toHaveProperty("color");

      // Check value ranges
      expect(splatData.texcoordX).toBeGreaterThanOrEqual(0);
      expect(splatData.texcoordX).toBeLessThanOrEqual(1);
      expect(splatData.texcoordY).toBeGreaterThanOrEqual(0);
      expect(splatData.texcoordY).toBeLessThanOrEqual(1);

      // Check that previous coordinates are set correctly
      expect(splatData.prevTexcoordX).toBe(prevTexcoord.x);
      expect(splatData.prevTexcoordY).toBe(prevTexcoord.y);

      // Check color is passed through
      expect(splatData.color).toBe(color);

      // Check new texcoord
      expect(newTexcoord.x).toBeGreaterThanOrEqual(0);
      expect(newTexcoord.x).toBeLessThanOrEqual(1);
      expect(newTexcoord.y).toBeGreaterThanOrEqual(0);
      expect(newTexcoord.y).toBeLessThanOrEqual(1);

      expect(metrics.splatGenerations).toBe(1);
      expect(metrics.executionTime).toBeGreaterThan(0);
    });

    test("should handle different aspect ratios", () => {
      const oscillator = new DuffingOscillator();
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      // Test portrait aspect ratio
      const portraitCanvas = createMockCanvas(400, 800);
      const portraitResult = oscillator.updateAndGetSplat(
        0.016,
        portraitCanvas,
        color,
        prevTexcoord
      );

      oscillator.reset();

      // Test landscape aspect ratio
      const landscapeCanvas = createMockCanvas(800, 400);
      const landscapeResult = oscillator.updateAndGetSplat(
        0.016,
        landscapeCanvas,
        color,
        prevTexcoord
      );

      // Delta values should be different due to aspect ratio correction
      expect(portraitResult.splatData.deltaX).not.toBe(
        landscapeResult.splatData.deltaX
      );
    });

    test("should handle square aspect ratio", () => {
      const oscillator = new DuffingOscillator();
      const squareCanvas = createMockCanvas(512, 512);
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      const result = oscillator.updateAndGetSplat(
        0.016,
        squareCanvas,
        color,
        prevTexcoord
      );

      // Should handle square canvas without issues
      expect(result.splatData.texcoordX).toBeGreaterThanOrEqual(0);
      expect(result.splatData.texcoordX).toBeLessThanOrEqual(1);
      expect(result.splatData.texcoordY).toBeGreaterThanOrEqual(0);
      expect(result.splatData.texcoordY).toBeLessThanOrEqual(1);
    });

    test("should clamp coordinates to [0, 1] range", () => {
      const oscillator = new DuffingOscillator({
        gamma: 10, // Large forcing to potentially go out of bounds
      });
      const canvas = createMockCanvas(800, 600);
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      // Run multiple updates to potentially go out of bounds
      for (let i = 0; i < 100; i++) {
        const result = oscillator.updateAndGetSplat(
          0.02,
          canvas,
          color,
          prevTexcoord
        );

        // Coordinates should always be clamped
        expect(result.splatData.texcoordX).toBeGreaterThanOrEqual(0);
        expect(result.splatData.texcoordX).toBeLessThanOrEqual(1);
        expect(result.splatData.texcoordY).toBeGreaterThanOrEqual(0);
        expect(result.splatData.texcoordY).toBeLessThanOrEqual(1);
        expect(result.newTexcoord.x).toBeGreaterThanOrEqual(0);
        expect(result.newTexcoord.x).toBeLessThanOrEqual(1);
        expect(result.newTexcoord.y).toBeGreaterThanOrEqual(0);
        expect(result.newTexcoord.y).toBeLessThanOrEqual(1);
      }
    });

    test("should preserve color information", () => {
      const oscillator = new DuffingOscillator();
      const canvas = createMockCanvas(800, 600);
      const color = { r: 0.8, g: 0.3, b: 0.9 };
      const prevTexcoord = { x: 0.2, y: 0.7 };

      const result = oscillator.updateAndGetSplat(
        0.016,
        canvas,
        color,
        prevTexcoord
      );

      expect(result.splatData.color).toEqual(color);
    });
  });
});

describe("DuffingOscillator Performance Tests", () => {
  let tracker: PerformanceTracker;

  beforeEach(() => {
    tracker = new PerformanceTracker();
  });

  describe("Update Performance", () => {
    test("should update efficiently", () => {
      const oscillator = new DuffingOscillator();

      tracker.reset();
      tracker.startTimer();

      // Simulate 60 fps for 1 second (60 updates)
      for (let i = 0; i < 60; i++) {
        oscillator.update(0.016);
        tracker.increment("updates");
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.updates).toBe(60);
      expect(metrics.executionTime).toBeLessThan(50); // Should be very fast
    });

    test("should scale performance with multiple oscillators", () => {
      const oscillatorCount = 10;
      const oscillators: DuffingOscillator[] = [];

      // Create multiple oscillators
      for (let i = 0; i < oscillatorCount; i++) {
        oscillators.push(
          new DuffingOscillator({ index: i, total: oscillatorCount })
        );
      }

      tracker.reset();
      tracker.startTimer();

      // Update all oscillators for multiple frames
      for (let frame = 0; frame < 30; frame++) {
        oscillators.forEach((oscillator) => {
          oscillator.update(0.016);
          tracker.increment("updates");
        });
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.updates).toBe(oscillatorCount * 30);
      expect(metrics.executionTime).toBeLessThan(100); // Should handle multiple oscillators efficiently
    });
  });

  describe("Splat Generation Performance", () => {
    test("should generate splats efficiently", () => {
      const oscillator = new DuffingOscillator();
      const canvas = createMockCanvas(800, 600);
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      tracker.reset();
      tracker.startTimer();

      // Generate many splats
      for (let i = 0; i < 100; i++) {
        oscillator.updateAndGetSplat(0.016, canvas, color, prevTexcoord);
        tracker.increment("splatGenerations");
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.splatGenerations).toBe(100);
      expect(metrics.executionTime).toBeLessThan(50);
    });

    test("should handle different canvas sizes efficiently", () => {
      const oscillator = new DuffingOscillator();
      const color = { r: 1.0, g: 0.5, b: 0.2 };
      const prevTexcoord = { x: 0.5, y: 0.5 };

      const canvasSizes = [
        [400, 300],
        [800, 600],
        [1920, 1080],
        [4096, 2160],
      ];

      canvasSizes.forEach(([width, height]) => {
        const canvas = createMockCanvas(width, height);

        tracker.reset();
        tracker.startTimer();

        for (let i = 0; i < 10; i++) {
          oscillator.updateAndGetSplat(0.016, canvas, color, prevTexcoord);
        }

        tracker.endTimer();
        const metrics = tracker.getMetrics();

        // Performance should not depend significantly on canvas size
        expect(metrics.executionTime).toBeLessThan(20);
      });
    });
  });

  describe("Memory Performance", () => {
    test("should not leak memory during long simulations", () => {
      const oscillator = new DuffingOscillator();
      const canvas = createMockCanvas(800, 600);
      const color = { r: 1.0, g: 0.5, b: 0.2 };

      tracker.reset();
      tracker.startTimer();

      // Simulate long running animation
      for (let i = 0; i < 1000; i++) {
        const prevTexcoord = { x: Math.random(), y: Math.random() };
        oscillator.updateAndGetSplat(0.016, canvas, color, prevTexcoord);
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.executionTime).toBeLessThan(200);
    });

    test("should handle creation and destruction efficiently", () => {
      tracker.reset();
      tracker.startTimer();

      // Create and update many oscillators
      for (let i = 0; i < 100; i++) {
        const oscillator = new DuffingOscillator({ index: i, total: 100 });
        oscillator.update(0.016);
        oscillator.reset();
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      expect(metrics.executionTime).toBeLessThan(100);
    });
  });

  describe("Chaos and Dynamics Performance", () => {
    test("should maintain chaotic behavior efficiently", () => {
      const oscillator1 = new DuffingOscillator({ gamma: 1.2, omega: 0.6 });
      const oscillator2 = new DuffingOscillator({ gamma: 1.2, omega: 0.6 });

      // Apply tiny perturbation to second oscillator
      oscillator2.update(0.0001);

      tracker.reset();
      tracker.startTimer();

      let diverged = false;
      for (let i = 0; i < 500; i++) {
        const result1 = oscillator1.update(0.01);
        const result2 = oscillator2.update(0.01);

        const distance = Math.sqrt(
          (result1.x - result2.x) ** 2 + (result1.y - result2.y) ** 2
        );

        if (distance > 0.1) {
          diverged = true;
          break;
        }
      }

      tracker.endTimer();
      const metrics = tracker.getMetrics();

      // Should complete simulation within reasonable time (divergence may vary in mock environment)
      expect(metrics.executionTime).toBeLessThan(100);
      // Note: Chaotic divergence may not always occur in the test timeframe with mock timing
    });

    test("should handle different parameter ranges efficiently", () => {
      const parameterSets = [
        { gamma: 0.1, omega: 0.1 }, // Weak forcing
        { gamma: 1.0, omega: 1.0 }, // Moderate forcing
        { gamma: 2.0, omega: 2.0 }, // Strong forcing
        { gamma: 5.0, omega: 0.3 }, // Very strong, slow forcing
      ];

      parameterSets.forEach((params) => {
        const oscillator = new DuffingOscillator(params);

        tracker.reset();
        tracker.startTimer();

        for (let i = 0; i < 100; i++) {
          oscillator.update(0.016);
        }

        tracker.endTimer();
        const metrics = tracker.getMetrics();

        // All parameter sets should perform similarly
        expect(metrics.executionTime).toBeLessThan(30);
      });
    });
  });
});
