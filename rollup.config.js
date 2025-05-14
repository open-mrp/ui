import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import packageJson from './package.json' with { type: 'json' };

const cjsConfig = {
  input: "src/index.ts",
  output: {
    file: packageJson.main,
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main']
    }),
    commonjs(),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/cjs",
      compilerOptions: {
        sourceMap: true,
        inlineSources: true,
        noEmit: false
      }
    }),
    postcss(),
  ],
};

const esmConfig = {
  input: "src/index.ts",
  output: {
    file: packageJson.module,
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main']
    }),
    commonjs(),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/esm",
      compilerOptions: {
        sourceMap: true,
        inlineSources: true,
        noEmit: false
      }
    }),
    postcss(),
  ],
};

const dtsConfig = {
  input: "src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "esm", sourcemap: true }],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main']
    }),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/types",
      compilerOptions: {
        sourceMap: true,
        inlineSources: true,
        noEmit: false
      }
    }),
    dts()
  ],
  external: [/\.(css|less|scss)$/],
};

export default [cjsConfig, esmConfig, dtsConfig];
