import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";

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

export default [stylesConfig];
