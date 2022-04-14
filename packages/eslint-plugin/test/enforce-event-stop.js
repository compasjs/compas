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
        eventStart(event);
        eventStop(event);
      }`,
    },
    {
      code: `async function noEventStopNoReturn(event, baz) {
             eventStart(event);
        if (baz) {
         eventStop(event);

         return baz;
        }
        
        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopNoReturn(event, baz) {
        eventStart(event);
        if (baz) {
         eventStop(event);

         return baz;
        } else if (baz) {
         eventStop(event);

         return baz;
        }
        
        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function asyncFnWithoutEventParam(baz) {
        eventStart(event);
        if (baz) {
          eventStop(event);
        }

        return baz;
      }`,
    },
    {
      code: `async function tryCatchThrow(event) {
        eventStart(event);
        try {
          foo();

          eventStop(event);
          return true;
        } catch (e) {
          throw new Error();
        }
      }`,
    },
    {
      code: `async function tryCatchReturn(event) {
        eventStart(event);
        try {
          foo();

          eventStop(event);
          return true;
        } catch (e) {
          eventStop(event);
          return false;
        }
      }`,
    },
  ],
  invalid: [
    {
      code: `async function asyncFnWithoutEventStop(event) { eventStart(event); }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopInIfStatement(event, baz) {
        eventStart(event);
        if (baz) {
          return baz;
        }

        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopOutsideIfStatement(event, baz) {
        eventStart(event);
        
        if (baz) {
         eventStop(event);

         return baz;
        } else if (baz) {
          return bar;
        } else {
        } 

      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopNoReturn(event, baz) {
        eventStart(event);
        
        if (baz) {
         eventStop(event);

         return baz;
        }
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function noEventStopNoReturn(event, baz) {
        eventStart(event);
        
        if (baz) {
         eventStop(event);

         return baz;
        } else {
          return false;
        }
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function inlineReturn(event, baz) {
        eventStart(event);
        
        if (baz) return true;

        eventStop(event);
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function tryCatchThrow(event) {
        eventStart(event);
        try {
          foo();

          return true;
        } catch (e) {
          throw new Error();
        }
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
    {
      code: `async function tryCatchReturn(event) {
        eventStart(event);
        try {
          foo();

          eventStop(event);
          return true;
        } catch (e) {
          return false;
        }
      }`,
      errors: [{ message: rule.meta.messages.missingEventStop }],
    },
  ],
});
