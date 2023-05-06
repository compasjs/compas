/**
 * Recursively check which targets are used by the provided type, including the
 * references.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").ExperimentalTypeSystemDefinition} type
 * @returns {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]}
 */
export function typeTargetsDetermine(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").ExperimentalTypeSystemDefinition,
): import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[];
/**
 * Filter out the targets that will be used based on the targets that the type provides
 * special handling for and which targets can be used by the provider.
 *
 * Does not alter the order of the provided {@link usedTargetsByGenerator} array.
 *
 * @param {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]} availableTargetsInType
 * @param {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]} usedTargetsByGenerator
 * @returns {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]}
 */
export function typeTargetsGetUsed(
  availableTargetsInType: import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[],
  usedTargetsByGenerator: import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[],
): import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[];
//# sourceMappingURL=targets.d.ts.map
