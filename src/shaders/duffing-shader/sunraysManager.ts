// Sunrays management utilities using functional programming

// Import shader source code
import {
  blurShader as blurShaderSource,
  blurVertexShader as blurVertexShaderSource,
  sunraysMaskShader as sunraysMaskShaderSource,
  sunraysShader as sunraysShaderSource,
} from "./shaders";
import { BaseFBO, SunraysConfig, SunraysPrograms } from "./types";

// Internal state - only tracking framebuffers
let sunraysFramebuffers: {
  sunrays: BaseFBO | null;
  temp: BaseFBO | null;
} = {
  sunrays: null,
  temp: null,
};

// WebGL state caching to reduce redundant calls
let cachedBlendEnabled: boolean = false;

// Pre-allocated return object to avoid object creation
let framebufferResult: { sunrays: BaseFBO; temp: BaseFBO } | null = null;

/**
 * Initialize sunrays shaders
 * @param gl - WebGL context
 * @param baseVertexShader - Base vertex shader
 * @param compileShader - Function to compile shader
 */
export const initSunraysShaders = (
  gl: WebGLRenderingContext,
  baseVertexShader: WebGLShader,
  compileShader: (type: number, source: string) => WebGLShader
): {
  sunraysMaskShader: WebGLShader;
  sunraysShader: WebGLShader;
  blurVertexShader: WebGLShader;
  blurShader: WebGLShader;
} => {
  const compiledSunraysMaskShader = compileShader(
    gl.FRAGMENT_SHADER,
    sunraysMaskShaderSource
  );
  const compiledSunraysShader = compileShader(
    gl.FRAGMENT_SHADER,
    sunraysShaderSource
  );
  const compiledBlurVertexShader = compileShader(
    gl.VERTEX_SHADER,
    blurVertexShaderSource
  );
  const compiledBlurShader = compileShader(
    gl.FRAGMENT_SHADER,
    blurShaderSource
  );

  return {
    sunraysMaskShader: compiledSunraysMaskShader,
    sunraysShader: compiledSunraysShader,
    blurVertexShader: compiledBlurVertexShader,
    blurShader: compiledBlurShader,
  };
};

/**
 * Initialize sunrays framebuffers - optimized to avoid object spread
 * @param gl - WebGL context
 * @param config - Sunrays configuration from script.js
 * @param createFBO - Function to create framebuffer object
 * @param getResolution - Function to get resolution
 * @param ext - WebGL extensions
 */
export const initSunraysFramebuffers = (
  gl: WebGLRenderingContext,
  config: SunraysConfig,
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
    formatR: { internalFormat: number; format: number };
    supportLinearFiltering: boolean;
  }
): { sunrays: BaseFBO; temp: BaseFBO } => {
  const res = getResolution(config.resolution);
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  sunraysFramebuffers.sunrays = createFBO(
    res.width,
    res.height,
    ext.formatR.internalFormat,
    ext.formatR.format,
    ext.halfFloatTexType,
    filtering
  );

  sunraysFramebuffers.temp = createFBO(
    res.width,
    res.height,
    ext.formatR.internalFormat,
    ext.formatR.format,
    ext.halfFloatTexType,
    filtering
  );

  // Update cached return object instead of creating new one
  if (!framebufferResult) {
    framebufferResult = {
      sunrays: sunraysFramebuffers.sunrays!,
      temp: sunraysFramebuffers.temp!,
    };
  } else {
    framebufferResult.sunrays = sunraysFramebuffers.sunrays!;
    framebufferResult.temp = sunraysFramebuffers.temp!;
  }

  return framebufferResult;
};

/**
 * Optimized WebGL state management
 */
const setBlendState = (gl: WebGLRenderingContext, enabled: boolean): void => {
  if (enabled !== cachedBlendEnabled) {
    if (enabled) {
      gl.enable(gl.BLEND);
    } else {
      gl.disable(gl.BLEND);
    }
    cachedBlendEnabled = enabled;
  }
};

/**
 * Test utility function to manipulate internal blend state for coverage testing
 * @internal - Only for testing purposes
 */
export const _testUtils = {
  resetBlendState: (): void => {
    cachedBlendEnabled = false;
  },
  setBlendStateForTesting: (
    gl: WebGLRenderingContext,
    enabled: boolean
  ): void => {
    setBlendState(gl, enabled);
  },
  getCachedBlendState: (): boolean => {
    return cachedBlendEnabled;
  },
};

/**
 * Apply sunrays effect - optimized with state caching
 * @param gl - WebGL context
 * @param config - Sunrays configuration from script.js
 * @param source - Source framebuffer
 * @param mask - Mask framebuffer
 * @param destination - Destination framebuffer
 * @param blit - Blit function
 * @param programs - Sunrays-related shader programs
 */
export const applySunrays = (
  gl: WebGLRenderingContext,
  config: SunraysConfig,
  source: BaseFBO,
  mask: BaseFBO,
  destination: BaseFBO,
  blit: (target: BaseFBO | null) => void,
  programs: SunraysPrograms
): void => {
  setBlendState(gl, false);

  // Apply mask
  programs.sunraysMask.bind();
  gl.uniform1i(programs.sunraysMask.uniforms.uTexture, source.attach(0));
  blit(mask);

  // Apply sunrays
  programs.sunrays.bind();
  gl.uniform1f(programs.sunrays.uniforms.weight, config.weight);
  gl.uniform1i(programs.sunrays.uniforms.uTexture, mask.attach(0));
  blit(destination);
};

/**
 * Apply blur effect to sunrays - optimized to cache texel sizes and reduce uniform updates
 * @param gl - WebGL context
 * @param target - Target framebuffer
 * @param temp - Temporary framebuffer
 * @param iterations - Number of blur iterations
 * @param blurProgram - Blur shader program
 * @param blit - Blit function
 */
export const applySunraysBlur = (
  gl: WebGLRenderingContext,
  target: BaseFBO,
  temp: BaseFBO,
  iterations: number,
  blurProgram: {
    bind: () => void;
    uniforms: {
      texelSize: WebGLUniformLocation;
      uTexture: WebGLUniformLocation;
    };
  },
  blit: (target: BaseFBO | null) => void
): void => {
  if (iterations === 0) return; // Early exit for zero iterations

  blurProgram.bind();

  // Cache texel sizes and uniform locations to avoid repeated property access
  const texelSizeX = target.texelSizeX;
  const texelSizeY = target.texelSizeY;
  const texelSizeUniform = blurProgram.uniforms.texelSize;
  const textureUniform = blurProgram.uniforms.uTexture;

  // Unroll the loop for common cases for better performance
  if (iterations === 1) {
    // Single iteration case - optimized
    gl.uniform2f(texelSizeUniform, texelSizeX, 0.0);
    gl.uniform1i(textureUniform, target.attach(0));
    blit(temp);

    gl.uniform2f(texelSizeUniform, 0.0, texelSizeY);
    gl.uniform1i(textureUniform, temp.attach(0));
    blit(target);
  } else {
    // Multiple iterations - optimized loop
    for (let i = 0; i < iterations; i++) {
      // Horizontal blur pass
      gl.uniform2f(texelSizeUniform, texelSizeX, 0.0);
      gl.uniform1i(textureUniform, target.attach(0));
      blit(temp);

      // Vertical blur pass
      gl.uniform2f(texelSizeUniform, 0.0, texelSizeY);
      gl.uniform1i(textureUniform, temp.attach(0));
      blit(target);
    }
  }
};
