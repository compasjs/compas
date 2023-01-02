/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @returns {import("../file/context").GenerateFile}
 */
export function validatorJavascriptGetFile(
  generateContext: import("../generate").GenerateContext,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
): import("../file/context").GenerateFile;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorJavascriptGetNameAndImport(
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
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
export function validatorJavascriptStartValidator(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  validatorState: import("../validators/generator").ValidatorState,
): void;
/**
 * Exit validation function, determines if an error or the value is returned.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptStopValidator(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 * Do the nil check, allowNull and defaultValue handling.
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("./generator").ValidatorState} validatorState
 * @param {{ isOptional: boolean, allowNull: boolean, defaultValue?: string }} options
 */
export function validatorJavascriptNilCheck(
  file: import("../file/context").GenerateFile,
  validatorState: import("./generator").ValidatorState,
  options: {
    isOptional: boolean;
    allowNull: boolean;
    defaultValue?: string;
  },
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalAnyDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptAny(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalAnyDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalAnyOfDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptAnyOf(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalAnyOfDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalArrayDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptArray(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalArrayDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalBooleanDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptBoolean(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalBooleanDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalDateDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptDate(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalDateDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalFileDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptFile(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalFileDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalGenericDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptGeneric(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalGenericDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalNumberDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptNumber(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalNumberDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptObject(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalObjectDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalReferenceDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptReference(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalReferenceDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalStringDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptString(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalStringDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalUuidDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptUuid(
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalUuidDefinition,
  validatorState: import("./generator").ValidatorState,
): void;
/**
 * Finish the else block for nil checks.
 *
 * @param {import("../file/context").GenerateFile} file
 */
export function validatorJavascriptFinishElseBlock(
  file: import("../file/context").GenerateFile,
): void;
//# sourceMappingURL=javascript.d.ts.map
