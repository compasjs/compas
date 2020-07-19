/* eslint-disable import/no-commonjs */

/**
 * @type {object} Eslint settings
 */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
  ],
  parser: "babel-eslint",
  rules: {
    // ESLint base
    "no-process-exit": "off",
    "no-console": ["error", { allow: ["dir", "time", "timeEnd"] }],
    "no-promise-executor-return": "error",
    "default-case-last": "error",
    "no-else-return": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",

    // ESLint plugin import
    "import/no-commonjs": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/first": "error",
    "import/newline-after-import": ["error", { count: 1 }],
    "import/no-default-export": "error",
  },
  env: {
    node: true,
    es2020: true,
  },
};
