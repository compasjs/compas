/**
 * Resolve the `types.d.ts` output file.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {import("../file/context").GenerateFile}
 */
export function typesTypescriptResolveFile(
  generateContext: import("../generate").GenerateContext,
): import("../file/context").GenerateFile;
/**
 * Create the `types.d.ts` output file. The base settings of the
 * {@link import("../file/context").GenerateFile} align with the Typescript output.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {import("../file/context").GenerateFile}
 */
export function typesTypescriptInitFile(
  generateContext: import("../generate").GenerateContext,
): import("../file/context").GenerateFile;
/**
 * Start a `declare global` block to generate all types in the global namespace. This is
 * only a good fit in the end result of an application, where TS in JSDoc is used,
 * preventing a bunch of unnecessary inline imports.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptStartDeclareGlobal(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
): void;
/**
 * End global type declarations if necessary.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptEndDeclareGlobal(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
): void;
/**
 * Since we always start the types file, we need to check if we declared any types. When
 * we don't have any types, the type generator will remove this file.
 *
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptHasDeclaredTypes(
  file: import("../file/context").GenerateFile,
): boolean;
/**
 * Add a named type to the output.
 *
 * When generating TS types, we need to make sure that referenced types are resolved
 * earlier, since references need this to format their reference name.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("./generator").GenerateTypeOptions} options
 */
export function typesTypescriptGenerateNamedType(
  generateContext: import("../generate").GenerateContext,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  options: import("./generator").GenerateTypeOptions,
): void;
/**
 * Format and write the type. Uses inline writes where possible.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {void}
 */
export function typesTypescriptFormatType(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  options: import("./generator").GenerateTypeOptions,
): void;
//# sourceMappingURL=typescript.d.ts.map