"use strict";
import { ColorConfiguration } from "../colorConfigurations";
import { FragmentShader } from "./types";

// Import managers for their functionality
import {
  applyBloom,
  clearBloomCache,
  initBloomFramebuffers,
  initBloomShaders,
} from "./bloomManager";
import {
  drawColor as drawBackgroundColor,
  getRandomColor,
  initColorShaders,
  setColorScheme,
} from "./colorManager";
import {
  applyCurl,
  applyDivergence,
  applyGradientSubtract,
  applyPressure,
  applyVorticity,
  initPhysicsShaders,
} from "./physicsManager";
import {
  applyAdvection,
  handlePointerSplatOptimized,
  initSplatShaders,
} from "./splatManager";
import {
  applySunrays,
  applySunraysBlur,
  initSunraysFramebuffers,
  initSunraysShaders,
} from "./sunraysManager";
import {
  AdvectionProgram,
  BaseFBO,
  BloomPrograms,
  BlurProgram,
  Boundaries,
  ColorProgram,
  Config,
  CurlFBO,
  DivergenceFBO,
  DoubleFBO,
  DyeFBO,
  PhysicsPrograms,
  ShaderUniforms,
  SplatData,
  SplatProgram,
  SunraysPrograms,
  VelocityFBO,
  WebGLContext,
} from "./types";

// Import shader sources
import { DuffingOscillator } from "./DuffingOscillator";
import {
  baseVertexShader,
  clearShader,
  copyShader,
  displayShader,
} from "./shaders";

export class FluidRenderer {
  private readonly gl: WebGLRenderingContext;
  private readonly ext: {
    formatRGBA: { internalFormat: number; format: number } | null;
    formatRG: { internalFormat: number; format: number } | null;
    formatR: { internalFormat: number; format: number } | null;
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };
  private config: Config;
  private readonly canvas: HTMLCanvasElement;
  private colorConfiguration: ColorConfiguration;
  private oscillators!: DuffingOscillator[];
  private oscillatorColors!: { r: number; g: number; b: number }[];
  private oscillatorPrevPositions!: { x: number; y: number }[];
  private lastUpdateTime: number;
  private animationFrameId: number | null = null;
  private skewType?: "full" | "bottom";
  private skewDegree: number = 6;

  // Cached canvas dimensions to avoid repeated property access
  private cachedCanvasWidth: number = 0;
  private cachedCanvasHeight: number = 0;
  private cachedAspectRatio: number = 1;

  // Pre-allocated objects for hot paths to avoid garbage collection
  private cachedPhysicsPrograms!: PhysicsPrograms;
  private readonly cachedVelocityTexelSize = { x: 0, y: 0 };
  private readonly cachedBloomConfig = {
    iterations: 0,
    resolution: 0,
    intensity: 0,
    threshold: 0,
    softKnee: 0,
  };
  private readonly cachedSunraysConfig = {
    resolution: 0,
    weight: 0,
  };
  private readonly cachedBloomPrograms = {
    bloomPrefilter: null as any,
    bloomBlur: null as any,
    bloomFinal: null as any,
  };
  private readonly cachedSunraysPrograms = {
    sunraysMask: null as any,
    sunrays: null as any,
    blur: null as any,
  };
  private readonly cachedSplatConfig = {
    SPLAT_FORCE: 0,
    SPLAT_RADIUS: 0,
  };

  // FBOs
  private dye!: DyeFBO;
  private velocity!: VelocityFBO;
  private divergence!: DivergenceFBO;
  private curl!: CurlFBO;
  private pressure!: DoubleFBO;
  private bloom!: BaseFBO;
  private bloomFramebuffers: BaseFBO[] = [];
  private sunrays!: BaseFBO;
  private sunraysTemp!: BaseFBO;

  // Programs
  private displayMaterial!: Material;
  private pressureProgram!: Program<PhysicsPrograms["pressure"]["uniforms"]>;
  private divergenceProgram!: Program<
    PhysicsPrograms["divergence"]["uniforms"]
  >;
  private curlProgram!: Program<PhysicsPrograms["curl"]["uniforms"]>;
  private vorticityProgram!: Program<PhysicsPrograms["vorticity"]["uniforms"]>;
  private gradienSubtractProgram!: Program<
    PhysicsPrograms["gradientSubtract"]["uniforms"]
  >;
  private sunraysMaskProgram!: Program<
    SunraysPrograms["sunraysMask"]["uniforms"]
  >;
  private sunraysProgram!: Program<SunraysPrograms["sunrays"]["uniforms"]>;
  private blurProgram!: Program<BlurProgram["uniforms"]>;
  private bloomPrefilterProgram!: Program<
    BloomPrograms["bloomPrefilter"]["uniforms"]
  >;
  private bloomBlurProgram!: Program<BloomPrograms["bloomBlur"]["uniforms"]>;
  private bloomFinalProgram!: Program<BloomPrograms["bloomFinal"]["uniforms"]>;
  private splatProgram!: Program<SplatProgram["uniforms"]>;
  private advectionProgram!: Program<AdvectionProgram["uniforms"]>;
  private colorProgram!: Program<ColorProgram["uniforms"]>;
  private copyProgram!: Program;
  private clearProgram!: Program;
  private boundaries!: Boundaries;

