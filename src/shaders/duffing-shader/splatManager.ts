// Splat management utilities using functional programming

// Import shader source code
import {
  advectionShader as advectionShaderSource,
  splatShader as splatShaderSource,
} from "./shaders";
import {
  BaseFBO,
  DoubleFBO,
  RGBColor,
  SplatConfig,
  SplatProgram,
} from "./types";

// Performance optimization: Cache for aspect ratio calculations
let cachedAspectRatio: number = 1.0;
let cachedCanvasWidth: number = 0;
let cachedCanvasHeight: number = 0;

// WebGL state caching to reduce redundant calls
let cachedBlendEnabled: boolean = false;
let cachedBlendSrc: number = 0;
let cachedBlendDst: number = 0;

// Object pooling for splat data to reduce garbage collection
const splatPool: BatchedSplatData[] = [];
const pooledSplats: BatchedSplatData[] = [];

// Batch splat data for reduced GPU calls
interface BatchedSplatData {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: RGBColor;
  radius: number;
  force: number;
}

let velocitySplatBatch: BatchedSplatData[] = [];
let dyeSplatBatch: BatchedSplatData[] = [];

/**
 * Initialize splat and advection shaders
 */
export const initSplatShaders = (
  gl: WebGLRenderingContext,
  baseVertexShader: WebGLShader,
  compileShader: (
    type: number,
    source: string,
    keywords?: string[]
  ) => WebGLShader,
  supportLinearFiltering: boolean | null
): {
  splatShader: WebGLShader;
  advectionShader: WebGLShader;
} => {
  const compiledSplatShader = compileShader(
    gl.FRAGMENT_SHADER,
    splatShaderSource
  );
  const compiledAdvectionShader = compileShader(
    gl.FRAGMENT_SHADER,
    advectionShaderSource,
    supportLinearFiltering ? undefined : ["MANUAL_FILTERING"]
  );
  return {
    splatShader: compiledSplatShader,
    advectionShader: compiledAdvectionShader,
  };
};

/**
 * Optimized aspect ratio correction with caching
 */
const getAspectRatio = (canvas: HTMLCanvasElement): number => {
  if (
    canvas.width !== cachedCanvasWidth ||
    canvas.height !== cachedCanvasHeight
  ) {
    cachedCanvasWidth = canvas.width;
    cachedCanvasHeight = canvas.height;
    cachedAspectRatio = canvas.width / canvas.height;
  }
  return cachedAspectRatio;
};

/**
 * Correct radius based on aspect ratio (cached)
 */
const correctRadius = (radius: number, aspectRatio: number): number => {
  return aspectRatio > 1 ? radius * aspectRatio : radius;
};

/**
 * Optimized single splat application with reduced uniform updates
 */
export const applySplatOptimized = (
  gl: WebGLRenderingContext,
  config: SplatConfig,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: RGBColor,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void,
  aspectRatio?: number // Pre-computed aspect ratio
): void => {
  const computedAspectRatio = aspectRatio || getAspectRatio(canvas);
  const correctedRadius = correctRadius(
    config.SPLAT_RADIUS / 100.0,
    computedAspectRatio
  );

  splatProgram.bind();

  // Set shared uniforms once
  gl.uniform1f(splatProgram.uniforms.aspectRatio, computedAspectRatio);
  gl.uniform2f(splatProgram.uniforms.point, x, y);
  gl.uniform1f(splatProgram.uniforms.radius, correctedRadius);

  // Apply to velocity field
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
  gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
  blit(velocity.write);
  velocity.swap();

  // Apply to dye field (reuse bound textures)
  gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
  blit(dye.write);
  dye.swap();
};

/**
 * Legacy splat application for compatibility
 */
export const applySplat = (
  gl: WebGLRenderingContext,
  config: SplatConfig,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: RGBColor,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void
): void => {
  applySplatOptimized(
    gl,
    config,
    x,
    y,
    dx,
    dy,
    color,
    velocity,
    dye,
    canvas,
    splatProgram,
    blit
  );
};

/**
 * Batch multiple splats to reduce GPU state changes
 */
