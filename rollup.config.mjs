import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import { string } from "rollup-plugin-string";

import packageJson from './package.json' with { type: 'json' };

const cjsConfig = {
  input: "src/index.ts",
  output: {
    file: packageJson.main,
    format: "cjs",
    sourcemap: true,
  },
  external: ['react', 'react-dom', /\.(css|less|scss)$/],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main'],
      preserveSymlinks: true,
      preferBuiltins: true
    }),
    commonjs(),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/cjs",
    }),
    postcss(),
    string({
      include: '**/*.glsl'
    }),
  ],
};

const esmConfig = {
  input: "src/index.ts",
  output: {
    file: packageJson.module,
    format: "esm",
    sourcemap: true,
  },
  external: ['react', 'react-dom', /\.(css|less|scss)$/],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main'],
      preserveSymlinks: true,
      preferBuiltins: true
    }),
    commonjs(),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/esm",
    }),
    postcss(),
    string({
      include: '**/*.glsl'
    }),
  ],
};

const dtsConfig = {
  input: "src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "esm", sourcemap: true }],
  external: ['react', 'react-dom', /\.(css|less|scss)$/],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'main'],
      preserveSymlinks: true,
      preferBuiltins: true
    }),
    typescript({ 
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/types",
    }),
    dts()
  ],
};

export default [cjsConfig, esmConfig, dtsConfig];
