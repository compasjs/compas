import { specificationStructureDirectory } from "./structure.js";

/**
 * @typedef {object} CodeGenSpecificationSuite
 * @property {"suite"} type
 * @property {string} name
 * @property {CodeGenSpecification[]} components
 */

/**
 * @typedef {object} CodeGenSpecificationGenerate
 * @property {"generate"} type
 * @property {string} structureDirectory
 */

/**
 * @typedef {object} CodeGenSpecificationValidator
 * @property {"validator"} type
 * @property {{ group: string, name: string }} generatedType
 * @property {string} [input]
 * @property {{
 *   key: string,
 *   errorKey: string,
 * }} [assertValidatorError]
 */

/**
 * @typedef {object} CodeGenSpecificationRouteMatcher
 * @property {"routeMatcher"} type
 * @property {{
 *   method: string,
 *   path: string,
 * }} matchInput
 * @property {{
 *   route: {
 *     group: string,
 *     name: string,
 *   },
 *   params: Record<string, string>
 * }} [matchOutput]
 */

/**
 * @typedef {CodeGenSpecificationSuite
 *   |CodeGenSpecificationGenerate
 *   |CodeGenSpecificationValidator
 *   |CodeGenSpecificationRouteMatcher
 * } CodeGenSpecification
 */

/**
 * @type {CodeGenSpecification}
 */
