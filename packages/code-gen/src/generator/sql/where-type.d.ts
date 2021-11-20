/**
 * Creates a where type and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createWhereTypes(
  context: import("../../generated/common/types").CodeGenContext,
): void;
/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
export function getWherePartial(
  context: import("../../generated/common/types").CodeGenContext,
  imports: ImportCreator,
  type: CodeGenObjectType,
): string;
/**
 * Returns an object with only the searchable fields
 *
 * @param {CodeGenObjectType} type
 * @returns {Record<string, CodeGenType>}
 */
export function getSearchableFields(
  type: CodeGenObjectType,
): Record<string, CodeGenType>;
//# sourceMappingURL=where-type.d.ts.map