export const applyBatchedSplats = (
  gl: WebGLRenderingContext,
  splats: BatchedSplatData[],
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void
): void => {
  if (splats.length === 0) return;

  const aspectRatio = getAspectRatio(canvas);

  // Use optimized blend state management
  setBlendState(gl, true, gl.ONE, gl.ONE);

  splatProgram.bind();
  gl.uniform1f(splatProgram.uniforms.aspectRatio, aspectRatio);

  // Batch velocity splats
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
  for (const splat of splats) {
    const correctedRadius = correctRadius(splat.radius, aspectRatio);
    gl.uniform2f(splatProgram.uniforms.point, splat.x, splat.y);
    gl.uniform1f(splatProgram.uniforms.radius, correctedRadius);
    gl.uniform3f(
      splatProgram.uniforms.color,
      splat.dx * splat.force,
      splat.dy * splat.force,
      0.0
    );
    blit(velocity.write);
  }
  velocity.swap();

  // Batch dye splats
  gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
  for (const splat of splats) {
    const correctedRadius = correctRadius(splat.radius, aspectRatio);
    gl.uniform2f(splatProgram.uniforms.point, splat.x, splat.y);
    gl.uniform1f(splatProgram.uniforms.radius, correctedRadius);
    gl.uniform3f(
      splatProgram.uniforms.color,
      splat.color.r,
      splat.color.g,
      splat.color.b
    );
    blit(dye.write);
  }
  dye.swap();

  setBlendState(gl, false);
};

/**
 * Optimized pointer splat with pre-computed trails and batching
 */
export const handlePointerSplatOptimized = (
  pointer: {
    deltaX: number;
    deltaY: number;
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    color: RGBColor;
  },
  config: SplatConfig,
  gl: WebGLRenderingContext,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void
): void => {
  // Calculate speed once
  const speed = Math.sqrt(
    pointer.deltaX * pointer.deltaX + pointer.deltaY * pointer.deltaY
  );

  // Early exit for minimal movement
  if (speed < 0.001) return;

  // Pre-compute scaling factors
  const dynamicRadius = config.SPLAT_RADIUS * (1.0 / (1 + speed * 10));
  const dynamicForce = config.SPLAT_FORCE * (1 + speed * 2);

  // Calculate number of trail splats (clamped for performance)
  const numExtraSplats = Math.min(Math.floor(speed * 20), 10); // Clamp max trail length

  // Use pooled objects to reduce allocations
  const splats: BatchedSplatData[] = [];

  // Main splat
  const mainSplat = getPooledSplat();
  mainSplat.x = pointer.texcoordX;
  mainSplat.y = pointer.texcoordY;
  mainSplat.dx = pointer.deltaX;
  mainSplat.dy = pointer.deltaY;
  mainSplat.color = pointer.color;
  mainSplat.radius = dynamicRadius / 100.0;
  mainSplat.force = dynamicForce;
  splats.push(mainSplat);

  // Trail splats (pre-computed)
  if (numExtraSplats > 0) {
    const deltaX =
      (pointer.texcoordX - pointer.prevTexcoordX) / (numExtraSplats + 1);
    const deltaY =
      (pointer.texcoordY - pointer.prevTexcoordY) / (numExtraSplats + 1);
    const trailRadius = (dynamicRadius * 1.2) / 100.0;
    const trailForce = dynamicForce * 0.5;

    for (let i = 1; i <= numExtraSplats; i++) {
      const trailSplat = getPooledSplat();
      trailSplat.x = pointer.prevTexcoordX + deltaX * i;
      trailSplat.y = pointer.prevTexcoordY + deltaY * i;
      trailSplat.dx = pointer.deltaX;
      trailSplat.dy = pointer.deltaY;
      trailSplat.color = pointer.color;
      trailSplat.radius = trailRadius;
      trailSplat.force = trailForce;
      splats.push(trailSplat);
    }
  }

  // Apply all splats in batch
  applyBatchedSplats(gl, splats, velocity, dye, canvas, splatProgram, blit);

  // Return objects to pool
  for (const splat of splats) {
    returnSplatToPool(splat);
  }
};

/**
 * Legacy pointer splat handler for compatibility
 */
export const handlePointerSplat = (
  pointer: {
    deltaX: number;
    deltaY: number;
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    color: RGBColor;
  },
  config: SplatConfig,
  gl: WebGLRenderingContext,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void
): void => {
  handlePointerSplatOptimized(
    pointer,
    config,
    gl,
    velocity,
    dye,
    canvas,
    splatProgram,
    blit
  );
};

/**
 * Apply advection effect
 */
