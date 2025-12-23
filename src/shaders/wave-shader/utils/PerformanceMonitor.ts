export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private frameTimeMs = 0;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  // Rolling average for smoother FPS
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private historySize = 30;

  public metrics: PerformanceMetrics = {
    fps: 0,
    frameTimeMs: 0,
    avgFps: 0,
    avgFrameTimeMs: 0,
    minFps: Infinity,
    maxFps: 0,
  };

  constructor() {
    this.measure = this.measure.bind(this);
  }

  public measure() {
    const now = performance.now();
    const delta = now - this.lastTime;

    this.frameCount++;

    // Update every 100ms for more stable readings
    if (delta >= 100) {
      this.fps = (this.frameCount * 1000) / delta;
      this.frameTimeMs = delta / this.frameCount;

      // Update history
      this.fpsHistory.push(this.fps);
      this.frameTimeHistory.push(this.frameTimeMs);

      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift();
        this.frameTimeHistory.shift();
      }

      // Calculate averages
      const avgFps =
        this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      const avgFrameTime =
        this.frameTimeHistory.reduce((a, b) => a + b, 0) /
        this.frameTimeHistory.length;

      // Update metrics
      this.metrics = {
        fps: Math.round(this.fps),
        frameTimeMs: Math.round(this.frameTimeMs * 100) / 100,
        avgFps: Math.round(avgFps),
        avgFrameTimeMs: Math.round(avgFrameTime * 100) / 100,
        minFps: Math.min(this.metrics.minFps, this.fps),
        maxFps: Math.max(this.metrics.maxFps, this.fps),
      };

      // Notify callbacks
      this.callbacks.forEach((cb) => cb(this.metrics));

      // Reset counters
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  public onUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  public reset() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.frameTimeHistory = [];
    this.metrics.minFps = Infinity;
    this.metrics.maxFps = 0;
  }
}

export interface PerformanceMetrics {
  fps: number;
  frameTimeMs: number;
  avgFps: number;
  avgFrameTimeMs: number;
  minFps: number;
  maxFps: number;
}
