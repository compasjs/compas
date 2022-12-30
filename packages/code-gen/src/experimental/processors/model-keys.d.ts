/**
 * Add or resolve the primary key of a model.
 *
 * It tries to find the existing primary key. If it can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelKeyAddPrimary(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Add default date keys to the structureModels.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelKeyAddDateKeys(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Get the primary key information of a model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition:
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * }}
 */
export function modelKeyGetPrimary(
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): {
  primaryKeyName: string;
  primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeSystemDefinition;
};
/**
 * Get the searchable model keys for the provided model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {string[]}
 */
export function modelKeyGetSearchable(
  generateContext: import("../generate").GenerateContext,
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): string[];
//# sourceMappingURL=model-keys.d.ts.map
