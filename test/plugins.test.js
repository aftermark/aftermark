const path = require("path");
const pluginCheck = require("./plugin-check");
const { existsSync, readdirSync, statSync } = require("fs");

// get list of plugins

const pluginRootPath = path.join(__dirname, "../packages/plugins");

const pluginNames = readdirSync(pluginRootPath).filter(f =>
  statSync(path.join(pluginRootPath, f)).isDirectory()
); // finds all top-level directories within plugins directory

// run tests for each plugin

pluginNames.forEach(pluginName => {
  try {
    const pluginPath = path.join(pluginRootPath, pluginName);
    const pkgPath = path.join(pluginPath, "package.json");

    // make sure this is a plugin with its own package.json
    if (existsSync(pkgPath)) {
      const pkg = require(pkgPath);

      if (!pkg.name) {
        throw `${path.relative(
          process.cwd(),
          pkgPath
        )} is missing a \`name\` field.`;
      }

      const plugin = require(pkg.name);

      const fixturesPath = path.join(pluginPath, "test/fixtures");
      const testDefsFile = path.join(pluginPath, "test/test-defs.js");

      if (existsSync(testDefsFile)) {
        const testDefs = require(testDefsFile);

        testDefs &&
          // create a set of tests for each plugin
          describe(pkg.name, () => {
            // create a test for each definition
            testDefs.forEach(testDef => {
              test(testDef.description, () => {
                expect(
                  pluginCheck({
                    plugin,
                    pluginName, // plugin name without scope
                    fixtures: fixturesPath,
                    testName: testDef.name,
                    pluginOptions: testDef.options
                  })
                ).toBe(true);
              });
            });
          });
      } else {
        console.log(
          `To test ${pkg.name} create a test-defs.js file in its test/ folder`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
});
