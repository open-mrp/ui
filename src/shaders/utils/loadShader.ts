export async function loadShader(projectName: string, name: string): Promise<string> {
    try {
        const shader = await import(`./${projectName}/shaders/${name}.glsl`);
        return shader.default;
    } catch (error) {
        console.error(`Failed to load shader ${name} from ${projectName}:`, error);
        throw error;
    }
}
