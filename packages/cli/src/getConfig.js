const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");
const cosmiconfig = require("cosmiconfig");

export function getConfig() {
  const startTime = new Date();
  const commandName = Object.keys(pkg.bin)[0];
  let commandNameAndVer = `${commandName} ${pkg.version}`;

  const explorer = cosmiconfig(commandName);
  const result = explorer.searchSync();

  if (result) {
    result.config.configFilePath = path.dirname(result.filepath);
    result.config.commandName = commandName;
    result.config.commandNameAndVer = updateCmdNameAndVer(commandNameAndVer);
    result.config.startTime = startTime;

    return result.config;
  } else {
    throw new Error(`${commandNameAndVer} couldn't find a config file.`);
  }

  function updateCmdNameAndVer(name) {
    // if debugging, add this script's modified time to the name
    // so it appears in logging.
    if (result.config.debugMode) {
      const buildTime = fs.statSync(__filename);
      const buildTimeStr = new Date(buildTime.mtime).toLocaleString();
      return (name += ` [build ${buildTimeStr}]`);
    } else {
      return name;
    }
  }
}
