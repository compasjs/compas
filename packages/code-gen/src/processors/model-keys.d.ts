/**
 * Add or resolve the primary key of a model.
 *
 * It tries to find the existing primary key. If it can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function modelKeyAddPrimary(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Add default date keys to the structureModels.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function modelKeyAddDateKeys(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Get the primary key information of a model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generated/common/types.js").StructureObjectDefinition} model
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition:
 *   import("../generated/common/types.js").StructureTypeSystemDefinition
 * }}
 */
export function modelKeyGetPrimary(
  model: import("../generated/common/types.js").StructureObjectDefinition,
): {
  primaryKeyName: string;
  primaryKeyDefinition: import("../generated/common/types.js").StructureTypeSystemDefinition;
};
/**
 * Get the searchable model keys for the provided model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureObjectDefinition} model
 * @returns {string[]}
 */
export function modelKeyGetSearchable(
  generateContext: import("../generate.js").GenerateContext,
  model: import("../generated/common/types.js").StructureObjectDefinition,
): string[];
//# sourceMappingURL=model-keys.d.ts.map
