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
 * @typedef {CodeGenSpecificationSuite
 *   |CodeGenSpecificationGenerate
 *   |CodeGenSpecificationValidator
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
                group: "specificationValidator",
                name: "any",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "any",
              },
              input: JSON.stringify({}),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "any",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "any",
              },
              input: JSON.stringify([1, 2]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "anyOptional",
              },
              input: JSON.stringify([1, 2]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOptional",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOptional",
              },
              input: JSON.stringify(null),
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
                group: "specificationValidator",
                name: "anyOf",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOf",
              },
              input: JSON.stringify(false),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify("br"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOfMixedPrimitive",
              },
              input: JSON.stringify(500),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "anyOfObjects",
              },
              input: JSON.stringify({
                type: "north",
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOfObjects",
              },
              input: JSON.stringify({
                type: "east",
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "anyOfNested",
              },
              input: JSON.stringify(1),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "anyOfNested",
              },
              input: JSON.stringify(2),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "array",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "array",
              },
              input: JSON.stringify([true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "array",
              },
              input: JSON.stringify([true, true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "arrayNested",
              },
              input: JSON.stringify(true),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "arrayNested",
              },
              input: JSON.stringify([true]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "arrayNested",
              },
              input: JSON.stringify([[true], [true, true]]),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "object",
              },
              input: JSON.stringify({
                foo: true,
              }),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "string",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "string",
              },
              input: JSON.stringify("true"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "stringMinMax",
              },
              input: JSON.stringify("perfect!"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringOneOf",
              },
              input: JSON.stringify("north"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringOneOf",
              },
              input: JSON.stringify("east"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "stringAllowNull",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringAllowNull",
              },
              input: JSON.stringify(null),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringAllowNull",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringOptional",
              },
              input: JSON.stringify("foo"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringOptional",
              },
              input: JSON.stringify(null),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringOptional",
              },
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringPattern",
              },
              input: JSON.stringify("222"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
                name: "stringPattern",
              },
              input: JSON.stringify("222"),
            },
            {
              type: "validator",
              generatedType: {
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
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
                group: "specificationValidator",
                name: "stringDisallowCharacters",
              },
              input: JSON.stringify("foo"),
            },
          ],
        },
      ],
    },
  ],
};
