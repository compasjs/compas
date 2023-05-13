/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @returns {import("../file/context.js").GenerateFile}
 */
export function validatorJavascriptGetFile(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
): import("../file/context.js").GenerateFile;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorJavascriptGetNameAndImport(
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
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
export function validatorJavascriptStartValidator(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 * Exit validation function, determines if an error or the value is returned.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptStopValidator(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 * Do the nil check, allowNull and defaultValue handling.
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("./generator.js").ValidatorState} validatorState
 * @param {{ isOptional: boolean, allowNull: boolean, defaultValue?: string }} options
 */
export function validatorJavascriptNilCheck(
  file: import("../file/context.js").GenerateFile,
  validatorState: import("./generator.js").ValidatorState,
  options: {
    isOptional: boolean;
    allowNull: boolean;
    defaultValue?: string;
  },
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureAnyDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAny(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureAnyDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureAnyOfDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAnyOf(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureAnyOfDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureArrayDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptArray(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureArrayDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureBooleanDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptBoolean(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureBooleanDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureDateDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptDate(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureDateDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureFileDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptFile(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureFileDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureGenericDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptGeneric(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureGenericDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureNumberDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptNumber(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureNumberDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureObjectDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptObject(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureObjectDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureReferenceDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptReference(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureReferenceDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureStringDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptString(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureStringDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureUuidDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptUuid(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").StructureUuidDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 * Finish the else block for nil checks.
 *
 * @param {import("../file/context.js").GenerateFile} file
 */
export function validatorJavascriptFinishElseBlock(
  file: import("../file/context.js").GenerateFile,
): void;
//# sourceMappingURL=javascript.d.ts.map
