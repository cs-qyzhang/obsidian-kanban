import dotenv from "dotenv";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import { env } from "process";

dotenv.config();

const isProd = process.env.BUILD === "production";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

const output = [];

// const output = [
//   {
//     input: "./src/main.ts",
//     output: {
//       dir: ".",
//       format: "cjs",
//       exports: "default",
//       sourcemap: "inline",
//       sourcemapExcludeSources: isProd,
//       banner,
//     },
//     external: ["obsidian"],
//     plugins: [
      // json(),
      //       css({ output: "styles.css" }),
//       typescript(),
//       nodeResolve({ browser: true }),
//       babel({
//         babelHelpers: 'bundled',
//         presets: ["@babel/preset-react", "@babel/preset-typescript"],
//       }),
//       commonjs(),
//     ],
//   },
// ];

if (process.env.PLUGIN_DEST) {
  output.push({
    input: "./src/main.ts",
    output: {
      dir: process.env.PLUGIN_DEST,
      sourcemap: "inline",
      sourcemapExcludeSources: isProd,
      format: "cjs",
      exports: "default",
      banner,
    },
    external: ["obsidian"],
    plugins: [
      css({ output: "styles.css" }),
      typescript(),
      nodeResolve({ browser: true }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      }),
      babel({
        babelHelpers: 'bundled',
        plugins: ["@babel/plugin-proposal-class-properties"],
        presets: ["@babel/preset-react", "@babel/preset-typescript"],
      }),
      commonjs(),
      copy({
        targets: [
          { src: "./manifest.json", dest: process.env.PLUGIN_DEST },
          // { src: "./styles.css", dest: process.env.PLUGIN_DEST },
        ],
      }),
    ],
  });
}

export default output;
