/**
 * Test a plugin by running it on <plugin>.html,
 * optionally with plugin options, and comparing results
 * against <plugin>[.<testName>].expected.html.
 */

const JSDOM = require("jsdom").JSDOM;
const path = require("path");
const readFileSync = require("fs").readFileSync;

const pluginCheck = function(
  options = {
    plugin: null,
    pluginName: null,
    fixtures: null,
    testName: null,
    pluginOptions: {}
  }
) {
  const inputDom = new JSDOM(
    readFileSync(
      path.join(options.fixtures, `${options.pluginName}.html`),
      "utf8"
    )
  );

  const expectedDom = new JSDOM(
    readFileSync(
      path.join(
        options.fixtures,
        `${options.pluginName}${
          options.testName ? "." + options.testName : ""
        }.expected.html`
      ),
      "utf8"
    )
  );

  const outputDom = options.plugin(inputDom, options.pluginOptions);

  return outputDom.serialize() === expectedDom.serialize();
};

module.exports = pluginCheck;
