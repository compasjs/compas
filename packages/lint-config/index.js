/**
 * @type {Object} Eslint settings
 */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  parser: "babel-eslint",
  rules: {
    "no-process-exit": "off",
  },
  env: {
    node: true,
    es2020: true,
  },
};
