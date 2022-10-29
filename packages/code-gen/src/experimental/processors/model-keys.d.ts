/**
 * Add or resolve the primary key of a model.
 *
 * It tries to find the existing primary key. If it can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelAddPrimaryKey(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Add default date keys to the structureModels.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelAddDateKeys(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Get the primary key information of model.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition
 * }}
 */
export function modelGetPrimaryKey(
  model: import("../generated/common/types").ExperimentalObjectDefinition,
): {
  primaryKeyName: string;
  primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition;
};
//# sourceMappingURL=model-keys.d.ts.map
