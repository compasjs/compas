/**
 * Add a cache entry for the type and its options to resolve to the generated type name.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @param {import("./generator.js").GenerateTypeOptions} options
 * @param {string} name
 */
export function typesCacheAdd(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
  options: import("./generator.js").GenerateTypeOptions,
  name: string,
): void;
/**
 * Get a cache entry for the type and its option to resolve the generated type name if it
 * already exists.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @param {import("./generator.js").GenerateTypeOptions} options
 * @returns {string|undefined} name
 */
export function typesCacheGet(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
  options: import("./generator.js").GenerateTypeOptions,
): string | undefined;
/**
 * Get the already used type names for the provided type.
 *
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @returns {string[]}
 */
export function typesCacheGetUsedNames(
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
): string[];
//# sourceMappingURL=cache.d.ts.map