  private readonly ditheringTexture!: {
    texture: WebGLTexture | null;
    width: number;
    height: number;
    attach: (id: number) => number;
  };

  constructor(
    canvas: HTMLCanvasElement,
    config?: Partial<Config>,
    skewType?: "full" | "bottom",
    skewDegree: number = 6,
    shaders?: Record<string, FragmentShader>,
    colorConfiguration: ColorConfiguration = "default"
  ) {
    this.canvas = canvas;
    this.skewType = skewType;
    this.skewDegree = skewDegree;

    // Default configuration values
    const defaultConfig: Config = {
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
      ...config,
    };

    this.config = defaultConfig;

    const { gl, ext } = this.getWebGLContext(canvas);
    this.gl = gl;
    this.ext = ext;

    // Initialize geometry
    this.initializeGeometry();

    // Initialize color scheme
    this.colorConfiguration = colorConfiguration;
    this.initColorScheme();

    // Compile base shaders
    const baseVertexShaderCompiled = this.compileShader(
      gl.VERTEX_SHADER,
      baseVertexShader
    );

    if (shaders) {
      // If shaders are provided, use them
      this.initProgramsWithShaders(baseVertexShaderCompiled, shaders);
    } else {
      // Otherwise use the default initialization
      const copyShaderCompiled = this.compileShader(
        gl.FRAGMENT_SHADER,
        copyShader
      );
      const clearShaderCompiled = this.compileShader(
        gl.FRAGMENT_SHADER,
        clearShader
      );
      const displayShaderCompiled = this.compileShader(
        gl.FRAGMENT_SHADER,
        displayShader
      );

      this.initPrograms(
        baseVertexShaderCompiled,
        copyShaderCompiled,
        clearShaderCompiled,
        displayShaderCompiled
      );
    }

    // Initialize framebuffers
    this.initFramebuffers();

    // Initialize display keywords
    this.updateKeywords();

    // Initialize cached objects for hot paths
    this.initializeCachedObjects();

    // Initialize oscillator data
    this.initializeOscillators();

    this.lastUpdateTime = Date.now();

    // Initialize readonly ditheringTexture
    const ditheringTexture = this.createDitheringTexture();
    // Use type assertion to set readonly property during construction
    (this as any).ditheringTexture = ditheringTexture;

    // Start the animation loop
    this.update();
  }

  // Initialize geometry for rendering
  private initializeGeometry(): void {
    // Calculate boundaries once and reuse
    this.calculateBoundaries();

    const vertices = new Float32Array([
      ...this.boundaries.botLeft, // bottom left
      ...this.boundaries.botRight, // bottom right
      ...this.boundaries.topLeft, // top left
      ...this.boundaries.topRight, // top right
    ]);

    const indices = new Uint16Array([
      0,
      1,
      2, // first triangle
      2,
      1,
      3, // second triangle
    ]);

    // Create and bind vertex array object (VAO)
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Create and bind element array buffer
    const elementBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.gl.STATIC_DRAW
    );

