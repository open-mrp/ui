import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { string } from "rollup-plugin-string";

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
    },
  ],
  external: ["react", "react-dom"],
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
      plugins: [tailwindcssPostcss, autoprefixer],
    }),
  ],
};

const cjsConfig = {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: true,
    preserveModules: true,
  },
  external: ["react", "react-dom", "@xyflow/react", /\.(css|less|scss)$/],
  plugins: [
    preserveDirectives({ include: ["**/*.tsx", "**/*.ts"] }),
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      mainFields: ["module", "main"],
      preserveSymlinks: true,
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/cjs",
      exclude: [
        "**/*.stories.tsx",
        "**/*.stories.ts",
        "**/*.test.tsx",
        "**/*.test.ts",
        "**/*.spec.tsx",
        "**/*.spec.ts",
      ],
    }),
    postcss(),
    string({
      include: "**/*.glsl",
    }),
  ],
};

const esmConfig = {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
    },
  ],
  external: ["react", "react-dom", "@xyflow/react", /\.(css|less|scss)$/],
  plugins: [
    preserveDirectives({ include: ["**/*.tsx", "**/*.ts"] }),
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      mainFields: ["module", "main"],
      preserveSymlinks: true,
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist/esm",
      exclude: [
        "**/*.stories.tsx",
        "**/*.stories.ts",
        "**/*.test.tsx",
        "**/*.test.ts",
        "**/*.spec.tsx",
        "**/*.spec.ts",
      ],
    }),
    postcss(),
    string({
      include: "**/*.glsl",
    }),
  ],
};

export default [stylesConfig, cjsConfig, esmConfig];
