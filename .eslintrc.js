module.exports = {
  "env": {
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "prettier" // ensures .prettierrc is honored
  ],
  "rules": {
    "no-console": "off"
  }
}
