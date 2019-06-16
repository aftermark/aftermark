#!/usr/bin/env node
'use strict';

var chalk = require("chalk");

function logError(msg) {
  var log = console.error;
  log(chalk.yellowBright(msg));
  log();
}

function applyPlugins(plugins, dom) {
  Object.keys(plugins).forEach(function (pluginName) {
    try {
      var plugin = require("".concat(process.cwd(), "/node_modules/").concat(pluginName));

      var pluginOptions = plugins[pluginName];
      dom = plugin(dom, pluginOptions);
    } catch (e) {
      logError("".concat(pluginName, " -- ") + e);
    }
  });
  return dom;
}

var path = require("path");

function getOutputFile(file, outputDir) {
  var fileName = path.parse(file).base;
  return outputDir ? getOutputFilePath(fileName) : file;

  function getOutputFilePath(fileName) {
    return outputDir.endsWith("/") ? outputDir + fileName : outputDir + "/" + fileName;
  }
}

var fs = require("fs");
function exportFile(file, outputDir, updatedDom) {
  var outputFile = getOutputFile(file, outputDir);
  fs.writeFile(outputFile, updatedDom.serialize(), function (error) {
    if (error) {
      throw error;
    }
  });
}

var pkg = require("../package.json");

var cosmiconfig = require("cosmiconfig");

function getConfig() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var startTime = new Date();
  var commandName = Object.keys(pkg.bin)[0];
  var commandNameAndVer = "".concat(commandName, " ").concat(pkg.version);
  options.debug && (commandNameAndVer += " [build ".concat(startTime.toLocaleTimeString(), "]"));
  var explorer = cosmiconfig(commandName);
  var result = explorer.searchSync();

  if (result) {
    result.config.commandName = commandName;
    result.config.commandNameAndVer = commandNameAndVer;
    result.config.startTime = startTime;
    return result.config;
  } else {
    throw new Error("".concat(commandNameAndVer, " couldn't find a config file."));
  }
}

function logConfirmation(config, files) {
  var elapsedTime = ((Date.now() - config.startTime) / 1000).toFixed(2);
  var msg = "===\n".concat(config.commandNameAndVer, " completed in ").concat(elapsedTime, "s.\n");
  msg += "\n\uD83E\uDDE9 Plugins (in run-order):\n";
  Object.keys(config.plugins).forEach(function (pluginName) {
    msg += "   \u2022 ".concat(pluginName, "\n");
  });
  msg += "\n\uD83D\uDCC4 Processed files (".concat(files.length, "):\n");
  files.forEach(function (file) {
    msg += "   \u2022 ".concat(file);
    var outputFile = getOutputFile(file, config.output);

    if (config.output && file !== outputFile) {
      msg += " \u2192 ".concat(outputFile);
    } else {
      msg += " (saved in place)";
    }

    msg += "\n";
  });
  console.log(msg);
}

var glob = require("glob");

var JSDOM = require("jsdom").JSDOM;

(function () {
  try {
    var config = getConfig({
      debug: true
    }); // get array of filenames to process

    var files = glob.sync(config.input);
    var promisedDomsSerialized = files.map(function (file) {
      return JSDOM.fromFile(file).then(function (dom) {
        var updatedDom = applyPlugins(config.plugins, dom);
        exportFile(file, config.output, updatedDom);
        return updatedDom.serialize();
      });
    });
    Promise.all(promisedDomsSerialized).then(function (result) {
      logConfirmation(config, files);
      return result;
    });
  } catch (e) {
    logError(e);
  }
})();
