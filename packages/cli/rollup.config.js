import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        banner: "#!/usr/bin/env node" // for using as a CLI
      }
    ],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
    // }
    // {
    //   input: "src/reduceClassMap.js",
    //   output: [
    //     {
    //       file: "lib/funkdafyClasses.js",
    //       format: "cjs"
    //     }
    //   ],
    //   plugins: [
    //     resolve(),
    //     babel({
    //       exclude: "node_modules/**" // only transpile our source code
    //     })
    //   ]
  }
];
