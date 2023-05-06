/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../types.js").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @returns {import("../file/context.js").GenerateFile}
 */
export function validatorJavascriptGetFile(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
): import("../file/context.js").GenerateFile;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorJavascriptGetNameAndImport(
  file: import("../file/context.js").GenerateFile,
  type: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
/**
 * Write docs and declare the validator function for the provided type.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptStartValidator(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
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
 * @param {import("../generated/common/types.js").ExperimentalAnyDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAny(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalAnyDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalAnyOfDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAnyOf(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalAnyOfDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalArrayDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptArray(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalArrayDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalBooleanDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptBoolean(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalBooleanDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalDateDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptDate(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalDateDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalFileDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptFile(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalFileDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalGenericDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptGeneric(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalGenericDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalNumberDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptNumber(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalNumberDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptObject(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalObjectDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalReferenceDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptReference(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalReferenceDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalStringDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptString(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalStringDefinition,
  validatorState: import("./generator.js").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalUuidDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptUuid(
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalUuidDefinition,
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
