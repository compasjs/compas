/**
 * Tests errors that could occur while generating.
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   partialError: string,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }|{
 *   pass: true,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorError(
  t: import("@compas/cli").TestRunner,
  options:
    | {
        partialError: string;
        generateOptions:
          | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
          | undefined;
      }
    | {
        pass: true;
        generateOptions:
          | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
          | undefined;
      },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): void;
/**
 * Tests types that have been generated via the JS validators
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   group: string,
 *   validatorName: string,
 *   validatorInput: any,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {Promise<{ value: any, error: Record<string, ValidatorErrorMap> }>}
 */
export function testGeneratorType(
  t: import("@compas/cli").TestRunner,
  options: {
    group: string;
    validatorName: string;
    validatorInput: any;
    generateOptions:
      | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): Promise<{
  value: any;
  error: Record<string, ValidatorErrorMap>;
}>;
/**
 * Tests if the outputFiles include the provided value
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   relativePath: string,
 *   partialValue: string,
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorStaticOutput(
  t: import("@compas/cli").TestRunner,
  options: {
    relativePath: string;
    partialValue: string;
    generateOptions:
      | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): void;
/**
 * Test the dynamic generator output. Returns the path where the files are written to.
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   generateOptions:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {string}
 */
export function testGeneratorDynamicOutput(
  t: import("@compas/cli").TestRunner,
  options: {
    generateOptions:
      | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): string;
import { TypeCreator } from "../src/builders/index.js";
//# sourceMappingURL=testing.d.ts.map
