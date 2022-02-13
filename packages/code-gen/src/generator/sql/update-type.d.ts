/**
 * Creates an update type and assigns in to the object type for all query enabled objects.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createUpdateTypes(
  context: import("../../generated/common/types").CodeGenContext,
): void;
/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
export function getUpdateQuery(
  context: import("../../generated/common/types").CodeGenContext,
  imports: ImportCreator,
  type: CodeGenObjectType,
): string;
export namespace atomicUpdateFieldsTable {
  const boolean: string[];
  const number: string[];
  const string: string[];
  const date: string[];
  const jsonb: string[];
}
//# sourceMappingURL=update-type.d.ts.map
