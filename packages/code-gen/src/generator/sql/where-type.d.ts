/**
 * Creates a where type and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createWhereTypes(context: CodeGenContext): void;
/**
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
export function getWherePartial(
  context: CodeGenContext,
  imports: any,
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
