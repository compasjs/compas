/**
 * @typedef {import("../utils").ImportCreator} ImportCreator
 */
/**
 * Generate query builders that include relations in to the query result via left joins
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryBuilder(context: CodeGenContext, imports: ImportCreator, type: CodeGenObjectType, src: string[]): void;
/**
 * Generate the necessary query builder types
 *
 * @param {CodeGenContext} context
 */
export function createQueryBuilderTypes(context: CodeGenContext): void;
export type ImportCreator = import("../utils").ImportCreator;
//# sourceMappingURL=query-builder.d.ts.map