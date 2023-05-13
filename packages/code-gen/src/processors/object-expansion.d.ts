/**
 * Run through all object expansion types.
 *
 * - Extends existing types via `extend`
 * - Replaces `pick` and `omit` with their evaluated object
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function objectExpansionExecute(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Extend named objects for each 'extend' in the structure.
 *
 * The 'extend' type is then removed from the structure, as it doesn't serve a purpose
 * anymore.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionExtend(
  structure: import("../generated/common/types.js").StructureStructure,
  namedType: import("../generated/common/types.js").StructureTypeDefinition,
): void;
/**
 * Replace 'omit' types with an object definition without the omitted keys.
 *
 * This function alters the type in place, creating a shallow copy of the source objects
 * keys.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionOmit(
  structure: import("../generated/common/types.js").StructureStructure,
  namedType: import("../generated/common/types.js").StructureTypeDefinition,
): void;
/**
 * Replace 'pick' types with an object definition only including the picked keys
 *
 * This function alters the type in place, creating a shallow copy of the source objects
 * keys.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionPick(
  structure: import("../generated/common/types.js").StructureStructure,
  namedType: import("../generated/common/types.js").StructureTypeDefinition,
): void;
//# sourceMappingURL=object-expansion.d.ts.map
