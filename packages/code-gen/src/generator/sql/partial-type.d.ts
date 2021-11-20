/**
 * Creates the partial types for inserts and updates and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createPartialTypes(
  context: import("../../generated/common/types").CodeGenContext,
): void;
/**
 * Adds builder to reuse inserts
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getInsertPartial(
  context: import("../../generated/common/types").CodeGenContext,
  type: CodeGenObjectType,
): string;
/**
 * Adds builder to reuse updates
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getUpdatePartial(
  context: import("../../generated/common/types").CodeGenContext,
  type: CodeGenObjectType,
): string;
//# sourceMappingURL=partial-type.d.ts.map
