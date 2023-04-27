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
 *   generateOptions?:
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
        generateOptions?:
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
 *   generateOptions?:
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
    generateOptions?:
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
 *   generateOptions?:
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
    generateOptions?:
      | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): void;
/**
 * Get the list of generated output files
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   generateOptions?:
 *   import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: TypeCreator) => ((TypeBuilder|TypeBuilderLike)[])} builders
 * @returns {import("../src/experimental/generate.js").OutputFile[]}
 */
export function testGeneratorStaticFiles(
  t: import("@compas/cli").TestRunner,
  options: {
    generateOptions?:
      | import("../src/experimental/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (T: TypeCreator) => (TypeBuilder | TypeBuilderLike)[],
): import("../src/experimental/generate.js").OutputFile[];
import { TypeCreator } from "../src/builders/index.js";
//# sourceMappingURL=testing.d.ts.map
