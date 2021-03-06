import { logError } from "./logError";

export function applyPlugins(plugins, configFilePath, dom) {
  Object.keys(plugins).forEach(pluginName => {
    try {
      const plugin = require(pluginName);
      const pluginOptions = plugins[pluginName];
      pluginOptions.configFilePath = configFilePath;

      dom = plugin(dom, pluginOptions);
    } catch (e) {
      logError(`${pluginName} -- ` + e);
    }
  });
  return dom;
}
