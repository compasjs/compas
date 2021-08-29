/**
 * Creates a order by type and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createOrderByTypes(context: CodeGenContext): void;
/**
 * A default ordering partial.
 * Working correctly, with or without dates. Supporting dynamic order by based on
 * searchable fields.
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getOrderByPartial(context: CodeGenContext, type: CodeGenObjectType): string;
//# sourceMappingURL=order-by-type.d.ts.map