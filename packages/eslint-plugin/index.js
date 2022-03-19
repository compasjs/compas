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
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-class-properties"],
        },
      },
      rules: {
        // Plugin rules
        "@compas/enforce-event-stop": "error",

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

        // ESLint plugin jsdoc
        "jsdoc/check-alignment": "error",
        "jsdoc/check-examples": "off",
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
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-returns-check": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/require-returns-type": "off",
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
  },
};
