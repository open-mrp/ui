import { gradientTextureCache } from './GradientTextureCache';
import { DEFAULT_BACKGROUND_COLOR, RGBColor } from './types';

const N_TIME_VALUES = 2;

function timeKey(index: number) {
    let key = 'u_time';
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

/** Internal canvas pixels; keeps WebGL allocation within typical GPU limits at 2x DPR. */
const MAX_CANVAS_DIMENSION = 4096;

function acquireWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    const options = { premultipliedAlpha: false };
    return (
        (canvas.getContext('webgl', options) as WebGLRenderingContext | null) ??
        (canvas.getContext('experimental-webgl', options) as WebGLRenderingContext | null)
    );
}

export class WaveShaderRenderer {
    private timeStates: TimeState[];

    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private program!: WebGLProgram;
    private positionBuffer: WebGLBuffer | null = null;
    private gradientTexture: WebGLTexture | null = null;

    private a_position = -1;

    private uniformLocations = new Map<string, WebGLUniformLocation | null>();
    private disposed = false;
    private contextLost = false;

    // Retained construction parameters so GL resources can be rebuilt after a
    // context-restored event (e.g. macOS split-screen / GPU switch loses the context).
    private vertexShader: string;
    private fragmentShader: string;
    private colorConfig: ColorConfiguration;
    private numWaves: number;
    private pixelRatio: number;
    private backgroundColor: RGBColor;

    // Last applied dimensions, replayed on context restore.
    private lastWidth = 0;
    private lastHeight = 0;
    private lastScale = 1;

    private handleContextLost = (event: Event) => {
        // preventDefault() is required for the browser to later fire
        // webglcontextrestored; without it the context is gone for good.
        event.preventDefault();
        this.contextLost = true;
    };

    private handleContextRestored = () => {
        if (this.disposed) return;
        this.contextLost = false;
        // The previous GL objects (program, buffers, textures) are invalid. Drop
        // any cached gradient textures bound to this context and rebuild from scratch.
        gradientTextureCache.clearContext(this.gl);
        this.initGLResources();
        if (this.lastWidth > 0 && this.lastHeight > 0) {
            this.setDimensions(this.lastWidth, this.lastHeight, this.lastScale);
        }
    };

    constructor(
        canvas: HTMLCanvasElement,
        vertexShader: string,
        fragmentShader: string,
        colorConfig: ColorConfiguration,
        seed: number | undefined,
        numWaves: number,
        pixelRatio: number = 1.0,
        backgroundColor: RGBColor = DEFAULT_BACKGROUND_COLOR,
    ) {
        const gl = acquireWebGLContext(canvas);
        if (!gl) {
            throw new Error('Failed to acquire WaveShader context');
        }
        this.canvas = canvas;
        this.gl = gl;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.colorConfig = colorConfig;
        this.numWaves = numWaves;
        this.pixelRatio = pixelRatio;
        this.backgroundColor = backgroundColor;

        canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);

        seed ??= Math.random() * 100_000;
        this.timeStates = Array.from({ length: N_TIME_VALUES }).map(() => ({
            seed,
            lastTime: Date.now(),
            elapsed: 0,
            timeSpeed: 1,
        }));

