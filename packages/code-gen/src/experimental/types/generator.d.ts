/**
 * @typedef {object} GenerateTypeOptions
 * @property {"input"|"output"} validatorState
 * @property {Partial<Record<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition["type"],
 *   string
 * >>} typeOverrides
 * @property {string} [nameSuffix]
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
 * @param {import("../generate").GenerateContext} generateContext
 */
export function typesGeneratorInit(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Finalize the generated file.
 * It also checks if types where added to this file. When no types are added, we remove
 * it from the generateContext.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function typesGeneratorFinalize(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * This does not return a way to use a type, this will be added later.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {GenerateTypeOptions} options
 */
export function typesGeneratorGenerateNamedType(
  generateContext: import("../generate").GenerateContext,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  options: GenerateTypeOptions,
): void;
/**
 * Use the provided type name in the provided file
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesGeneratorUseTypeName(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  name: string,
): string;
/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {boolean}
 */
export function typesGeneratorIsOptional(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  options: import("./generator").GenerateTypeOptions,
): boolean;
export type GenerateTypeOptions = {
  validatorState: "input" | "output";
  typeOverrides: Partial<
    Record<
      import("../generated/common/types").ExperimentalTypeSystemDefinition["type"],
      string
    >
  >;
  nameSuffix?: string | undefined;
};
//# sourceMappingURL=generator.d.ts.map
