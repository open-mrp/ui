export interface FragmentShaderUniform {
  label?: string;
  value: number;
  range: [number, number];
  step?: number;
  format?: "number" | "percent" | "multiplier";
}

export interface FragmentShaderUniforms {
  [key: string]: {
    value: number;
  };
}

export interface FragmentShader {
  shader: string;
  uniforms: FragmentShaderUniforms;
}

export type CreateFragmentShader = (options?: Partial<Record<string, unknown>>) => Promise<FragmentShader>;
