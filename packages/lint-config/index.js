/**
 * @type {object} Eslint settings
 */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsdoc/recommended",
  ],
  parser: "babel-eslint",
  settings: {
    jsdoc: {
      mode: "typescript",
      ignorePrivate: true,
    },
  },
  rules: {
    "no-process-exit": "off",
    "jsdoc/require-returns-description": "off",
  },
  env: {
    node: true,
    es2020: true,
  },
};
