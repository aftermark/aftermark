const pkg = require("../package.json");
const cosmiconfig = require("cosmiconfig");

export function getConfig(options = {}) {
  const startTime = new Date();
  const commandName = Object.keys(pkg.bin)[0];
  let commandNameAndVer = `${commandName} ${pkg.version}`;
  options.debug &&
    (commandNameAndVer += ` [build ${startTime.toLocaleTimeString()}]`);

  const explorer = cosmiconfig(commandName);
  const result = explorer.searchSync();
  if (result) {
    result.config.commandName = commandName;
    result.config.commandNameAndVer = commandNameAndVer;
    result.config.startTime = startTime;
    return result.config;
  } else {
    throw new Error(`${commandNameAndVer} couldn't find a config file.`);
  }
}
