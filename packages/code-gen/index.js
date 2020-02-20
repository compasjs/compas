const { getPlugin: getValidatorPlugin } = require("./src/validators");

/*
 THE BATTLEPLAN:

 - Write plugins in the following order: validator, router, models, reactHooks
 - By each, think about a decent to use AST for code generation, so no data processing is needed in code-gen plugins themselves

 Final api, should run from a mainFn()
 ```
 runCodeGen(
 fromBuilder(builderFn),
 fromUrl("http://localhost:3000/_docs.json"),
 ).build({
 plugins: [],
 outputDir: "./src/generated",
 });
 ```
 Plugin interface ( order of plugins running ):
 ```
 {
 name: "pluginName",
 async init(initData)
 async run(options)
 }
 ```
 Interface from core to plugins for preInit stage:
 ```
 {
 hasPlugin(name: string): boolean;
 options: All general options except the plugin array
 }
 ```
 */

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

const validatorPlugin = getValidatorPlugin();
validatorPlugin.init();
validatorPlugin.run({ outputDir: process.cwd(), data: { validators } });