    // Enable vertex attributes
    const vertexPosition = 0; // attribute location 0
    this.gl.enableVertexAttribArray(vertexPosition);
    this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
  }

  // Initialize cached objects for performance optimization
  private initializeCachedObjects(): void {
    this.cachedPhysicsPrograms = {
      pressure: this.pressureProgram,
      divergence: this.divergenceProgram,
      curl: this.curlProgram,
      vorticity: this.vorticityProgram,
      gradientSubtract: this.gradienSubtractProgram,
    };

    this.cachedBloomPrograms.bloomPrefilter = this.bloomPrefilterProgram;
    this.cachedBloomPrograms.bloomBlur = this.bloomBlurProgram;
    this.cachedBloomPrograms.bloomFinal = this.bloomFinalProgram;

    this.cachedSunraysPrograms.sunraysMask = this.sunraysMaskProgram;
    this.cachedSunraysPrograms.sunrays = this.sunraysProgram;
    this.cachedSunraysPrograms.blur = this.blurProgram;
  }

  // Extract boundary calculation logic to avoid duplication
  private calculateBoundaries(): void {
    const skewRadians = (this.skewDegree * Math.PI) / 180;
    const skewAmount = Math.tan(skewRadians);

    if (this.skewType === "full") {
      this.boundaries = {
        botLeft: [-1, -1 - skewAmount],
        botRight: [1, -1 + skewAmount],
        topLeft: [-1, 1 - skewAmount],
        topRight: [1, 1 + skewAmount],
      };
    } else if (this.skewType === "bottom") {
      // Convert from percentage space to NDC space (-1 to 1)
      // In WaveShader: right edge goes to (50 + skewDegree/2)% of height
      // Convert from [0,100] to [-1,1] space: (x/50 - 1)
      const rightEdgeY = (50 + this.skewDegree / 2) / 50 - 1;

      this.boundaries = {
        botLeft: [-1, -1], // (0%, 100%) -> (-1, -1)
        botRight: [1, rightEdgeY], // (100%, 50+skewDegree/2%) -> (1, rightEdgeY)
        topLeft: [-1, 1], // (0%, 0%) -> (-1, 1)
        topRight: [1, 1], // (100%, 0%) -> (1, 1)
      };
    } else {
      this.boundaries = {
        botLeft: [-1, -1],
        botRight: [1, -1],
        topLeft: [-1, 1],
        topRight: [1, 1],
      };
    }
  }

  // Separate oscillator initialization for cleaner code
  private initializeOscillators(): void {
    const numOscillators = this.config.DUFFING.NUM_OSCILLATORS;

    // Pre-generate fixed colors for each oscillator
    this.oscillatorColors = new Array(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillatorColors[i] = getRandomColor();
    }

    // Initialize oscillators
    this.oscillators = new Array(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillators[i] = new DuffingOscillator({
        delta: this.config.DUFFING.DELTA,
        beta: this.config.DUFFING.BETA,
        alpha: this.config.DUFFING.ALPHA,
        gamma: this.config.DUFFING.GAMMA,
        omega: this.config.DUFFING.OMEGA,
        index: i,
        total: numOscillators,
        boundaries: this.boundaries,
      });
    }

    // Initialize previous positions for each oscillator
    this.oscillatorPrevPositions = new Array(numOscillators);
    for (let i = 0; i < numOscillators; i++) {
      this.oscillatorPrevPositions[i] = { x: 0.5, y: 0.5 };
    }
  }

  private initProgramsWithShaders(
    baseVertexShader: WebGLShader,
    shaders: Record<string, FragmentShader>
  ) {
    const gl = this.gl;

    // Compile all fragment shaders
    const compiledShaders = Object.entries(shaders).reduce(
      (acc, [key, value]) => {
        acc[key] = this.compileShader(gl.FRAGMENT_SHADER, value.shader);
        return acc;
      },
      {} as Record<string, WebGLShader>
    );

    // Initialize programs with compiled shaders
    this.pressureProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.pressure
    );
    this.divergenceProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.divergence
    );
    this.curlProgram = new Program(gl, baseVertexShader, compiledShaders.curl);
    this.vorticityProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.vorticity
    );
    this.gradienSubtractProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.gradientSubtract
    );
    this.sunraysMaskProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.sunraysMask
    );
    this.sunraysProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.sunrays
    );
    this.blurProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.bloomBlur
    );
    this.bloomPrefilterProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.bloomPrefilter
    );
    this.bloomBlurProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.bloomBlur
    );
    this.bloomFinalProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.bloomFinal
    );
    this.splatProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.splat
    );
    this.advectionProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.advection
    );
    this.colorProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.color
    );
    this.copyProgram = new Program(gl, baseVertexShader, compiledShaders.copy);
    this.clearProgram = new Program(
      gl,
      baseVertexShader,
      compiledShaders.clear
    );
    this.displayMaterial = new Material(
      gl,
      baseVertexShader,
      compiledShaders.display
    );
  }

  private initPrograms(
    baseVertexShader: WebGLShader,
    copyShader: WebGLShader,
    clearShader: WebGLShader,
    displayShader: WebGLShader
  ) {
    const physicsShaders = initPhysicsShaders(
      this.gl,
      baseVertexShader,
      (type, source) => this.compileShader(type, source)
    );
    const sunraysShaders = initSunraysShaders(
      this.gl,
      baseVertexShader,
      (type, source) => this.compileShader(type, source)
    );
    const bloomShaders = initBloomShaders(
      this.gl,
      baseVertexShader,
      (type, source) => this.compileShader(type, source)
    );
    const splatShaders = initSplatShaders(
      this.gl,
      baseVertexShader,
      (type, source) => this.compileShader(type, source),
      this.ext.supportLinearFiltering
    );
    const colorShaders = initColorShaders(
      this.gl,
      baseVertexShader,
      (type, source) => this.compileShader(type, source)
    );

    this.pressureProgram = new Program(
      this.gl,
      baseVertexShader,
      physicsShaders.pressureShader
    );
    this.divergenceProgram = new Program(
      this.gl,
      baseVertexShader,
      physicsShaders.divergenceShader
    );
    this.curlProgram = new Program(
      this.gl,
      baseVertexShader,
      physicsShaders.curlShader
    );
    this.vorticityProgram = new Program(
      this.gl,
      baseVertexShader,
      physicsShaders.vorticityShader
    );
    this.gradienSubtractProgram = new Program(
      this.gl,
      baseVertexShader,
      physicsShaders.gradientSubtractShader
    );

    this.sunraysMaskProgram = new Program(
      this.gl,
      baseVertexShader,
      sunraysShaders.sunraysMaskShader
    );
    this.sunraysProgram = new Program(
      this.gl,
      baseVertexShader,
      sunraysShaders.sunraysShader
    );
    this.blurProgram = new Program(
      this.gl,
      baseVertexShader,
      sunraysShaders.blurShader
    );

    this.bloomPrefilterProgram = new Program(
      this.gl,
      baseVertexShader,
      bloomShaders.bloomPrefilterShader
    );
    this.bloomBlurProgram = new Program(
      this.gl,
      baseVertexShader,
      bloomShaders.bloomBlurShader
    );
    this.bloomFinalProgram = new Program(
      this.gl,
      baseVertexShader,
      bloomShaders.bloomFinalShader
    );

    this.splatProgram = new Program(
      this.gl,
      baseVertexShader,
      splatShaders.splatShader
    );
    this.advectionProgram = new Program(
      this.gl,
      baseVertexShader,
      splatShaders.advectionShader
    );

    this.colorProgram = new Program(
      this.gl,
      baseVertexShader,
      colorShaders.colorShader
    );
    this.copyProgram = new Program(this.gl, baseVertexShader, copyShader);
    this.clearProgram = new Program(this.gl, baseVertexShader, clearShader);
    this.displayMaterial = new Material(
      this.gl,
      baseVertexShader,
      displayShader
    );
  }

  private initColorScheme() {
    setColorScheme(this.colorConfiguration);
  }

  private update = () => {
    const dt = this.calcDeltaTime();

    // Cache canvas dimensions if they changed to avoid repeated property access
    if (
      this.canvas.width !== this.cachedCanvasWidth ||
      this.canvas.height !== this.cachedCanvasHeight
    ) {
      this.cachedCanvasWidth = this.canvas.width;
      this.cachedCanvasHeight = this.canvas.height;
      this.cachedAspectRatio = this.cachedCanvasWidth / this.cachedCanvasHeight;
    }

    if (this.resizeCanvas()) this.initFramebuffers();
    this.applyInputs(dt);
    this.step(dt);
    this.render(null);
    this.animationFrameId = requestAnimationFrame(this.update);
  };

  private calcDeltaTime(): number {
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;
    return Math.min(dt, 0.016666);
  }

  private resizeCanvas(): boolean {
    const width = this.scaleByPixelRatio(this.canvas.clientWidth);
    const height = this.scaleByPixelRatio(this.canvas.clientHeight);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      return true;
    }
    return false;
  }

  private applyInputs(dt: number) {
    // Update oscillators and generate splats
    this.oscillators.forEach((oscillator, index) => {
      const { splatData, newTexcoord } = oscillator.updateAndGetSplat(
        dt,
        this.canvas,
        this.oscillatorColors[index],
        this.oscillatorPrevPositions[index]
      );

      // Update stored position for next frame
      this.oscillatorPrevPositions[index] = newTexcoord;

      // Generate splat
      this.handleSplat(splatData);
    });
  }

  private step(dt: number) {
    this.gl.disable(this.gl.BLEND);

    // Update cached velocity texel size
    this.cachedVelocityTexelSize.x = this.velocity.texelSizeX;
    this.cachedVelocityTexelSize.y = this.velocity.texelSizeY;

    applyCurl(
      this.gl,
      this.velocity,
      this.curl,
      this.cachedPhysicsPrograms,
      this.blit,
      this.cachedVelocityTexelSize
    );
    applyVorticity(
      this.gl,
      this.config,
      dt,
      this.velocity,
      this.curl,
      this.cachedPhysicsPrograms,
      this.blit,
      this.cachedVelocityTexelSize
    );
    applyDivergence(
      this.gl,
      this.velocity,
      this.divergence,
      this.cachedPhysicsPrograms,
      this.blit,
      this.cachedVelocityTexelSize
    );

    this.clearProgram.bind();
    this.gl.uniform1i(
      this.clearProgram.uniforms.uTexture,
      this.pressure.read.attach(0)
    );
    this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE);
    this.blit(this.pressure.write);
    this.pressure.swap();

    applyPressure(
      this.gl,
      this.config,
      this.pressure,
      this.divergence,
      this.velocity,
      this.cachedPhysicsPrograms,
      this.blit,
      this.cachedVelocityTexelSize
    );
    applyGradientSubtract(
      this.gl,
      this.pressure,
      this.velocity,
      this.cachedPhysicsPrograms,
      this.blit,
      this.cachedVelocityTexelSize
    );

    applyAdvection(
      this.gl,
      this.velocity,
      this.velocity,
      dt,
      this.config.VELOCITY_DISSIPATION,
      this.advectionProgram,
      this.blit,
      this.ext.supportLinearFiltering
    );

    applyAdvection(
      this.gl,
      this.velocity,
      this.dye,
      dt,
      this.config.DENSITY_DISSIPATION,
      this.advectionProgram,
      this.blit,
      this.ext.supportLinearFiltering
    );
  }

  private render(target: BaseFBO | null) {
    // Update cached bloom config
    this.cachedBloomConfig.iterations = this.config.BLOOM_ITERATIONS;
    this.cachedBloomConfig.resolution = this.config.BLOOM_RESOLUTION;
    this.cachedBloomConfig.intensity = this.config.BLOOM_INTENSITY;
    this.cachedBloomConfig.threshold = this.config.BLOOM_THRESHOLD;
    this.cachedBloomConfig.softKnee = this.config.BLOOM_SOFT_KNEE;

    // Update cached sunrays config
    this.cachedSunraysConfig.resolution = this.config.SUNRAYS_RESOLUTION;
    this.cachedSunraysConfig.weight = this.config.SUNRAYS_WEIGHT;

    applyBloom(
      this.gl,
      this.cachedBloomConfig,
      this.dye.read,
      this.bloom,
      this.blit,
      this.cachedBloomPrograms
    );

    applySunrays(
      this.gl,
      this.cachedSunraysConfig,
      this.dye.read,
      this.dye.write,
      this.sunrays,
      this.blit,
      this.cachedSunraysPrograms
    );

    applySunraysBlur(
      this.gl,
      this.sunrays,
      this.sunraysTemp,
      1,
      this.blurProgram,
      this.blit
    );

    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    drawBackgroundColor(
      this.gl,
      target,
      this.config.BACK_COLOR,
      this.colorProgram,
      this.blit
    );
    this.drawDisplay(target);
  }

  private drawDisplay(target: BaseFBO | null) {
    const width = target == null ? this.gl.drawingBufferWidth : target.width;
    const height = target == null ? this.gl.drawingBufferHeight : target.height;

    this.displayMaterial.bind();
    this.gl.uniform2f(
      this.displayMaterial.uniforms.texelSize,
      1.0 / width,
      1.0 / height
    );
    this.gl.uniform1i(
      this.displayMaterial.uniforms.uTexture,
      this.dye.read.attach(0)
    );
    this.gl.uniform1i(
      this.displayMaterial.uniforms.uBloom,
      this.bloom.attach(1)
    );
    this.gl.uniform1i(
      this.displayMaterial.uniforms.uDithering,
      this.ditheringTexture.attach(2)
    );
    const scale = this.getTextureScale(this.ditheringTexture, width, height);
    this.gl.uniform2f(
      this.displayMaterial.uniforms.ditherScale,
      scale.x,
      scale.y
    );
    this.gl.uniform1i(
      this.displayMaterial.uniforms.uSunrays,
      this.sunrays.attach(3)
    );
    this.blit(target);
  }

  private handleSplat(splatData: SplatData) {
    // Update cached splat config
    this.cachedSplatConfig.SPLAT_FORCE = this.config.SPLAT_FORCE;
    this.cachedSplatConfig.SPLAT_RADIUS = this.config.SPLAT_RADIUS;

    handlePointerSplatOptimized(
      splatData,
      this.cachedSplatConfig,
      this.gl,
      this.velocity,
      this.dye,
      this.canvas,
      this.splatProgram,
      this.blit
    );
  }

  public updateConfig(newConfig: Partial<Config>) {
    // Only update changed properties to avoid unnecessary spreading
    Object.assign(this.config, newConfig);

    // Update color scheme and regenerate colors only if needed
    this.initColorScheme();

    // Only regenerate colors if the number of oscillators changed
    if (
      newConfig.DUFFING?.NUM_OSCILLATORS &&
      newConfig.DUFFING.NUM_OSCILLATORS !== this.oscillators.length
    ) {
      // Reinitialize oscillators with new count
      this.initializeOscillators();
    } else {
      // Just regenerate colors for existing oscillators (optimized loop)
      const numOscillators = this.config.DUFFING.NUM_OSCILLATORS;
      for (let i = 0; i < numOscillators; i++) {
        this.oscillatorColors[i] = getRandomColor();
      }
    }
  }

  public updateColorConfiguration(colorConfiguration: ColorConfiguration) {
    this.colorConfiguration = colorConfiguration;
    this.initColorScheme();

    // Regenerate colors for existing oscillators
    const numOscillators = this.config.DUFFING.NUM_OSCILLATORS;
    for (let i = 0; i < numOscillators; i++) {
      this.oscillatorColors[i] = getRandomColor();
    }
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Disable vertex attributes
    this.gl.disableVertexAttribArray(0);

    // Delete buffers
    const vertexBuffer = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING);
    const elementBuffer = this.gl.getParameter(
      this.gl.ELEMENT_ARRAY_BUFFER_BINDING
    );
    if (vertexBuffer) this.gl.deleteBuffer(vertexBuffer);
    if (elementBuffer) this.gl.deleteBuffer(elementBuffer);

    // Clean up bloom cache
    clearBloomCache();

    // Clean up WebGL resources
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  private getWebGLContext(canvas: HTMLCanvasElement): WebGLContext {
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    const gl2Context = canvas.getContext("webgl2", params);
    const isWebGL2 = !!gl2Context;
    let gl: WebGL2RenderingContext | WebGLRenderingContext;

    if (isWebGL2 && gl2Context) {
      gl = gl2Context;
    } else {
      const gl1Context =
        canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params);
      if (!gl1Context) {
        throw new Error("WebGL not supported");
      }
      gl = gl1Context as WebGLRenderingContext;
    }

    let halfFloat: OES_texture_half_float | null = null;
    let supportLinearFiltering = false;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      if (!supportLinearFiltering) {
        supportLinearFiltering = !!gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      if (!halfFloat) {
        throw new Error("OES_texture_half_float not supported");
      }
      supportLinearFiltering = !!gl.getExtension(
        "OES_texture_half_float_linear"
      );
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // WebGL2 constants
    const HALF_FLOAT = 0x140b;
    const RGBA16F = 0x881a;
    const RG16F = 0x822f;
    const RG = 0x8227;
    const R16F = 0x822d;
    const RED = 0x1903;

    const halfFloatTexType = isWebGL2 ? HALF_FLOAT : halfFloat!.HALF_FLOAT_OES;
    let formatRGBA = this.getSupportedFormat(
      gl,
      isWebGL2 ? RGBA16F : gl.RGBA,
      gl.RGBA,
      halfFloatTexType
    );
    let formatRG = this.getSupportedFormat(
      gl,
      isWebGL2 ? RG16F : gl.RGBA,
      isWebGL2 ? RG : gl.RGBA,
      halfFloatTexType
    );
    let formatR = this.getSupportedFormat(
      gl,
      isWebGL2 ? R16F : gl.RGBA,
      isWebGL2 ? RED : gl.RGBA,
      halfFloatTexType
    );

    if (!formatRGBA || !formatRG || !formatR) {
      throw new Error("Required texture formats not supported");
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }

  private getSupportedFormat(
    gl: WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ): { internalFormat: number; format: number } | null {
    if (!this.supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case 0x822d: // R16F
          return this.getSupportedFormat(gl, 0x822f, 0x8227, type); // RG16F, RG
        case 0x822f: // RG16F
          return this.getSupportedFormat(gl, 0x881a, gl.RGBA, type); // RGBA16F, RGBA
        default:
          return null;
      }
    }

    return {
      internalFormat,
      format,
    };
  }

  private supportRenderTextureFormat(
    gl: WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ): boolean {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      4,
      4,
      0,
      format,
      type,
      null
    );

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture!,
      0
    );

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  private compileShader(
    type: number,
    source: string,
    keywords?: string[]
  ): WebGLShader {
    source = this.addKeywords(source, keywords);

    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create WebGL shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
      console.trace(this.gl.getShaderInfoLog(shader));

    return shader;
  }

  private addKeywords(source: string, keywords?: string[]): string {
    if (!keywords) return source;
    let keywordsString = "";
    keywords.forEach((keyword) => {
      keywordsString += "#define " + keyword + "\n";
    });
    return keywordsString + source;
  }

  private blit = (target: BaseFBO | null, clear = false) => {
    if (target == null) {
      this.gl.viewport(
        0,
        0,
        this.gl.drawingBufferWidth,
        this.gl.drawingBufferHeight
      );
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    } else {
      this.gl.viewport(0, 0, target.width, target.height);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.fbo);
    }
    if (clear) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    // Ensure vertex attributes are enabled
    this.gl.enableVertexAttribArray(0);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
  };

  private createDitheringTexture() {
    const size = 64; // Size of the dithering texture
    const data = new Uint8Array(size * size * 3);

    // Generate blue noise pattern
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 3;
        // Generate pseudo-random value using golden ratio
        const value = Math.floor(
          ((x * 0.6180339887498949 + y * 0.7548776662466927) % 1) * 255
        );
        data[i] = value; // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
      }
    }

    let texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT
    );

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGB,
      size,
      size,
      0,
      this.gl.RGB,
      this.gl.UNSIGNED_BYTE,
      data
    );

    return {
      texture,
      width: size,
      height: size,
      attach: (id: number) => {
        this.gl.activeTexture(this.gl.TEXTURE0 + id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  private getResolution(resolution: number) {
    let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

    let min = Math.round(resolution);
    let max = Math.round(resolution * aspectRatio);

    if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight)
      return { width: max, height: min };
    else return { width: min, height: max };
  }

  private getTextureScale(
    texture: { width: number; height: number },
    width: number,
    height: number
  ) {
    return {
      x: width / texture.width,
      y: height / texture.height,
    };
  }

  private scaleByPixelRatio(input: number) {
    let pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  private updateKeywords() {
    // Use static array instead of dynamic push operations
    const displayKeywords = ["SHADING", "BLOOM", "SUNRAYS"];
    this.displayMaterial.setKeywords(displayKeywords);
  }

  private initFramebuffers() {
    let simRes = this.getResolution(this.config.SIM_RESOLUTION);
    let dyeRes = this.getResolution(this.config.DYE_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;

    if (!rgba || !rg || !r) {
      throw new Error("Required texture formats not supported");
    }

    const filtering = this.ext.supportLinearFiltering
      ? this.gl.LINEAR
      : this.gl.NEAREST;

    this.gl.disable(this.gl.BLEND);

    if (!this.dye)
      this.dye = this.createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      );
    else
      this.dye = this.resizeDoubleFBO(
        this.dye,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      );

    if (!this.velocity) {
      this.velocity = {
        ...this.createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        ),
        texelSize: { x: 1.0 / simRes.width, y: 1.0 / simRes.height },
      } as VelocityFBO;
    } else {
      this.velocity = {
        ...this.resizeDoubleFBO(
          this.velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        ),
        texelSize: { x: 1.0 / simRes.width, y: 1.0 / simRes.height },
      } as VelocityFBO;
    }

    this.divergence = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );
    this.curl = this.createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );
    this.pressure = this.createDoubleFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );

    this.bloom = this.createFBO(
      simRes.width,
      simRes.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    );
    this.bloomFramebuffers = initBloomFramebuffers(
      this.gl,
      {
        iterations: this.config.BLOOM_ITERATIONS,
        resolution: this.config.BLOOM_RESOLUTION,
        intensity: this.config.BLOOM_INTENSITY,
        threshold: this.config.BLOOM_THRESHOLD,
        softKnee: this.config.BLOOM_SOFT_KNEE,
      },
      (w, h, internalFormat, format, type, param) =>
        this.createFBO(w, h, internalFormat, format, type, param),
      (resolution) => this.getResolution(resolution),
      {
        halfFloatTexType: texType,
        formatRGBA: rgba,
        supportLinearFiltering: this.ext.supportLinearFiltering,
      }
    );

    const { sunrays: newSunrays, temp: newSunraysTemp } =
      initSunraysFramebuffers(
        this.gl,
        {
          resolution: this.config.SUNRAYS_RESOLUTION,
          weight: this.config.SUNRAYS_WEIGHT,
        },
        (w, h, internalFormat, format, type, param) =>
          this.createFBO(w, h, internalFormat, format, type, param),
        (resolution) => this.getResolution(resolution),
        {
          halfFloatTexType: texType,
          formatR: r,
          supportLinearFiltering: this.ext.supportLinearFiltering,
        }
      );

    this.sunrays = newSunrays;
    this.sunraysTemp = newSunraysTemp;
  }

  private createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ): BaseFBO {
    this.gl.activeTexture(this.gl.TEXTURE0);
    const texture = this.gl.createTexture();
    if (!texture) throw new Error("Failed to create texture");

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      param
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      param
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null
    );

    const fbo = this.gl.createFramebuffer();
    if (!fbo) throw new Error("Failed to create framebuffer");

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    );
    this.gl.viewport(0, 0, w, h);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / w;
    const texelSizeY = 1.0 / h;

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach: (id: number): number => {
        this.gl.activeTexture(this.gl.TEXTURE0 + id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  private createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ): DoubleFBO {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, param);

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      read: fbo1,
      write: fbo2,
      texture: fbo1.texture,
      fbo: fbo1.fbo,
      attach: (id: number) => fbo1.attach(id),
      swap() {
        let temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
        this.read = fbo1;
        this.write = fbo2;
        this.texture = fbo1.texture;
        this.fbo = fbo1.fbo;
      },
    };
  }

  private resizeFBO(
    target: BaseFBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ): BaseFBO {
    let newFBO = this.createFBO(w, h, internalFormat, format, type, param);
    this.copyProgram.bind();
    this.gl.uniform1i(this.copyProgram.uniforms.uTexture, target.attach(0));
    this.blit(newFBO);
    return newFBO;
  }

  private resizeDoubleFBO(
    target: DoubleFBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ): DoubleFBO {
    if (target.width == w && target.height == h) return target;
    target.read = this.resizeFBO(
      target.read,
      w,
      h,
      internalFormat,
      format,
      type,
      param
    );
    target.write = this.createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
  }

  public updateSkew(skewType?: "full" | "bottom", skewDegree: number = 6) {
    this.skewType = skewType;
    this.skewDegree = skewDegree;

    // Use the extracted boundary calculation method
    this.calculateBoundaries();

    // Update vertex buffer with new boundaries
    const vertices = new Float32Array([
      ...this.boundaries.botLeft,
      ...this.boundaries.botRight,
      ...this.boundaries.topLeft,
      ...this.boundaries.topRight,
    ]);

    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

    // Update boundaries in oscillators
    this.oscillators.forEach((oscillator) => {
      oscillator.setBoundaries(this.boundaries);
    });
  }
}

