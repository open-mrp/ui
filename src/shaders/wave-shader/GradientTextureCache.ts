interface ColorConfiguration {
  gradient: string[];
}

class GradientTextureCacheManager {
  private cache = new Map<string, WebGLTexture>();
  private canvasCache = new Map<string, HTMLCanvasElement>();

  private getCacheKey(gradient: string[]): string {
    return gradient.join("|");
  }

  public getOrCreateTexture(
    gl: WebGLRenderingContext,
    gradient: string[],
    width: number = 1000,
    height: number = 2
  ): WebGLTexture {
    const key = this.getCacheKey(gradient);

    // Check if texture already exists
    let texture = this.cache.get(key);
    if (texture) {
      return texture;
    }

    // Check if canvas already exists
    let canvas = this.canvasCache.get(key);
    if (!canvas) {
      canvas = this.createGradientCanvas(gradient, width, height);
      this.canvasCache.set(key, canvas);
    }

    // Create texture from canvas
    texture = gl.createTexture();
    if (!texture) {
      throw new Error("Failed to create gradient texture");
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.cache.set(key, texture);
    return texture;
  }

  private createGradientCanvas(
    gradient: string[],
    width: number,
    height: number
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");

    // Render gradient to canvas
    const linearGradient = ctx.createLinearGradient(0, 0, width, 0);
    for (const [i, stop] of gradient.entries()) {
      const t = i / (gradient.length - 1);
      linearGradient.addColorStop(t, stop);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, width, height);

    return canvas;
  }

  public clear() {
    // Delete all WebGL textures
    this.cache.forEach((texture) => {
      // Note: We can't delete textures here without the GL context
      // This should be called with proper cleanup
    });
    this.cache.clear();
    this.canvasCache.clear();
  }
}

// Singleton instance
export const gradientTextureCache = new GradientTextureCacheManager();
