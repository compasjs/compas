/**
 * Add a specific type to the structure
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {import("./generated/common/types").ExperimentalNamedTypeDefinition} type
 * @param {{ skipReferencesCheck: boolean }} options
 */
export function structureAddType(
  structure: import("./generated/common/types").ExperimentalStructure,
  type: import("./generated/common/types").ExperimentalNamedTypeDefinition,
  options: {
    skipReferencesCheck: boolean;
  },
): void;
/**
 * Returns an array of all the named types in the provided structure
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @returns {import("./generated/common/types").ExperimentalNamedTypeDefinition[]}
 */
export function structureNamedTypes(
  structure: import("./generated/common/types").ExperimentalStructure,
): import("./generated/common/types").ExperimentalNamedTypeDefinition[];
/**
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {string[]} groups
 * @returns {import("./generated/common/types").ExperimentalStructure}
 */
export function structureExtractGroups(
  structure: import("./generated/common/types").ExperimentalStructure,
  groups: string[],
): import("./generated/common/types").ExperimentalStructure;
/**
 * Top down extract references from the provided type. Unlike the previous versions of
 * code-gen we prefer to keep references as much as possible and resolve them on the fly
 * while generating if necessary.
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {import("./generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureExtractReferences(
  structure: import("./generated/common/types").ExperimentalStructure,
  type: import("./generated/common/types").ExperimentalTypeDefinition,
): void;
/**
 * Include all references referenced by type in to the new structure.
 *
 * @param {import("./generated/common/types").ExperimentalStructure} fullStructure
 * @param {import("./generated/common/types").ExperimentalStructure} newStructure
 * @param {import("./generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureIncludeReferences(
  fullStructure: import("./generated/common/types").ExperimentalStructure,
  newStructure: import("./generated/common/types").ExperimentalStructure,
  type: import("./generated/common/types").ExperimentalTypeDefinition,
): void;
//# sourceMappingURL=structure.d.ts.map
