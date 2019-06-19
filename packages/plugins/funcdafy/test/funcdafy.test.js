const JSDOM = require("jsdom").JSDOM;
const path = require("path");
const readFileSync = require("fs").readFileSync;

const pluginName = "funcdafy";
const plugin = require(`@aftermark/${pluginName}`);
const fixtures = path.join(__dirname, "fixtures");

test(`@aftermark/${pluginName} adds classes from class map correctly`, () => {
  expect(compare()).toBe(true);
});

function compare() {
  const inputDom = new JSDOM(
    readFileSync(path.join(fixtures, `${pluginName}.html`), "utf8")
  );

  const expectedDom = new JSDOM(
    readFileSync(path.join(fixtures, `${pluginName}.expected.html`), "utf8")
  );

  const outputDom = plugin(inputDom, {
    classMapFile: path.join(fixtures, `${pluginName}.classMap.yml`)
  });

  return outputDom.serialize() === expectedDom.serialize();
}
