/**
 * Recursively check which targets are used by the provided type, including the
 * references.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @returns {import("../generated/common/types.js").StructureAnyDefinitionTarget[]}
 */
export function typeTargetsDetermine(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
): import("../generated/common/types.js").StructureAnyDefinitionTarget[];
/**
 * Filter out the targets that will be used based on the targets that the type provides
 * special handling for and which targets can be used by the provider.
 *
 * Does not alter the order of the provided {@link usedTargetsByGenerator} array.
 *
 * @param {import("../generated/common/types.js").StructureAnyDefinitionTarget[]} availableTargetsInType
 * @param {import("../generated/common/types.js").StructureAnyDefinitionTarget[]} usedTargetsByGenerator
 * @returns {import("../generated/common/types.js").StructureAnyDefinitionTarget[]}
 */
export function typeTargetsGetUsed(
  availableTargetsInType: import("../generated/common/types.js").StructureAnyDefinitionTarget[],
  usedTargetsByGenerator: import("../generated/common/types.js").StructureAnyDefinitionTarget[],
): import("../generated/common/types.js").StructureAnyDefinitionTarget[];
//# sourceMappingURL=targets.d.ts.map
