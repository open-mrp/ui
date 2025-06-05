// Bloom management utilities using functional programming

// Import shader source code
import {
  bloomBlurShader as bloomBlurShaderSource,
  bloomFinalShader as bloomFinalShaderSource,
  bloomPrefilterShader as bloomPrefilterShaderSource,
} from "./shaders";
import { BaseFBO, BloomConfig, BloomPrograms } from "./types";

// Internal state - only tracking framebuffers and cached values
let bloomFramebuffers: BaseFBO[] = [];
let cachedBloomConfig: BloomConfig | null = null;
let cachedResolution: { width: number; height: number } | null = null;

/**
 * Initialize bloom shaders
 * @param gl - WebGL context
 * @param baseVertexShader - Base vertex shader
 * @param compileShader - Function to compile shader
 */
export const initBloomShaders = (
  gl: WebGLRenderingContext,
  baseVertexShader: WebGLShader,
  compileShader: (type: number, source: string) => WebGLShader
): {
  bloomPrefilterShader: WebGLShader;
  bloomBlurShader: WebGLShader;
  bloomFinalShader: WebGLShader;
} => {
  const compiledPrefilterShader = compileShader(
    gl.FRAGMENT_SHADER,
    bloomPrefilterShaderSource
  );
  const compiledBlurShader = compileShader(
    gl.FRAGMENT_SHADER,
    bloomBlurShaderSource
  );
  const compiledFinalShader = compileShader(
    gl.FRAGMENT_SHADER,
    bloomFinalShaderSource
  );

  return {
    bloomPrefilterShader: compiledPrefilterShader,
    bloomBlurShader: compiledBlurShader,
    bloomFinalShader: compiledFinalShader,
  };
};

/**
 * Check if bloom framebuffers need to be recreated
 */
const needsFramebufferUpdate = (
  config: BloomConfig,
  res: { width: number; height: number }
): boolean => {
  if (!cachedBloomConfig || !cachedResolution) return true;

  return (
    cachedBloomConfig.iterations !== config.iterations ||
    cachedBloomConfig.resolution !== config.resolution ||
    cachedResolution.width !== res.width ||
    cachedResolution.height !== res.height
  );
};

/**
 * Initialize bloom framebuffers based on resolution
 * @param gl - WebGL context
 * @param config - Bloom configuration from script.js
 * @param createFBO - Function to create framebuffer object
 * @param getResolution - Function to get resolution
 * @param ext - WebGL extensions
 */
export const initBloomFramebuffers = (
  gl: WebGLRenderingContext,
  config: BloomConfig,
  createFBO: (
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ) => BaseFBO,
  getResolution: (resolution: number) => { width: number; height: number },
  ext: {
    halfFloatTexType: number;
    formatRGBA: { internalFormat: number; format: number };
    supportLinearFiltering: boolean;
  }
): BaseFBO[] => {
  const res = getResolution(config.resolution);

  // Early return if framebuffers don't need updating
  if (!needsFramebufferUpdate(config, res)) {
    return bloomFramebuffers;
  }

  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  // Create main bloom FBO
  const bloom = createFBO(
    res.width,
    res.height,
    ext.formatRGBA.internalFormat,
    ext.formatRGBA.format,
    ext.halfFloatTexType,
    filtering
  );

  // Clear existing framebuffers only if we need to recreate
  bloomFramebuffers.length = 0;

  // Create mip chain with optimized loop
  const maxIterations = Math.min(
    config.iterations,
    Math.floor(Math.log2(Math.min(res.width, res.height))) - 1
  );

  for (let i = 0; i < maxIterations; i++) {
    const width = res.width >> (i + 1);
    const height = res.height >> (i + 1);

    if (width < 2 || height < 2) break;

    const fbo = createFBO(
      width,
      height,
      ext.formatRGBA.internalFormat,
      ext.formatRGBA.format,
      ext.halfFloatTexType,
      filtering
    );
    bloomFramebuffers.push(fbo);
  }

  // Cache current config and resolution
  cachedBloomConfig = { ...config };
  cachedResolution = { ...res };

  return bloomFramebuffers;
};

/**
 * Apply bloom effect with optimized performance
 * @param gl - WebGL context
 * @param config - Bloom configuration from script.js
 * @param source - Source framebuffer
 * @param destination - Destination framebuffer
 * @param blit - Blit function
 * @param programs - Bloom-related shader programs
 */
export const applyBloom = (
  gl: WebGLRenderingContext,
  config: BloomConfig,
  source: BaseFBO,
  destination: BaseFBO,
  blit: (target: BaseFBO | null) => void,
  programs: BloomPrograms
): void => {
  if (bloomFramebuffers.length < 2) return;

  let last = destination;

  // Batch state changes at the beginning
  gl.disable(gl.BLEND);

  // Prefilter pass with optimized uniform setting
  programs.bloomPrefilter.bind();

  // Pre-calculate curve values to avoid repeated arithmetic
  const knee = config.threshold * config.softKnee + 0.0001;
  const curve0 = config.threshold - knee;
  const curve1 = knee * 2;
  const curve2 = 0.25 / knee;

  gl.uniform3f(programs.bloomPrefilter.uniforms.curve, curve0, curve1, curve2);
  gl.uniform1f(programs.bloomPrefilter.uniforms.threshold, config.threshold);
  gl.uniform1i(programs.bloomPrefilter.uniforms.uTexture, source.attach(0));
  blit(last);

  // Blur and downscale passes
  programs.bloomBlur.bind();

  // Cache the blur program uniforms to avoid repeated property access
  const blurUniforms = programs.bloomBlur.uniforms;

  for (let i = 0; i < bloomFramebuffers.length; i++) {
    const dest = bloomFramebuffers[i];
    gl.uniform2f(blurUniforms.texelSize, last.texelSizeX, last.texelSizeY);
    gl.uniform1i(blurUniforms.uTexture, last.attach(0));
    blit(dest);
    last = dest;
  }

  // Upscale and blend passes with optimized state management
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.enable(gl.BLEND);

  // Reverse iteration for better cache locality
  for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
    const baseTex = bloomFramebuffers[i];
    gl.uniform2f(blurUniforms.texelSize, last.texelSizeX, last.texelSizeY);
    gl.uniform1i(blurUniforms.uTexture, last.attach(0));
    gl.viewport(0, 0, baseTex.width, baseTex.height);
    blit(baseTex);
    last = baseTex;
  }

  // Final composite pass
  gl.disable(gl.BLEND);
  programs.bloomFinal.bind();

  // Batch final uniform calls
  const finalUniforms = programs.bloomFinal.uniforms;
  gl.uniform2f(finalUniforms.texelSize, last.texelSizeX, last.texelSizeY);
  gl.uniform1i(finalUniforms.uTexture, last.attach(0));
  gl.uniform1f(finalUniforms.intensity, config.intensity);

  blit(destination);
};

/**
 * Get current bloom framebuffers
 */
export const getBloomFramebuffers = (): BaseFBO[] => {
  return [...bloomFramebuffers];
};

/**
 * Clear cached bloom state (useful for forcing recreation)
 */
export const clearBloomCache = (): void => {
  cachedBloomConfig = null;
  cachedResolution = null;
};
