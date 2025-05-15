import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import { string } from "rollup-plugin-string";
import packageJson from './package.json' with { type: 'json' };

const stylesConfig = {
  input: "src/styles/index.ts",
  output: [
    {
      file: "dist/cjs/styles.css",
      format: "cjs",
    },
    {
      file: "dist/esm/styles.css",
      format: "esm",
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
    }),
  ],
};

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
      exclude: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx", "**/*.test.ts", "**/*.spec.tsx", "**/*.spec.ts"]
    }),
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
      exclude: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx", "**/*.test.ts", "**/*.spec.tsx", "**/*.spec.ts"]
    }),
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
      exclude: ["**/*.stories.tsx", "**/*.stories.ts", "**/*.test.tsx", "**/*.test.ts", "**/*.spec.tsx", "**/*.spec.ts"]
    }),
    dts()
  ],
};

export default [stylesConfig, cjsConfig, esmConfig, dtsConfig];
