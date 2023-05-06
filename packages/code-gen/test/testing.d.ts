/**
 * Tests errors that could occur while generating.
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   partialError: string,
 *   generateOptions:
 *   import("../src/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }|{
 *   pass: true,
 *   generateOptions?:
 *   import("../src/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => ((import("../src/builders/TypeBuilder.js").TypeBuilder|import("@compas/code-gen").TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorError(
  t: import("@compas/cli").TestRunner,
  options:
    | {
        partialError: string;
        generateOptions:
          | import("../src/generated/common/types.js").ExperimentalGenerateOptions
          | undefined;
      }
    | {
        pass: true;
        generateOptions?:
          | import("../src/generated/common/types.js").ExperimentalGenerateOptions
          | undefined;
      },
  builders: (
    T: import("@compas/code-gen").TypeCreator,
  ) => (
    | import("../src/builders/TypeBuilder.js").TypeBuilder
    | import("@compas/code-gen").TypeBuilderLike
  )[],
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
 *   import("../src/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => ((import("../src/builders/TypeBuilder.js").TypeBuilder|import("@compas/code-gen").TypeBuilderLike)[])} builders
 * @returns {Promise<{ value: any, error: Record<string, ValidatorErrorMap> }>}
 */
export function testGeneratorType(
  t: import("@compas/cli").TestRunner,
  options: {
    group: string;
    validatorName: string;
    validatorInput: any;
    generateOptions?:
      | import("../src/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (
    T: import("@compas/code-gen").TypeCreator,
  ) => (
    | import("../src/builders/TypeBuilder.js").TypeBuilder
    | import("@compas/code-gen").TypeBuilderLike
  )[],
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
 *   import("../src/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => ((import("../src/builders/TypeBuilder.js").TypeBuilder|import("@compas/code-gen").TypeBuilderLike)[])} builders
 * @returns {void}
 */
export function testGeneratorStaticOutput(
  t: import("@compas/cli").TestRunner,
  options: {
    relativePath: string;
    partialValue: string;
    generateOptions?:
      | import("../src/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (
    T: import("@compas/code-gen").TypeCreator,
  ) => (
    | import("../src/builders/TypeBuilder.js").TypeBuilder
    | import("@compas/code-gen").TypeBuilderLike
  )[],
): void;
/**
 * Get the list of generated output files
 *
 * @param {import("@compas/cli").TestRunner} t
 * @param {{
 *   generateOptions?:
 *   import("../src/generated/common/types.js").ExperimentalGenerateOptions|undefined,
 * }} options
 * @param {(T: import("@compas/code-gen").TypeCreator) => ((import("../src/builders/TypeBuilder.js").TypeBuilder|import("@compas/code-gen").TypeBuilderLike)[])} builders
 * @returns {import("../src/generate.js").OutputFile[]}
 */
export function testGeneratorStaticFiles(
  t: import("@compas/cli").TestRunner,
  options: {
    generateOptions?:
      | import("../src/generated/common/types.js").ExperimentalGenerateOptions
      | undefined;
  },
  builders: (
    T: import("@compas/code-gen").TypeCreator,
  ) => (
    | import("../src/builders/TypeBuilder.js").TypeBuilder
    | import("@compas/code-gen").TypeBuilderLike
  )[],
): import("../src/generate.js").OutputFile[];
//# sourceMappingURL=testing.d.ts.map
