const pkg = require("../package.json");
const chalk = require("chalk");
const cosmiconfig = require("cosmiconfig");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const startTime = Date.now();
const commandName = Object.keys(pkg.bin)[0];
const commandNameAndVer = commandName + " " + pkg.version;

// Find config file
const explorer = cosmiconfig(commandName);
const result = explorer.searchSync();

if (!result) {
  logError(`${commandNameAndVer} couldn't find a config file.`);
} else {
  const config = result.config;

  // process source files
  glob(config.input, function(er, files) {
    files.forEach(file => {
      JSDOM.fromFile(file, {}).then(dom => {
        const updatedDom = applyPlugins(config.plugins, dom);
        exportFile(file, config.output, updatedDom);
      });
    });

    logConfirmation(config, files);
  });
}

function applyPlugins(plugins, dom) {
  Object.keys(plugins).forEach(pluginName => {
    try {
      const plugin = require(`${process.cwd()}/node_modules/${pluginName}`);
      const pluginOptions = plugins[pluginName];
      dom = plugin(dom, pluginOptions);
    } catch (e) {
      logError(`${pluginName} -- ` + e);
    }
  });
  return dom;
}

function exportFile(file, outputDir, updatedDom) {
  const outputFile = getOutputFile(file, outputDir);

  fs.writeFile(outputFile, updatedDom.serialize(), function(error) {
    if (error) {
      throw error;
    }
  });
}

function getOutputFile(file, outputDir) {
  const fileName = path.parse(file).base;
  return outputDir ? getOutputFilePath(fileName) : file;

  function getOutputFilePath(fileName) {
    return outputDir.endsWith("/")
      ? outputDir + fileName
      : outputDir + "/" + fileName;
  }
}

function logError(msg) {
  const log = console.error;
  log(chalk.yellowBright(msg));
  log();
}

function logConfirmation(config, files) {
  const elapsedTime = Date.now() - startTime;

  let msg = `===\n${commandNameAndVer} completed in ${elapsedTime}ms.\n`;

  msg += `\n🧩 Plugins (in run-order):\n`;
  Object.keys(config.plugins).forEach(pluginName => {
    msg += `   • ${pluginName}\n`;
  });

  msg += `\n📄 Processed files (${files.length}):\n`;
  files.forEach(file => {
    msg += `   • ${file}`;
    const outputFile = getOutputFile(file, config.output);
    if (config.output && file !== outputFile) {
      msg += ` → ${outputFile}`;
    } else {
      msg += " (saved in place)";
    }
    msg += "\n";
  });

  console.log(msg);
}
