/* eslint-disable import/no-commonjs */

/**
 * @type {Record<string, any>} Eslint settings
 */
module.exports = {
  configs: {
    full: {
      root: true,
      globals: {},
      plugins: ["jsdoc", "@compas"],
      extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "prettier",
      ],
      settings: {
        jsdoc: {
          mode: "typescript",
          preferredTypes: {
            Object: "object",
            "object<>": "Record<>",
            "Object<>": "Record<>",
            "object.<>": "Record<>",
            "Object.<>": "Record<>",
            "Array.<>": "[]",
            "Array<>": "[]",
            String: "string",
            Boolean: "boolean",
            Number: "number",
          },
        },
      },
      parser: "@babel/eslint-parser",
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-class-properties"],
        },
      },
      rules: {
        // Plugin rules
        "@compas/enforce-event-stop": "error",
        "@compas/check-event-name": "error",
        "@compas/node-builtin-module-url-import": "error",

        // ESLint base
        "default-case-last": "error",
        "default-param-last": "error",
        "no-console": ["error", { allow: ["dir", "time", "timeEnd"] }],
        "no-else-return": "error",
        "no-eq-null": "error",
        "no-labels": "error",
        "no-process-exit": "off",
        "no-promise-executor-return": "error",
        "no-return-assign": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unsafe-optional-chaining": [
          "error",
          { disallowArithmeticOperators: true },
        ],
        "no-var": "error",
        "prefer-const": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-template": "error",
        "require-await": "error",

        // ESLint plugin import
        "import/export": "error",
        "import/no-empty-named-blocks": "error",
        "import/no-commonjs": "error",
        "import/no-amd": "error",
        "import/named": "error",
        "import/first": "error",
        "import/namespace": "off",
        "import/newline-after-import": ["error", { count: 1 }],
        "import/no-default-export": "error",
        "import/order": [
          "error",
          {
            "newlines-between": "never",
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],

        // https://github.com/import-js/eslint-plugin-import/issues/1810:
        "import/no-unresolved": ["error"],

        // ESLint plugin jsdoc
        "jsdoc/check-alignment": "error",
        "jsdoc/check-examples": "off",
        "jsdoc/check-indentation": "off",
        "jsdoc/check-line-alignment": ["error", "never", { wrapIndent: "  " }],
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-syntax": "error",
        "jsdoc/check-tag-names": ["error", { definedTags: [] }],
        "jsdoc/check-types": ["error"],
        "jsdoc/check-values": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-hyphen-before-param-description": ["error", "never"],
        "jsdoc/require-param-name": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-returns-check": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/require-returns-type": "error",
        "jsdoc/tag-lines": [
          "error",
          "never",
          {
            startLines: 1,
            endLines: 0,
            tags: {
              deprecated: { lines: "any" },
              public: { lines: "any" },
              private: { lines: "any" },
              see: { lines: "any" },
              since: { lines: "any" },
              summary: { lines: "any" },
              template: { lines: "any" },
            },
          },
        ],
        "jsdoc/valid-types": "off",
      },
      env: {
        node: true,
        es2021: true,
      },
    },
  },
  rules: {
    "enforce-event-stop": require("./lint-rules/enforce-event-stop"),
    "check-event-name": require("./lint-rules/check-event-name"),
    "node-builtin-module-url-import": require("./lint-rules/node-builtin-module-url-import"),
  },
};