        this.initGLResources();
    }

    /** (Re)creates all GL objects and sets initial uniforms. Safe to call after a context restore. */
    private initGLResources() {
        const { gl } = this;
        this.uniformLocations.clear();
        this.program = WaveShaderRenderer.createProgram(
            gl,
            this.vertexShader,
            this.fragmentShader,
        );
        this.positionBuffer = gl.createBuffer();
        // Use cached gradient texture instead of creating new one
        this.gradientTexture = gradientTextureCache.getOrCreateTexture(
            gl,
            this.colorConfig.gradient,
        );
        this.a_position = gl.getAttribLocation(this.program, 'a_position');

        gl.vertexAttribPointer(this.a_position, /* vec2 */ 2, gl.FLOAT, false, 0, 0);
        gl.useProgram(this.program);

        // Set initial uniform values
        gl.uniform1i(this.getUniformLocation('u_num_waves'), this.numWaves);
        gl.uniform1f(this.getUniformLocation('u_pixel_ratio'), this.pixelRatio);

        // Set background color (convert from 0-255 to 0-1 range)
        gl.uniform3f(
            this.getUniformLocation('u_background_color'),
            this.backgroundColor[0] / 255,
            this.backgroundColor[1] / 255,
            this.backgroundColor[2] / 255,
        );
    }

    public setColorConfig(colorConfig: ColorConfiguration) {
        const { gl } = this;
        this.colorConfig = colorConfig;
        if (this.contextLost) return;
        // Use cached gradient texture
        this.gradientTexture = gradientTextureCache.getOrCreateTexture(gl, colorConfig.gradient);
    }

    public setBackgroundColor(color: RGBColor) {
        const { gl } = this;
        this.backgroundColor = color;
        if (this.contextLost) return;
        gl.uniform3f(
            this.getUniformLocation('u_background_color'),
            color[0] / 255,
            color[1] / 255,
            color[2] / 255,
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

    public isDisposed(): boolean {
        return this.disposed;
    }

    public render() {
        if (this.disposed || this.contextLost) return;

        const { gl } = this;
        if (gl.isContextLost()) return;
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
        gl.uniform1f(this.getUniformLocation('u_w'), gl.canvas.width);
        gl.uniform1f(this.getUniformLocation('u_h'), gl.canvas.height);

        // Pass gradient texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.gradientTexture);
        gl.uniform1i(this.getUniformLocation('u_gradient'), 0);

        // Clear canvas
        this.clear();

        // Draw 2 triangles forming quad
        gl.vertexAttribPointer(this.a_position, /* vec2 */ 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.a_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, this.positions().length / 2);
    }

    /**
     * Renders a frame and returns it as an image data URL. Used to pre-generate the
     * static still that's shown as a fallback when WebGL is unavailable. Reads pixels
     * synchronously right after drawing (so it works without preserveDrawingBuffer)
     * and flips vertically because WebGL's origin is bottom-left.
     */
    public captureFrame(type: string = 'image/webp', quality: number = 0.92): string {
        const { gl } = this;
        if (this.disposed || this.contextLost || gl.isContextLost()) return '';

        this.render();

        const width = gl.canvas.width;
        const height = gl.canvas.height;
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        const out = document.createElement('canvas');
        out.width = width;
        out.height = height;
        const ctx = out.getContext('2d');
        if (!ctx) return '';

        const imageData = ctx.createImageData(width, height);
        const rowBytes = width * 4;
        for (let y = 0; y < height; y++) {
            const srcStart = (height - 1 - y) * rowBytes;
            imageData.data.set(pixels.subarray(srcStart, srcStart + rowBytes), y * rowBytes);
        }
        // Force fully opaque — the still is a solid background, not a transparency layer.
        for (let i = 3; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        return out.toDataURL(type, quality);
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
        if (this.contextLost) return;
        this.gl.uniform1f(this.getUniformLocation(key), value);
    }

    public setTimeSpeed(index: number, value: number) {
        this.timeStates[index].timeSpeed = value;
    }

    public setDimensions(width: number, height: number, scale: number = 1.0) {
        const { gl } = this;

        // Remember the request so it can be replayed after a context restore.
        this.lastWidth = width;
        this.lastHeight = height;
        this.lastScale = scale;

        if (this.contextLost || gl.isContextLost()) return;

        const canvas = gl.canvas;
        // Apply scale for resolution reduction, clamping to stay within WebGL limits
        const maxCssDimension = MAX_CANVAS_DIMENSION / scale;
        const clampedWidth = Math.max(1, Math.min(width, maxCssDimension));
        const clampedHeight = Math.max(1, Math.min(height, maxCssDimension));
        canvas.width = Math.round(clampedWidth * scale);
        canvas.height = Math.round(clampedHeight * scale);

        // Set CSS size to maintain visual size
        if (canvas instanceof HTMLCanvasElement) {
            canvas.style.width = `${clampedWidth}px`;
            canvas.style.height = `${clampedHeight}px`;
        }

        // Place positions into buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions()), gl.STATIC_DRAW);
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
        type: WebGLRenderingContext['VERTEX_SHADER'] | WebGLRenderingContext['FRAGMENT_SHADER'],
        source: string,
    ): WebGLShader {
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Failed to create shader');
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
        fragmentShader: string,
    ) {
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to create program');
        }
        gl.attachShader(program, this.createShader(gl, gl.VERTEX_SHADER, vertexShader));
        gl.attachShader(program, this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        gl.deleteProgram(program);
        throw new Error('Failed to create shader');
    }

    public dispose() {
        if (this.disposed) return;
        this.disposed = true;

        const { gl } = this;

        this.canvas.removeEventListener('webglcontextlost', this.handleContextLost, false);
        this.canvas.removeEventListener(
            'webglcontextrestored',
            this.handleContextRestored,
            false,
        );

        // Delete buffer
        if (this.positionBuffer) {
            gl.deleteBuffer(this.positionBuffer);
            this.positionBuffer = null;
        }

        // Delete texture - note: this is cached, so we need to notify the cache
        // For now, just clear our reference - the cache will handle recreation if needed
        if (this.gradientTexture) {
            gradientTextureCache.deleteTexture(gl, this.gradientTexture);
            this.gradientTexture = null;
        }

        // Delete program
        if (this.program) {
            gl.deleteProgram(this.program);
        }

        // Clear uniform locations
        this.uniformLocations.clear();

        // Explicitly release the WebGL context. Deleting individual resources does
        // NOT free the context itself — only GC or WEBGL_lose_context does. Without
        // this, every remount (React StrictMode/HMR in dev, navigation, the resize
        // churn from entering macOS split-screen) leaks a context until the browser's
        // hard cap (~16) is hit, after which getContext('webgl') returns null and the
        // shader renders black.
        if (!gl.isContextLost()) {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    }
}
