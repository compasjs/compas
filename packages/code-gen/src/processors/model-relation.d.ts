/**
 * Get the owned relations of the provided model. The 'relation.ownKey' of these
 * relations is a field on the model that it belongs to.
 *
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types.js").ExperimentalRelationDefinition[]}
 */
export function modelRelationGetOwn(
  model: import("../generated/common/types.js").ExperimentalObjectDefinition,
): import("../generated/common/types.js").ExperimentalRelationDefinition[];
/**
 * Get the inverse relations of the provided model. The 'relation.ownKey' is a virtual
 * key on this model, which is not populated by default.
 *
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} model
 * @returns {import("../generated/common/types.js").ExperimentalRelationDefinition[]}
 */
export function modelRelationGetInverse(
  model: import("../generated/common/types.js").ExperimentalObjectDefinition,
): import("../generated/common/types.js").ExperimentalRelationDefinition[];
/**
 * Get the related information for the provided relation.
 * This object is always built through the eyes of the owning model. So when an inverse
 * relation is passed in, the 'modelOwn' will be of the owning side.
 *
 * By returning both models and both relations, other code only needs to pass in a
 * relation to get the full picture.
 *
 * @param {import("../generated/common/types.js").ExperimentalRelationDefinition} relation
 * @returns {ModelRelationInformation}
 */
export function modelRelationGetInformation(
  relation: import("../generated/common/types.js").ExperimentalRelationDefinition,
): ModelRelationInformation;
/**
 * Follow all relations of each model;
 *
 * - Checks all named types for invalid `.relations()` usages. These relations are not
 * checked or used.
 * - Check if the relation resolves to its inverse or own relation
 * - Add the inverse relation of a `oneToOne` -> `oneToOneReverse`
 * - Check if the referenced model has enabled queries
 * - Error on unnecessary or invalid relations
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationCheckAllRelations(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Add keys to the models that are needed by relations. This assumes that all relations
 * exist and are valid.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationAddKeys(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Prime the relation cache. This way sub functions can just pass a relation to
 * 'modelRelationGetInformation' and get all related information.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelRelationBuildRelationInformationCache(
  generateContext: import("../generate.js").GenerateContext,
): void;
export type ModelRelationInformation = {
  modelOwn: import("../generated/common/types.js").ExperimentalObjectDefinition;
  modelInverse: import("../generated/common/types").ExperimentalObjectDefinition;
  relationOwn: import("../generated/common/types").ExperimentalRelationDefinition;
  relationInverse: import("../generated/common/types").ExperimentalRelationDefinition;
  keyNameOwn: string;
  keyDefinitionOwn: import("../generated/common/types").ExperimentalTypeSystemDefinition;
  virtualKeyNameInverse: string;
  primaryKeyNameInverse: string;
  primaryKeyDefinitionInverse: import("../generated/common/types").ExperimentalTypeSystemDefinition;
};
//# sourceMappingURL=model-relation.d.ts.map
