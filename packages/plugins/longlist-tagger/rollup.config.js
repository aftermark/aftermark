import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: pkg.main,
        format: "cjs"
      }
    ],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**", // only transpile our source code
        rootMode: "upward"
      })
    ]
  }
];