class Program<T extends ShaderUniforms = ShaderUniforms> {
  public readonly uniforms: T;
  private readonly program: WebGLProgram;
  private readonly gl: WebGLRenderingContext;

  constructor(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    this.gl = gl;
    this.program = this.createProgram(vertexShader, fragmentShader);
    this.uniforms = this.getUniforms(this.program) as T;
  }

  bind() {
    this.gl.useProgram(this.program);
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create WebGL program");
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
      console.trace(this.gl.getProgramInfoLog(program));

    return program;
  }

  private getUniforms(
    program: WebGLProgram
  ): Record<string, WebGLUniformLocation> {
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformCount = this.gl.getProgramParameter(
      program,
      this.gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = this.gl.getActiveUniform(program, i)?.name;
      if (uniformName) {
        const location = this.gl.getUniformLocation(program, uniformName);
        if (location) {
          uniforms[uniformName] = location;
        }
      }
    }
    return uniforms;
  }
}

class Material {
  private readonly vertexShader: WebGLShader;
  private readonly fragmentShader: WebGLShader;
  private readonly programs: { [key: number]: WebGLProgram };
  private activeProgram: WebGLProgram | null;
  private readonly gl: WebGLRenderingContext;
  public uniforms: ShaderUniforms;

  constructor(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.programs = {};
    this.activeProgram = null;
    this.uniforms = {};

    const program = this.createProgram(this.vertexShader, this.fragmentShader);
    this.programs[0] = program;
    this.activeProgram = program;
    this.uniforms = this.getUniforms(program);
  }

  setKeywords(keywords: string[]) {
    let hash = 0;
    for (let i = 0; i < keywords.length; i++)
      hash += this.hashCode(keywords[i]);

    let program = this.programs[hash];
    if (program == null) {
      program = this.createProgram(this.vertexShader, this.fragmentShader);
      this.programs[hash] = program;
    }

    if (program == this.activeProgram) return;

    this.uniforms = this.getUniforms(program);
    this.activeProgram = program;
  }

  bind() {
    if (this.activeProgram) {
      this.gl.useProgram(this.activeProgram);
    }
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create WebGL program");
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
      console.trace(this.gl.getProgramInfoLog(program));

    return program;
  }

  private getUniforms(
    program: WebGLProgram
  ): Record<string, WebGLUniformLocation> {
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformCount = this.gl.getProgramParameter(
      program,
      this.gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = this.gl.getActiveUniform(program, i)?.name;
      if (uniformName) {
        const location = this.gl.getUniformLocation(program, uniformName);
        if (location) {
          uniforms[uniformName] = location;
        }
      }
    }
    return uniforms;
  }

  private hashCode(s: string): number {
    if (s.length == 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
