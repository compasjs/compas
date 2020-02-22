const { runCodeGen } = require("./src/core");
const { mainFn } = require("@lbu/cli");
const { newLogger } = require("@lbu/insight");
const { getPlugin: getValidatorsPlugin } = require("./src/validators");
const { getPlugin: getRouterPlugin } = require("./src/router");

const validators = [
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyBool",
    preValidateHook: "preValidateMyBool",
    postValidateHook: "postValidateMyBool",
    validator: {
      type: "boolean",
      functionName: "booleanValidator1",
      optional: true,
      convert: true,
      // Note oneOf in boolean is either undefined, true or false and not an array
      oneOf: false,
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyNumber",
    preValidateHook: "preValidateMyNumber",
    postValidateHook: "postValidateMyNumber",
    validator: {
      type: "number",
      functionName: "numberValidator1",
      optional: true,
      oneOf: [1, 2, 3, 4],
      convert: true,
      min: 5,
      max: 10,
      integer: true,
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyString",
    preValidateHook: "preValidateMyString",
    postValidateHook: "postValidateMyString",
    validator: {
      type: "string",
      functionName: "stringValidator1",
      optional: true,
      oneOf: ["foo", "bar"],
      convert: true,
      min: 5,
      max: 10,
      trim: true,
      lowerCase: false,
      upperCase: true,
      pattern: undefined,
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyObject",
    preValidateHook: "preValidateMyObject",
    postValidateHook: "postValidateMyObject",
    validator: {
      type: "object",
      functionName: "objectValidator1",
      optional: false,
      strict: true,
      keys: {
        foo: {
          type: "boolean",
          functionName: "booleanValidator2",
        },
        bar: {
          type: "object",
          functionName: "objectValidator2",
          optional: true,
          keys: {
            foo: {
              type: "boolean",
              functionName: "booleanValidator3",
            },
          },
        },
        baz: {
          type: "number",
          functionName: "numberValidator3",
        },
      },
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyArray",
    preValidateHook: "preValidateMyArray",
    postValidateHook: "postValidateMyArray",
    validator: {
      type: "array",
      functionName: "arrayValidator1",
      optional: true,
      convert: false,
      min: 2,
      values: {
        type: "boolean",
        functionName: "booleanValidator6",
      },
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyAnyOf",
    preValidateHook: "preValidateMyAnyOf",
    postValidateHook: "postValidateMyAnyOf",
    validator: {
      type: "anyOf",
      functionName: "anyOfValidator1",
      optional: true,
      values: [
        {
          type: "boolean",
          functionName: "booleanValidator7",
          optional: true,
        },
        {
          type: "boolean",
          functionName: "booleanValidator8",
          convert: true,
        },
      ],
    },
  },
  {
    type: "NAMED_VALIDATOR",
    validatorName: "validateMyReference",
    preValidateHook: "preValidateMyReference",
    postValidateHook: "postValidateMyReference",
    validator: {
      type: "reference",
      functionName: "referenceValidator1",
      optional: true,
      reference: "arrayValidator1",
    },
  },
];

const routes = [
  {
    name: "getFoo",
    path: "/foo",
    method: "GET",
    tags: ["foo", "bar"],
    docs: "This is a doc string",
    queryValidator: "validateMyObject",
    paramsValidator: "validateMyObject",
    bodyValidator: "validateMyObject",
  },
];

const routeTrie = {
  children: [
    {
      routeName: "getFoo",
      functionName: "routeMatcher1",
      prio: "STATIC",
      staticPath: "GET/foo",
      children: [
        {
          routeName: "getFooBar",
          functionName: "routeMatcher2",
          prio: "STATIC",
          staticPath: "bar",
        },
        {
          routeName: "getFooStaticRoutes",
          functionName: "routeMatch5",
          prio: "WILDCARD",
        },
      ],
    },
    {
      functionName: "routeMatcher3",
      prio: "STATIC",
      staticPath: "GET",
      children: [
        {
          routeName: "getId",
          functionName: "routeMatcher4",
          prio: "PARAM",
          paramName: "id",
        },
      ],
    },
  ],
};

mainFn(module, require, newLogger(), async logger => {
  const validator = getValidatorsPlugin();
  const router = getRouterPlugin();

  await runCodeGen(logger, () => ({ validators, routes, routeTrie })).build({
    plugins: [validator, router],
    outputDir: "./generated",
  });
});

module.exports = {
  nodemonArgs: "--ignore generated -e js,json,tmpl",
};
