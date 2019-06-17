const glob = require("glob");
const JSDOM = require("jsdom").JSDOM;

import { applyPlugins } from "./applyPlugins";
import { exportFile } from "./exportFile";
import { getConfig } from "./getConfig";
import { logConfirmation } from "./logConfirmation";
import { logError } from "./logError";

(function() {
  try {
    const config = getConfig();

    // get array of filenames to process; make input path relative to
    // aftermark config file, which may not be process.cwd()
    const files = glob.sync(config.configFilePath + "/" + config.input);

    // get array of promised modified doms;
    // export as files if not in bufferMode
    const promisedDomsSerialized = files.map(file => {
      return JSDOM.fromFile(file).then(dom => {
        const updatedDom = applyPlugins(
          config.plugins,
          config.configFilePath,
          dom
        );
        !config.bufferMode && exportFile(file, config.output, updatedDom);
        return updatedDom.serialize();
      });
    });

    // once promised doms are resolved,
    // show confirmation and return result
    Promise.all(promisedDomsSerialized).then(result => {
      logConfirmation(config, files);
      return result;
    });
  } catch (e) {
    logError(e);
  }
})();
