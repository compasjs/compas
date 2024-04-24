/* eslint-disable import/no-commonjs,import/order */

const rule = require("../lint-rules/node-builtin-module-url-import");
const RuleTester = require("eslint").RuleTester;
const { join } = require("path");

const ruleTester = new RuleTester({
  parser: join(process.cwd(), "./node_modules/@babel/eslint-parser"),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ["@babel/plugin-syntax-class-properties"],
    },
  },
  env: {
    node: true,
    es2021: true,
  },
});

ruleTester.run("node-builtin-module-url-import", rule, {
  valid: [
    {
      code: `import foo from "node:path";`,
    },
    {
      code: `import * as foo from "node:path";`,
    },
    {
      code: `import * as foo from "other-module";`,
    },
  ],
  invalid: [
    {
      code: `import { join } from "path";`,
      output: `import { join } from "node:path";`,
      errors: [
        {
          message: rule.meta.messages.consistentImport,
          suggestions: [
            {
              messageId: "replaceImport",
              data: { value: "path" },
              output: `import { join } from "node:path";`,
            },
          ],
        },
      ],
    },
  ],
});
