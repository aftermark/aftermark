#!/usr/bin/env node
'use strict';

var pkg = require("../package.json");

var chalk = require("chalk");

var cosmiconfig = require("cosmiconfig");

var fs = require("fs");

var path = require("path");

var glob = require("glob");

var jsdom = require("jsdom");

var JSDOM = jsdom.JSDOM;
var startTime = Date.now();
var commandName = Object.keys(pkg.bin)[0];
var commandNameAndVer = commandName + " " + pkg.version; // Find config file

var explorer = cosmiconfig(commandName);
var result = explorer.searchSync();

if (!result) {
  logError("".concat(commandNameAndVer, " couldn't find a config file."));
} else {
  var config = result.config; // process source files

  glob(config.input, function (er, files) {
    files.forEach(function (file) {
      JSDOM.fromFile(file, {}).then(function (dom) {
        var updatedDom = applyPlugins(config.plugins, dom);
        exportFile(file, config.output, updatedDom);
      });
    });
    logConfirmation(config, files);
  });
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

function exportFile(file, outputDir, updatedDom) {
  var outputFile = getOutputFile(file, outputDir);
  fs.writeFile(outputFile, updatedDom.serialize(), function (error) {
    if (error) {
      throw error;
    }
  });
}

function getOutputFile(file, outputDir) {
  var fileName = path.parse(file).base;
  return outputDir ? getOutputFilePath(fileName) : file;

  function getOutputFilePath(fileName) {
    return outputDir.endsWith("/") ? outputDir + fileName : outputDir + "/" + fileName;
  }
}

function logError(msg) {
  var log = console.error;
  log(chalk.yellowBright(msg));
  log();
}

function logConfirmation(config, files) {
  var elapsedTime = Date.now() - startTime;
  var msg = "===\n".concat(commandNameAndVer, " completed in ").concat(elapsedTime, "ms.\n");
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
