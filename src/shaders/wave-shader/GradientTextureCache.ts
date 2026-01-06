interface ColorConfiguration {
    gradient: string[];
}

// Context-aware texture cache that tracks which textures belong to which GL context
class GradientTextureCacheManager {
    // Map of GL context -> (gradient key -> texture)
    private contextCache = new WeakMap<WebGLRenderingContext, Map<string, WebGLTexture>>();
    // Canvas cache is context-independent (can be reused across contexts)
    private canvasCache = new Map<string, HTMLCanvasElement>();

    private getCacheKey(gradient: string[]): string {
        return gradient.join('|');
    }

    private getContextMap(gl: WebGLRenderingContext): Map<string, WebGLTexture> {
        let contextMap = this.contextCache.get(gl);
        if (!contextMap) {
            contextMap = new Map();
            this.contextCache.set(gl, contextMap);
        }
        return contextMap;
    }

    public getOrCreateTexture(
        gl: WebGLRenderingContext,
        gradient: string[],
        width: number = 1000,
        height: number = 2,
    ): WebGLTexture {
        const key = this.getCacheKey(gradient);
        const contextMap = this.getContextMap(gl);

        // Check if texture already exists for this context
        let texture = contextMap.get(key);
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
            throw new Error('Failed to create gradient texture');
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        contextMap.set(key, texture);
        return texture;
    }

    public deleteTexture(gl: WebGLRenderingContext, texture: WebGLTexture) {
        const contextMap = this.contextCache.get(gl);
        if (contextMap) {
            // Find and remove the texture from the cache
            for (const [key, cachedTexture] of contextMap.entries()) {
                if (cachedTexture === texture) {
                    contextMap.delete(key);
                    break;
                }
            }
        }
        // Delete the actual WebGL texture
        gl.deleteTexture(texture);
    }

    private createGradientCanvas(
        gradient: string[],
        width: number,
        height: number,
    ): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas 2D context');

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

    public clearContext(gl: WebGLRenderingContext) {
        const contextMap = this.contextCache.get(gl);
        if (contextMap) {
            // Delete all textures for this context
            for (const texture of contextMap.values()) {
                gl.deleteTexture(texture);
            }
            contextMap.clear();
        }
    }

    public clear() {
        // Note: Cannot delete WebGL textures without context reference
        // The WeakMap will automatically clean up when contexts are GC'd
        this.canvasCache.clear();
    }
}

// Singleton instance
export const gradientTextureCache = new GradientTextureCacheManager();
