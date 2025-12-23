import { gradientTextureCache } from "./GradientTextureCache";

const N_TIME_VALUES = 2;

function timeKey(index: number) {
  let key = "u_time";
  if (index > 0) key += String(index + 1);
  return key;
}

interface TimeState {
  seed: number;
  lastTime: number;
  elapsed: number;
  timeSpeed: number;
}

interface ColorConfiguration {
  gradient: string[];
}

export class WaveShaderRenderer {
  private timeStates: TimeState[];

  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionBuffer: WebGLBuffer | null;
  private gradientTexture: WebGLTexture | null;

  private a_position: number;

  private uniformLocations = new Map<string, WebGLUniformLocation | null>();

  constructor(
    canvas: HTMLCanvasElement,
    vertexShader: string,
    fragmentShader: string,
    colorConfig: ColorConfiguration,
    seed: number | undefined,
    numWaves: number,
    quality: number = 0.5,
    pixelRatio: number = 1.0
  ) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) {
      throw new Error("Failed to acquire WaveShader context");
    }
    this.gl = gl;
    this.program = WaveShaderRenderer.createProgram(
      gl,
      vertexShader,
      fragmentShader
    );
    this.positionBuffer = gl.createBuffer();
    // Use cached gradient texture instead of creating new one
    this.gradientTexture = gradientTextureCache.getOrCreateTexture(
      gl,
      colorConfig.gradient
    );
    this.a_position = gl.getAttribLocation(this.program, "a_position");

    seed ??= Math.random() * 100_000;
    this.timeStates = Array.from({ length: N_TIME_VALUES }).map(() => ({
      seed,
      lastTime: Date.now(),
      elapsed: 0,
      timeSpeed: 1,
    }));

    gl.vertexAttribPointer(
      this.a_position,
      /* vec2 */ 2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.useProgram(this.program);

    // Set initial uniform values
    gl.uniform1i(this.getUniformLocation("u_num_waves"), numWaves);
    gl.uniform1f(this.getUniformLocation("u_quality"), quality);
    gl.uniform1f(this.getUniformLocation("u_pixel_ratio"), pixelRatio);
  }

  public setColorConfig(colorConfig: ColorConfiguration) {
    const { gl } = this;
    // Use cached gradient texture
    this.gradientTexture = gradientTextureCache.getOrCreateTexture(
      gl,
      colorConfig.gradient
    );
  }

  public getSeed() {
    const state = this.timeStates[0];
    return state.seed;
  }

  public getTime() {
    const state = this.timeStates[0];
    return state.elapsed / 1000;
  }

  public render() {
    const { gl } = this;
    const now = Date.now();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Set uniforms
    for (let i = 0; i < N_TIME_VALUES; i++) {
      const state = this.timeStates[i];
      state.elapsed += (now - state.lastTime) * state.timeSpeed;
      state.lastTime = now;
      const time = state.seed + state.elapsed / 1000;
      gl.uniform1f(this.getUniformLocation(timeKey(i)), time);
    }
    gl.uniform1f(this.getUniformLocation("u_w"), gl.canvas.width);
    gl.uniform1f(this.getUniformLocation("u_h"), gl.canvas.height);

    // Pass gradient texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.gradientTexture);
    gl.uniform1i(this.getUniformLocation("u_gradient"), 0);

    // Clear canvas
    this.clear();

    // Draw 2 triangles forming quad
    gl.vertexAttribPointer(
      this.a_position,
      /* vec2 */ 2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(this.a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, this.positions().length / 2);
  }

  public setUniform(key: string, value: number) {
    const timeKeyMatch = /^time(?<num>[1-9]?)$/.exec(key);
    if (timeKeyMatch) {
      const numString = timeKeyMatch.groups?.num;
      const index = numString ? Number(numString) - 1 : 0;
      // The special key "time" controls the renderer time speed
      this.setTimeSpeed(index, value);
      return;
    }
    this.gl.uniform1f(this.getUniformLocation(key), value);
  }

  public setTimeSpeed(index: number, value: number) {
    this.timeStates[index].timeSpeed = value;
  }

  public setDimensions(width: number, height: number, scale: number = 1.0) {
    const { gl } = this;

    const canvas = gl.canvas;
    // Apply scale for resolution reduction
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    // Set CSS size to maintain visual size
    if (canvas instanceof HTMLCanvasElement) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    // Place positions into buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.positions()),
      gl.STATIC_DRAW
    );
  }

  private getUniformLocation(key: string): WebGLUniformLocation | null {
    let location = this.uniformLocations.get(key);
    if (location == null) {
      location = this.gl.getUniformLocation(this.program, key);
      this.uniformLocations.set(key, location);
    }
    return location;
  }

  private positions() {
    // prettier-ignore
    return [
      0, 0,   1, 0,   0, 1, // Top-left triangle
      1, 1,   1, 0,   0, 1, // Bottom-right triangle
    ];
  }

  private clear() {
    const { gl } = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private static createShader(
    gl: WebGLRenderingContext,
    type:
      | WebGLRenderingContext["VERTEX_SHADER"]
      | WebGLRenderingContext["FRAGMENT_SHADER"],
    source: string
  ): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed to compile shader: ${error}`);
  }

  private static createProgram(
    gl: WebGLRenderingContext,
    vertexShader: string,
    fragmentShader: string
  ) {
    const program = gl.createProgram();
    if (!program) {
      throw new Error("Failed to create program");
    }
    gl.attachShader(
      program,
      this.createShader(gl, gl.VERTEX_SHADER, vertexShader)
    );
    gl.attachShader(
      program,
      this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    );
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    gl.deleteProgram(program);
    throw new Error("Failed to create shader");
  }
}
