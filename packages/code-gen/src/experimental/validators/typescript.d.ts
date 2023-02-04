/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorTypescriptGetNameAndImport(
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @returns {import("../file/context").GenerateFile}
 */
export function validatorTypescriptGetFile(
  generateContext: import("../generate").GenerateContext,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
): import("../file/context").GenerateFile;
/**
 * Write docs and declare the validator function for the provided type.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../validators/generator").ValidatorState} validatorState
 */
export function validatorTypescriptStartValidator(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  validatorState: import("../validators/generator").ValidatorState,
): void;
//# sourceMappingURL=typescript.d.ts.map
