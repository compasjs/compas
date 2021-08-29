/**
 * Creates the partial types for inserts and updates and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createPartialTypes(context: CodeGenContext): void;
/**
 * Adds builder to reuse inserts
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getInsertPartial(context: CodeGenContext, type: CodeGenObjectType): string;
/**
 * Adds builder to reuse updates
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getUpdatePartial(context: CodeGenContext, type: CodeGenObjectType): string;
//# sourceMappingURL=partial-type.d.ts.map