/**
 * Creates a order by type and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createOrderByTypes(
  context: import("../../generated/common/types").CodeGenContext,
): void;
/**
 * A default ordering partial.
 * Working correctly, with or without dates. Supporting dynamic order by based on
 * searchable fields.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getOrderByPartial(
  context: import("../../generated/common/types").CodeGenContext,
  type: CodeGenObjectType,
): string;
//# sourceMappingURL=order-by-type.d.ts.map
