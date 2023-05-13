/**
 * Add a specific type to the structure. By default, directly normalizes references and
 * extracts them via {@link structureExtractReferences}.
 *
 * This function can be used all over the generation process, to optimize cases where
 * references are already normalized, it supports to skip reference extraction.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureNamedTypeDefinition} type
 * @param {{ skipReferenceExtraction: boolean }} options
 */
export function structureAddType(
  structure: import("../generated/common/types.js").StructureStructure,
  type: import("../generated/common/types.js").StructureNamedTypeDefinition,
  options: {
    skipReferenceExtraction: boolean;
  },
): void;
/**
 * Returns an array of all the named types in the provided structure.
 * Can be used to iterate over the full structure, without using nested loops
 *
 * ```
 * // Without this function.
 * for (const group of Object.keys(structure)) {
 *   for (const name of Object.keys(structure[group])) {
 *     const namedType = structure[group][name];
 *   }
 * }
 *
 * // Can be written as
 * for (const namedType of structureNamedTypes(structure) {
 *
 * }
 * ```
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @returns {(import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureNamedTypeDefinition>)[]}
 */
export function structureNamedTypes(
  structure: import("../generated/common/types.js").StructureStructure,
): import("../../types/advanced-types").NamedType<
  import("../generated/common/types").StructureNamedTypeDefinition
>[];
/**
 * Extract a selection of groups from the provided structure. This function resolves
 * references that point to not included groups and will try to include them.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {string[]} groups
 * @returns {import("../generated/common/types.js").StructureStructure}
 */
export function structureExtractGroups(
  structure: import("../generated/common/types.js").StructureStructure,
  groups: string[],
): import("../generated/common/types.js").StructureStructure;
/**
 * Check if all references in the current structure resolve. Will try to collect as much
 * errors as possible before throwing a combined error via {@link
 * errorsThrowCombinedError}.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 */
export function structureValidateReferences(
  structure: import("../generated/common/types.js").StructureStructure,
): void;
/**
 * Resolve the provided reference.
 *
 * Throws if the provided value is not a reference or if the reference can not be
 * resolved.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} reference
 * @returns {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureNamedTypeDefinition>}
 */
export function structureResolveReference(
  structure: import("../generated/common/types.js").StructureStructure,
  reference: import("../generated/common/types.js").StructureTypeDefinition,
): import("../../types/advanced-types").NamedType<
  import("../generated/common/types").StructureNamedTypeDefinition
>;
/**
 * Create a new reference to the provided group and name.
 *
 * @param {string} group
 * @param {string} name
 * @returns {import("../generated/common/types.js").StructureReferenceDefinition}
 */
export function structureCreateReference(
  group: string,
  name: string,
): import("../generated/common/types.js").StructureReferenceDefinition;
/**
 * Copy and sort the structure. We do this for 2 reasons;
 * - It allows multiple generate calls within the same 'Generator', since we don't mutate
 * the original structure
 * - The JS iterators in Node.js are based on object insertion order, so this ensures
 * that our output is stable.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @returns {import("../generated/common/types.js").StructureStructure}
 */
export function structureCopyAndSort(
  structure: import("../generated/common/types.js").StructureStructure,
): import("../generated/common/types.js").StructureStructure;
/**
 * Recursively extract references from the provided type.
 *
 * Unlike the previous versions of code-gen we prefer to keep references as much as
 * possible and resolve them on the fly. This prevents weird recursion errors and should
 * simplify conditional logic down in the generators.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} type
 * @returns {void}
 */
export function structureExtractReferences(
  structure: import("../generated/common/types.js").StructureStructure,
  type: import("../generated/common/types.js").StructureTypeDefinition,
): void;
/**
 * Recursively add references that are necessary in the newStructure from the
 * fullStructure.
 *
 * This is used when extracting groups or specific types from the structure in to a new
 * structure. By resolving out of group references a valid structure is created.
 *
 * @param {import("../generated/common/types.js").StructureStructure} fullStructure
 * @param {import("../generated/common/types.js").StructureStructure} newStructure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} type
 */
export function structureIncludeReferences(
  fullStructure: import("../generated/common/types.js").StructureStructure,
  newStructure: import("../generated/common/types.js").StructureStructure,
  type: import("../generated/common/types.js").StructureTypeDefinition,
): void;
/**
 * Recursively validate references for the provided type.
 *
 * We do this early in the generation process to check the user input, and expect that
 * processors don't create invalid references.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} type
 */
export function structureValidateReferenceForType(
  structure: import("../generated/common/types.js").StructureStructure,
  type: import("../generated/common/types.js").StructureTypeDefinition,
): void;
//# sourceMappingURL=structure.d.ts.map
