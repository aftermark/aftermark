module.exports = {
  presets: [
    [
      "@babel/env",
      { modules: false } // otherwise Babel will convert our modules
      // to CommonJS before Rollup gets a chance
      // to do its thing
    ]
  ]
};
