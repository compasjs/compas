/**
 * Resolve the `types.d.ts` output file.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {import("../file/context.js").GenerateFile}
 */
export function typesTypescriptResolveFile(
  generateContext: import("../generate.js").GenerateContext,
): import("../file/context.js").GenerateFile;
/**
 * Create the `types.d.ts` output file. The base settings of the
 * {@link import("../file/context.js").GenerateFile} align with the Typescript output.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {import("../file/context.js").GenerateFile}
 */
export function typesTypescriptInitFile(
  generateContext: import("../generate.js").GenerateContext,
): import("../file/context.js").GenerateFile;
/**
 * Start a `declare global` block to generate all types in the global namespace. This is
 * only a good fit in the end result of an application, where TS in JSDoc is used,
 * preventing a bunch of unnecessary inline imports.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 */
export function typesTypescriptStartDeclareGlobal(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
): void;
/**
 * End global type declarations if necessary.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 */
export function typesTypescriptEndDeclareGlobal(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
): void;
/**
 * Since we always start the types file, we need to check if we declared any types. When
 * we don't have any types, the type generator will remove this file.
 *
 * @param {import("../file/context.js").GenerateFile} file
 */
export function typesTypescriptHasDeclaredTypes(
  file: import("../file/context.js").GenerateFile,
): boolean;
/**
 * Add a named type to the output.
 *
 * When generating TS types, we need to make sure that referenced types are resolved
 * earlier, since references need this to format their reference name.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("./generator.js").GenerateTypeOptions} options
 */
export function typesTypescriptGenerateNamedType(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  options: import("./generator.js").GenerateTypeOptions,
): void;
/**
 * Format and write the type. Uses inline writes where possible.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator.js").GenerateTypeOptions} options
 * @returns {void}
 */
export function typesTypescriptFormatType(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../generated/common/types.js").ExperimentalTypeSystemDefinition,
  options: import("./generator.js").GenerateTypeOptions,
): void;
/**
 * Use the provided name in Typescript
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesTypescriptUseTypeName(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  name: string,
): string;
//# sourceMappingURL=typescript.d.ts.map
