const path = require("path");

module.exports = [
  {
    description:
      "adds classes from an external class map file correctly, including expanding mixins",
    options: {
      classMapFile: path.join(__dirname, "./fixtures/classMap.yml")
    }
  }
];
