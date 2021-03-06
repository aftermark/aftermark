const path = require("path");
import { getOutputFile } from "./getOutputFile";

export function logConfirmation(config, files) {
  const elapsedTime = ((Date.now() - config.startTime) / 1000).toFixed(2);

  let msg = `===\n${config.commandNameAndVer} completed in ${elapsedTime}s.\n`;

  msg += `\n🧩 Plugins (in run-order):\n`;
  Object.keys(config.plugins).forEach(pluginName => {
    msg += `   - ${pluginName}\n`;
  });

  msg += `\n📄 Processed files (${files.length}):\n`;
  files.forEach(file => {
    msg += `   - ${path.relative(config.configFilePath, file)}`;
    const outputFile = getOutputFile(
      file,
      config.configFilePath,
      config.output
    );
    if (config.output && file !== outputFile) {
      // not saved in place
      msg += ` → ${path.relative(config.configFilePath, outputFile)}`;
    } else {
      msg += " (saved in place)";
    }
    msg += "\n";
  });

  console.log(msg);
}
