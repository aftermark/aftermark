import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
const { readdirSync, statSync } = require("fs");
const path = require("path");

const rollupPlugins = [
  resolve(),
  babel({
    exclude: "node_modules/**" // only transpile our source code
  })
];

// @aftermark/cli config

const cliPath = "./packages/cli";
const cliPkg = require(`${cliPath}/package.json`);

const cliInputFile = `${cliPath}/src/main.js`;
const cliOutputFile = path.resolve(cliPath, cliPkg.main);

const cliConfig = {
  input: cliInputFile,
  output: {
    file: cliOutputFile,
    format: "cjs",
    banner: "#!/usr/bin/env node" // for using as a CLI
  },
  plugins: rollupPlugins
};

// @aftermark plugins config

const pluginRootPath = "./packages/plugins";

const plugins = readdirSync(pluginRootPath).filter(f =>
  statSync(path.join(pluginRootPath, f)).isDirectory()
); // finds all top-level directories within plugins directory

const pluginConfigs = plugins.map(plugin => {
  const pluginPath = `${pluginRootPath}/${plugin}`;
  const pkg = require(`${pluginPath}/package.json`);

  const inputFile = `${pluginPath}/src/main.js`;
  const outputFile = path.resolve(pluginPath, pkg.main);

  return {
    input: inputFile,
    output: {
      file: outputFile,
      format: "cjs"
    },
    plugins: rollupPlugins
  };
});

module.exports = [cliConfig, ...pluginConfigs];