export const codeGenSpecification = {
  type: "suite",
  name: "Root",
  components: [
    {
      type: "generate",
      structureDirectory: specificationStructureDirectory,
    },
    {
      type: "suite",
      name: "Validators",
      components: [
        {
          type: "suite",
          name: "any",
          components: [
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              input: JSON.stringify({}),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              input: JSON.stringify([1, 2]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "any",
              },
              input: JSON.stringify(null),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOptional",
              },
              input: JSON.stringify([1, 2]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOptional",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOptional",
              },
              input: JSON.stringify(null),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyStringLength",
              },
              input: JSON.stringify("foo"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.any",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyStringLength",
              },
              input: JSON.stringify("foobar"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyWithImport",
              },
              input: JSON.stringify([]),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.any",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyWithImport",
              },
              input: JSON.stringify({}),
            },
          ],
        },
        {
          type: "suite",
          name: "anyOf",
          components: [
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOf",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOf",
              },
              input: JSON.stringify(false),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOf",
              },
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOf",
              },
              input: JSON.stringify("br"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.anyOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify("br"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify(500),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify({ foo: "bar" }),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.anyOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify(true),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.anyOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfObjects",
              },
              input: JSON.stringify({
                type: "north",
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfObjects",
              },
              input: JSON.stringify({
                type: "east",
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfObjects",
              },
              input: JSON.stringify({
                type: "west",
              }),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.anyOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfNested",
              },
              input: JSON.stringify(1),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfNested",
              },
              input: JSON.stringify(2),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "anyOfNested",
              },
              input: JSON.stringify(3),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.anyOf",
              },
            },
          ],
        },
        {
          type: "suite",
          name: "array",
          components: [
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "array",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "array",
              },
              input: JSON.stringify([true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "array",
              },
              input: JSON.stringify([true, true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "array",
              },
              input: JSON.stringify([true, false]),
              assertValidatorError: {
                key: "$.1",
                errorKey: "validator.oneOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "arrayNested",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "arrayNested",
              },
              input: JSON.stringify([true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "arrayNested",
              },
              input: JSON.stringify([[true], [true, true]]),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "arrayNested",
              },
              input: JSON.stringify([[true], [false, true, false]]),
              assertValidatorError: {
                key: "$.1.0",
                errorKey: "validator.oneOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "arrayNested",
              },
              input: JSON.stringify([[true], [false, true, false]]),
              assertValidatorError: {
                key: "$.1.2",
                errorKey: "validator.oneOf",
              },
            },
          ],
        },
        {
          type: "suite",
          name: "object",
          components: [
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "object",
              },
              input: JSON.stringify({
                foo: true,
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "object",
              },
              input: JSON.stringify(null),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "object",
              },
              input: JSON.stringify({}),
              assertValidatorError: {
                key: "$.foo",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "object",
              },
              input: JSON.stringify({
                foo: true,
                bar: false,
              }),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.keys",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "objectLoose",
              },
              input: JSON.stringify({
                foo: true,
                bar: false,
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "objectNested",
              },
              input: JSON.stringify({
                foo: {},
              }),
              assertValidatorError: {
                key: "$.foo.bar",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "objectNested",
              },
              input: JSON.stringify({
                foo: {
                  baz: true,
                },
              }),
              assertValidatorError: {
                key: "$.foo",
                errorKey: "validator.keys",
              },
            },
          ],
        },
        {
          type: "suite",
          name: "string",
          components: [
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "string",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "string",
              },
              input: JSON.stringify("true"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "string",
              },
              input: JSON.stringify(""),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.length",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "string",
              },
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "string",
              },
              input: JSON.stringify(null),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.undefined",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringMinMax",
              },
              input: JSON.stringify("foo"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.length",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringMinMax",
              },
              input: JSON.stringify("a too long string"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.length",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringMinMax",
              },
              input: JSON.stringify("perfect!"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOneOf",
              },
              input: JSON.stringify("north"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOneOf",
              },
              input: JSON.stringify("east"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOneOf",
              },
              input: JSON.stringify("oops"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.oneOf",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringAllowNull",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringAllowNull",
              },
              input: JSON.stringify(null),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringAllowNull",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOptional",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOptional",
              },
              input: JSON.stringify(null),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringOptional",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringPattern",
              },
              input: JSON.stringify("222"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringPattern",
              },
              input: JSON.stringify("222"),
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringPattern",
              },
              input: JSON.stringify("222.22"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.pattern",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringDisallowCharacters",
              },
              input: JSON.stringify("foo bar"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.disallowedCharacters",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringDisallowCharacters",
              },
              input: JSON.stringify("foo^bar^baz"),
              assertValidatorError: {
                key: "$",
                errorKey: "validator.length",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "validator",
                name: "stringDisallowCharacters",
              },
              input: JSON.stringify("foo"),
            },
          ],
        },
      ],
    },
    {
      type: "suite",
      name: "RouteMatcher",
      components: [
        {
          type: "suite",
          name: "static",
          components: [
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "base",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "static",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "static",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static-trailing",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "staticTrailingSlash",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static-trailing/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "staticTrailingSlash",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "static",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/unused/1",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "staticNested1",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/unused/1/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "staticNested1",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/unused/2",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "staticNested2",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/static/unused/3",
              },
            },
          ],
        },
        {
          type: "suite",
          name: "param",
          components: [
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/5",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramSingle",
                },
                params: {
                  foo: "5",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/",
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/five",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramSingle",
                },
                params: {
                  foo: "five",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/five/",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramSingle",
                },
                params: {
                  foo: "five",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/five/bar",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramSingleNestedStatic",
                },
                params: {
                  foo: "five",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param/five/baz",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramNested",
                },
                params: {
                  foo: "five",
                  bar: "baz",
                },
              },
            },
          ],
        },
        {
          type: "suite",
          name: "paramMixed",
          components: [
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param-mixed/foo",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramMixedBase",
                },
                params: {
                  foo: "foo",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param-mixed/foo/foo",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramMixedFoo",
                },
                params: {
                  foo: "foo",
                },
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/param-mixed/bar/bar",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "paramMixedBar",
                },
                params: {
                  bar: "bar",
                },
              },
            },
          ],
        },
        {
          type: "suite",
          name: "wildcard",
          components: [
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/wildcard/foo/bar",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "wildcardBase",
                },
                params: {},
              },
            },
            {
              type: "routeMatcher",
              matchInput: {
                method: "GET",
                path: "/wildcard/nested/foo/bar",
              },
              matchOutput: {
                route: {
                  group: "routeMatcher",
                  name: "wildcardNested",
                },
                params: {},
              },
            },
          ],
        },
      ],
    },
  ],
};
