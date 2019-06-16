const glob = require("glob");
const JSDOM = require("jsdom").JSDOM;

import { applyPlugins } from "./applyPlugins";
import { exportFile } from "./exportFile";
import { getConfig } from "./getConfig";
import { logConfirmation } from "./logConfirmation";
import { logError } from "./logError";

(function() {
  try {
    const config = getConfig({ debug: true });

    // get array of filenames to process
    const files = glob.sync(config.input);

    const promisedDomsSerialized = files.map(file => {
      return JSDOM.fromFile(file).then(dom => {
        const updatedDom = applyPlugins(config.plugins, dom);
        exportFile(file, config.output, updatedDom);
        return updatedDom.serialize();
      });
    });

    Promise.all(promisedDomsSerialized).then(result => {
      logConfirmation(config, files);
      return result;
    });
  } catch (e) {
    logError(e);
  }
})();