export const applyAdvection = (
  gl: WebGLRenderingContext,
  velocity: DoubleFBO,
  source: DoubleFBO,
  dt: number,
  dissipation: number,
  advectionProgram: {
    bind: () => void;
    uniforms: {
      uVelocity: WebGLUniformLocation;
      uSource: WebGLUniformLocation;
      texelSize: WebGLUniformLocation;
      dyeTexelSize: WebGLUniformLocation;
      dt: WebGLUniformLocation;
      dissipation: WebGLUniformLocation;
    };
  },
  blit: (target: BaseFBO | null) => void,
  supportLinearFiltering: boolean
): void => {
  gl.disable(gl.BLEND);
  advectionProgram.bind();

  if (!supportLinearFiltering) {
    gl.uniform2f(
      advectionProgram.uniforms.dyeTexelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
  }
  gl.uniform2f(
    advectionProgram.uniforms.texelSize,
    velocity.texelSizeX,
    velocity.texelSizeY
  );

  // If velocity and source are the same, use the same texture ID
  const velocityId = velocity.read.attach(0);
  if (velocity === source) {
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
  } else {
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, source.read.attach(1));
  }

  gl.uniform1f(advectionProgram.uniforms.dt, dt);
  gl.uniform1f(advectionProgram.uniforms.dissipation, dissipation);
  blit(source.write);
  source.swap();
};

/**
 * Optimized multiple random splats with batching
 */
export const multipleSplatsOptimized = (
  amount: number,
  config: SplatConfig,
  gl: WebGLRenderingContext,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void,
  getColorFromScheme: () => RGBColor
): void => {
  if (amount === 0) return;

  const splats: BatchedSplatData[] = [];

  // Pre-generate all splat data
  for (let i = 0; i < amount; i++) {
    const color = getColorFromScheme();
    const splat = getPooledSplat();

    splat.x = Math.random();
    splat.y = Math.random();
    splat.dx = 1000 * (Math.random() - 0.5);
    splat.dy = 1000 * (Math.random() - 0.5);
    splat.color = { r: color.r * 10.0, g: color.g * 10.0, b: color.b * 10.0 };
    splat.radius = config.SPLAT_RADIUS / 100.0;
    splat.force = config.SPLAT_FORCE;

    splats.push(splat);
  }

  // Apply all splats in batch
  applyBatchedSplats(gl, splats, velocity, dye, canvas, splatProgram, blit);

  // Return objects to pool
  for (const splat of splats) {
    returnSplatToPool(splat);
  }
};

/**
 * Create multiple random splats (legacy version for compatibility)
 */
export const multipleSplats = (
  amount: number,
  config: SplatConfig,
  gl: WebGLRenderingContext,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  canvas: HTMLCanvasElement,
  splatProgram: SplatProgram,
  blit: (target: BaseFBO | null) => void,
  getColorFromScheme: () => RGBColor
): void => {
  multipleSplatsOptimized(
    amount,
    config,
    gl,
    velocity,
    dye,
    canvas,
    splatProgram,
    blit,
    getColorFromScheme
  );
};

/**
 * Correct delta X based on aspect ratio
 */
export const correctDeltaX = (
  delta: number,
  canvas: HTMLCanvasElement
): number => {
  const aspectRatio = canvas.width / canvas.height;
  if (aspectRatio < 1) delta *= aspectRatio;
  return delta;
};

/**
 * Correct delta Y based on aspect ratio
 */
export const correctDeltaY = (
  delta: number,
  canvas: HTMLCanvasElement
): number => {
  const aspectRatio = canvas.width / canvas.height;
  if (aspectRatio > 1) delta /= aspectRatio;
  return delta;
};

/**
 * Get a pooled splat object to reduce allocations
 */
const getPooledSplat = (): BatchedSplatData => {
  return (
    splatPool.pop() || {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      color: { r: 0, g: 0, b: 0 },
      radius: 0,
      force: 0,
    }
  );
};

/**
 * Return splat object to pool
 */
const returnSplatToPool = (splat: BatchedSplatData): void => {
  if (splatPool.length < 50) {
    // Limit pool size
    splatPool.push(splat);
  }
};

/**
 * Optimized WebGL state management
 */
const setBlendState = (
  gl: WebGLRenderingContext,
  enabled: boolean,
  src?: number,
  dst?: number
): void => {
  if (enabled !== cachedBlendEnabled) {
    if (enabled) {
      gl.enable(gl.BLEND);
      if (src !== undefined && dst !== undefined) {
        if (src !== cachedBlendSrc || dst !== cachedBlendDst) {
          gl.blendFunc(src, dst);
          cachedBlendSrc = src;
          cachedBlendDst = dst;
        }
      }
    } else {
      gl.disable(gl.BLEND);
    }
    cachedBlendEnabled = enabled;
  }
};
