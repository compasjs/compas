/**
 * Get the owned relations of the provided models.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition[]}
 */
export function modelGetOwnRelations(
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): import("../generated/common/types").ExperimentalRelationDefinition[];
/**
 * Get the inverse relations of the provided models.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types").ExperimentalRelationDefinition[]}
 */
export function modelGetInverseRelations(
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): import("../generated/common/types").ExperimentalRelationDefinition[];
/**
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelBuildRelationCache(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * @param {import("../generated/common/types").ExperimentalRelationDefinition} relation
 * @returns {{
 *   modelOwn:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 *   modelInverse:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 *   relationOwn:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 *   relationInverse:
 *   import("../generated/common/types").ExperimentalObjectDefinition,
 * }}
 */
export function modelResolveRelation(
  relation: import("../generated/common/types").ExperimentalRelationDefinition,
): {
  modelOwn: import("../generated/common/types").ExperimentalObjectDefinition;
  modelInverse: import("../generated/common/types").ExperimentalObjectDefinition;
  relationOwn: import("../generated/common/types").ExperimentalObjectDefinition;
  relationInverse: import("../generated/common/types").ExperimentalObjectDefinition;
};
//# sourceMappingURL=model-relation.d.ts.map
