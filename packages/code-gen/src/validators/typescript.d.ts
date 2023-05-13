/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorTypescriptGetNameAndImport(
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @returns {import("../file/context.js").GenerateFile}
 */
export function validatorTypescriptGetFile(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
): import("../file/context.js").GenerateFile;
/**
 * Write docs and declare the validator function for the provided type.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorTypescriptStartValidator(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
  validatorState: import("./generator.js").ValidatorState,
): void;
//# sourceMappingURL=typescript.d.ts.map
