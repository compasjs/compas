/**
 * Generate query builders that include relations in to the query result via left joins
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryBuilder(
  context: import("../../generated/common/types").CodeGenContext,
  imports: import("../utils").ImportCreator,
  type: CodeGenObjectType,
  src: string[],
): void;
/**
 * Generate the necessary query builder types
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createQueryBuilderTypes(
  context: import("../../generated/common/types").CodeGenContext,
): void;
//# sourceMappingURL=query-builder.d.ts.map
