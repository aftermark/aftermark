const fs = require("fs");
const yaml = require("js-yaml");

import applyClasses from "./applyClasses";

module.exports = function(dom, options) {
  if (!options.classMapFile) {
    throw new Error(
      "Missing required option `classMapFile` with a path to a valid JSON or YAML class map."
    );
  } else {
    const classMapFilePath = process.cwd() + "/" + options.classMapFile;

    try {
      const classMap = yaml.safeLoad(fs.readFileSync(classMapFilePath, "utf8")); // loads either YAML or JSON
      return applyClasses(dom, classMap);
    } catch (e) {
      throw new Error(e);
    }
  }
};
