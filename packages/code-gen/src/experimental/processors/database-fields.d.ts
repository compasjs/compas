/**
 * Add or resolve the primary key of query enabled objects.
 *
 * It tries to find the existing primary key. If it i can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseFieldsAddPrimaryKey(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Add default date fields to the query enabled objects.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseFieldsAddDateFields(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} namedType
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition
 * }}
 */
export function databaseFieldGetPrimaryKey(
  namedType: import("../generated/common/types").ExperimentalObjectDefinition,
): {
  primaryKeyName: string;
  primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition;
};
//# sourceMappingURL=database-fields.d.ts.map
