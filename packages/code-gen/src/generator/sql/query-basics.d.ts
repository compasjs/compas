/**
 * @typedef {import("../utils").ImportCreator} ImportCreator
 */
/**
 * Generate the basic CRUD queries
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 * @returns {void}
 */
export function generateBaseQueries(
  context: import("../../generated/common/types").CodeGenContext,
  imports: ImportCreator,
  type: CodeGenObjectType,
  src: string[],
): void;
export type ImportCreator = import("../utils").ImportCreator;
//# sourceMappingURL=query-basics.d.ts.map
