/* eslint-disable import/no-commonjs */

/**
 * @type {object} Eslint settings
 */
const settings = {
  root: true,
  globals: {
    AbortController: "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ["@babel/plugin-syntax-class-properties"],
    },
  },
  rules: {
    // ESLint base
    "no-process-exit": "off",
    "no-console": ["error", { allow: ["dir", "time", "timeEnd"] }],
    "no-promise-executor-return": "error",
    "no-unsafe-optional-chaining": [
      "error",
      { disallowArithmeticOperators: true },
    ],
    "default-case-last": "error",
    "no-else-return": "error",
    "no-return-assign": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "require-await": "error",

    // ESLint plugin import
    "import/export": "off",
    "import/first": "error",
    "import/named": "off",
    "import/namespace": "off",
    "import/newline-after-import": ["error", { count: 1 }],
    "import/no-commonjs": "error",
    "import/no-default-export": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  env: {
    node: true,
    es2020: true,
  },
};
/**
 * @type {object} Eslint settings
 */
const jsdocSettings = {
  plugins: ["jsdoc"],
  rules: {
    // ESLint plugin jsdoc
    "jsdoc/check-alignment": "error",
    "jsdoc/check-examples": ["off", { padding: 2 }],
    "jsdoc/check-param-names": "error",
    "jsdoc/check-property-names": "error",
    "jsdoc/check-syntax": "error",
    "jsdoc/check-tag-names": ["error", { definedTags: [] }],
    "jsdoc/check-types": ["error"],
    "jsdoc/check-values": "error",
    "jsdoc/empty-tags": "error",
    "jsdoc/newline-after-description": ["error", "always"],
    "jsdoc/require-param-name": "error",
    "jsdoc/require-property": "error",
    "jsdoc/require-property-type": "error",
    "jsdoc/require-property-name": "error",
    "jsdoc/require-returns-check": [
      "off",
      { reportMissingReturnForUndefinedTypes: true },
    ],
    "jsdoc/require-returns-description": "off",
    "jsdoc/require-returns-type": "off",
    "jsdoc/valid-types": "off",
  },
  settings: {
    jsdoc: {
      mode: "typescript",
    },
  },
};

/**
 * @type {object} Eslint settings
 */
module.exports =
  process.env.CI === "true" || process.env.LINT_JSDOC === "true"
    ? {
        ...settings,
        ...jsdocSettings,
        rules: {
          ...settings.rules,
          ...jsdocSettings.rules,
        },
      }
    : settings;
