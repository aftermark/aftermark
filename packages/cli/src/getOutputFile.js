const path = require("path");

export function getOutputFile(file, outputDir) {
  const fileName = path.parse(file).base;
  return outputDir ? getOutputFilePath(fileName) : file;

  function getOutputFilePath(fileName) {
    return outputDir.endsWith("/")
      ? outputDir + fileName
      : outputDir + "/" + fileName;
  }
}
