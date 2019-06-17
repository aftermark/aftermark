const path = require("path");

export function getOutputFile(file, configFilePath, outputDir = "") {
  const fileName = path.basename(file);
  return outputDir ? path.join(configFilePath, outputDir, fileName) : file;
}
