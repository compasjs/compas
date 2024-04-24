/* eslint-disable import/no-commonjs,import/order */

const rule = require("../lint-rules/check-event-name.js");
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

ruleTester.run("check-event-name", rule, {
  valid: [
    {
      code: `function fooBar() { }`,
    },
    {
      code: `const foo = function() {  eventStart(event, "bar"); }`,
    },
    {
      code: `async function fooBar(event) {  eventStart(event, "foo.bar"); }`,
    },
    {
      code: `async function fooBar(event) {  eventStart(event, \`foo.bar\`); }`,
    },
    {
      code: `async function fooBar(event) {  const name = "foo";  eventStart(event, \`$\{name}.bar\`); }`,
    },
    {
      code: `async function fooBar(event) {  const name = "foo.bar";  eventStart(event, name); }`,
    },
    {
      code: `async function foo(event) {  eventStart(event, "foo"); }`,
    },
    {
      code: `async function fooBar(event) {  eventStart(event, "foo.bar"); }`,
    },
    {
      code: `async function fooBarBaz(event) {  eventStart(event, "foo.barBaz"); }`,
    },
    {
      code: `async function fooBarBaz(event) {  eventStart(event, "fooBar.baz"); }`,
    },
    {
      code: `async function fooBarBazQuix(event) {  eventStart(event, "foo.barBazQuix"); }`,
    },
    {
      code: `async function fooBarBazQuix(event) {  eventStart(event, "fooBar.bazQuix"); }`,
    },
    {
      code: `async function fooBarBazQuix(event) {  eventStart(event, "fooBarBaz.quix"); }`,
    },
  ],
  invalid: [
    {
      code: `async function missingEventStart(event) { const foo = 5; }`,
      errors: [
        {
          message: rule.meta.messages.missingEventStart,
          suggestions: [
            {
              messageId: "addEventStart",
              data: {},
              output: `async function missingEventStart(event) { eventStart(event, "");
  const foo = 5; }`,
            },
          ],
        },
      ],
    },
    {
      code: `async function fooBar(event) { eventStart(event, "foo"); }`,
      errors: [
        {
          message: rule.meta.messages.consistentEventName,
          suggestions: [
            {
              messageId: "replaceEventName",
              data: { value: "foo.bar" },
              output: `async function fooBar(event) { eventStart(event, "foo.bar"); }`,
            },
          ],
        },
      ],
    },
    {
      code: `async function fooBarBaz(event) { eventStart(event, "fooBarBaz"); }`,
      errors: [
        {
          message: rule.meta.messages.consistentEventName,
          suggestions: [
            {
              messageId: "replaceEventName",
              data: { value: "foo.barBaz" },
              output: `async function fooBarBaz(event) { eventStart(event, "foo.barBaz"); }`,
            },
            {
              messageId: "replaceEventName",
              data: { value: "fooBar.baz" },
              output: `async function fooBarBaz(event) { eventStart(event, "fooBar.baz"); }`,
            },
          ],
        },
      ],
    },
  ],
});
