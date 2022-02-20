/**
 * Generate all useful query partials
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryPartials(
  context: import("../../generated/common/types").CodeGenContext,
  imports: import("../utils").ImportCreator,
  type: CodeGenObjectType,
  src: string[],
): void;
/**
 * Static field in set check function
 *
 * @returns {string}
 */
export function knownFieldsCheckFunction(): string;
/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getFieldSet(
  context: import("../../generated/common/types").CodeGenContext,
  type: CodeGenObjectType,
): string;
/**
 * A list of fields for the provided type, with dynamic tableName
 *
 * @property {import("../../generated/common/types").CodeGenContext} context
 * @property {CodeGenObjectType} type
 * @returns {string}
 */
export function getFieldsPartial(context: any, type: any): string;
//# sourceMappingURL=query-partials.d.ts.map
