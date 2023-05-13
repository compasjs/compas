/**
 * @typedef {object} GenerateTypeOptions
 * @property {"input"|"output"} validatorState
 * @property {{
 *   input: string,
 *   output: string,
 * }} nameSuffixes
 * @property {(import("../generated/common/types.d.ts").StructureAnyDefinitionTarget
 *  )[]} targets
 */
/**
 * Init the types generator. It doesn't necessary need to be enabled, cause other
 * generators will automatically add types when necessary.
 *
 * TODO: expand docs
 *
 * - supported targets
 * -
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function typesGeneratorInit(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Finalize the generated file.
 * It also checks if types where added to this file. When no types are added, we remove
 * it from the generateContext.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function typesGeneratorFinalize(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * This does not return a way to use a type, this will be added later.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
 * >} type
 * @param {GenerateTypeOptions} options
 */
export function typesGeneratorGenerateNamedType(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureTypeSystemDefinition
  >,
  options: GenerateTypeOptions,
): void;
/**
 * Use the provided type name in the provided file
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesGeneratorUseTypeName(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  name: string,
): string;
export type GenerateTypeOptions = {
  validatorState: "input" | "output";
  nameSuffixes: {
    input: string;
    output: string;
  };
  targets: import("../generated/common/types.d.ts").StructureAnyDefinitionTarget[];
};
//# sourceMappingURL=generator.d.ts.map
