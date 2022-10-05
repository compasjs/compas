/**
 * Add a specific type to the structure
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalNamedTypeDefinition} type
 * @param {{ skipReferenceExtraction: boolean }} options
 */
export function structureAddType(
  structure: import("../generated/common/types").ExperimentalStructure,
  type: import("../generated/common/types").ExperimentalNamedTypeDefinition,
  options: {
    skipReferenceExtraction: boolean;
  },
): void;
/**
 * Returns an array of all the named types in the provided structure
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @returns {import("../generated/common/types").ExperimentalNamedTypeDefinition[]}
 */
export function structureNamedTypes(
  structure: import("../generated/common/types").ExperimentalStructure,
): import("../generated/common/types").ExperimentalNamedTypeDefinition[];
/**
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {string[]} groups
 * @returns {import("../generated/common/types").ExperimentalStructure}
 */
export function structureExtractGroups(
  structure: import("../generated/common/types").ExperimentalStructure,
  groups: string[],
): import("../generated/common/types").ExperimentalStructure;
/**
 * Check if all references in the current structure resolve
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 */
export function structureValidateReferences(
  structure: import("../generated/common/types").ExperimentalStructure,
): void;
/**
 * Resolve the provided reference
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} reference
 * @returns {import("../generated/common/types").ExperimentalNamedTypeDefinition}
 */
export function structureResolveReference(
  structure: import("../generated/common/types").ExperimentalStructure,
  reference: import("../generated/common/types").ExperimentalTypeDefinition,
): import("../generated/common/types").ExperimentalNamedTypeDefinition;
/**
 * Copy and sort the structure. We do this for 2 reasons;
 * - It allows multiple generate calls within the same 'Generator'
 * - The JS iterators in Node.js are based on object insertion order, so this ensures
 * that our output is stable.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @returns {import("../generated/common/types").ExperimentalStructure}
 */
export function structureCopyAndSort(
  structure: import("../generated/common/types").ExperimentalStructure,
): import("../generated/common/types").ExperimentalStructure;
/**
 * Top down extract references from the provided type. Unlike the previous versions of
 * code-gen we prefer to keep references as much as possible and resolve them on the fly
 * while generating if necessary.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureExtractReferences(
  structure: import("../generated/common/types").ExperimentalStructure,
  type: import("../generated/common/types").ExperimentalTypeDefinition,
): void;
/**
 * Include all references referenced by type in to the new structure.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} fullStructure
 * @param {import("../generated/common/types").ExperimentalStructure} newStructure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureIncludeReferences(
  fullStructure: import("../generated/common/types").ExperimentalStructure,
  newStructure: import("../generated/common/types").ExperimentalStructure,
  type: import("../generated/common/types").ExperimentalTypeDefinition,
): void;
/**
 * Recursively check if all references used by the provided type can be resolved.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 * @param {string[]} parentTypeStack
 */
export function structureValidateReferenceForType(
  structure: import("../generated/common/types").ExperimentalStructure,
  type: import("../generated/common/types").ExperimentalTypeDefinition,
  parentTypeStack: string[],
): void;
//# sourceMappingURL=01-structure.d.ts.map
