/* eslint-disable import/no-commonjs,import/order */

const rule = require("../lint-rules/enforce-event-stop.js");
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

ruleTester.run("enforce-event-stop", rule, {
  valid: [
    {
      code: `function fnWithoutArgs() {}`,
    },
    {
      code: `async function asyncFunWithoutArgs() {}`,
    },
    {
      code: `async function asyncFnWithEventStop(event, baz) {
        eventStop(event);
      }`,
    },
    {
      code: `async function asyncFnWithEventStopAllPaths(event, baz) {
        if (baz) {
          eventStop(event);

          return baz;
        }

        eventStop(event);
      }`,
    },
    {
      code: `async function asyncFnWithoutEventParam(baz) {
        if (baz) {
          eventStop(event);
        }

        return baz;
      }`,
    },
  ],
  invalid: [
    {
      code: `async function asyncFnWithoutEventStop(event) {}`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopInIfStatement(event, baz) {
        if (baz) {
          return baz;
        }

        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopOutsideIfStatement(event, baz) {
        if (baz) {
         eventStop(event);

         return baz;
        }

        return false;
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopNoReturn(event, baz) {
        if (baz) {
         eventStop(event);

         return baz;
        }
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function inlineReturn(event, baz) {
        if (baz) return true;
        
        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
  ],
});
