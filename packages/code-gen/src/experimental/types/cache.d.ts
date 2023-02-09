/**
 * Add a cache entry for the type and its options to resolve to the generated type name.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @param {string} name
 */
export function typesCacheAdd(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  options: import("./generator").GenerateTypeOptions,
  name: string,
): void;
/**
 * Get a cache entry for the type and its option to resolve the generated type name if it
 * already exists.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string|undefined} name
 */
export function typesCacheGet(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  options: import("./generator").GenerateTypeOptions,
): string | undefined;
/**
 * Get the already used type names for the provided type.
 *
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @returns {string[]}
 */
export function typesCacheGetUsedNames(
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
): string[];
//# sourceMappingURL=cache.d.ts.map
