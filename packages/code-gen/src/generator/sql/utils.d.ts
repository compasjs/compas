/**
 * This short name is used in the default basic queries an can be overwritten / used in
 * other queries
 *
 * @param {CodeGenContext} context
 */
export function addShortNamesToQueryEnabledObjects(context: CodeGenContext): void;
/**
 * @param {CodeGenContext} context
 * @returns {CodeGenObjectType[]}
 */
export function getQueryEnabledObjects(context: CodeGenContext): CodeGenObjectType[];
/**
 * Get primary key of object type.
 * If not exists, throw nicely.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function staticCheckPrimaryKey(context: CodeGenContext, type: CodeGenObjectType): void;
/**
 * Get primary key of object type.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {CodeGenObjectType} type
 * @returns {{ key: string, field: CodeGenType }}
 */
export function getPrimaryKeyWithType(type: CodeGenObjectType): {
    key: string;
    field: CodeGenType;
};
/**
 * Returns a sorted list of key names for the provided object type
 * - Primary keys
 * - Non nullable fields
 * - Nullable fields
 * - createdAt, updatedAt, deletedAt
 *
 * @param {CodeGenObjectType} type
 * @returns {string[]}
 */
export function getSortedKeysForType(type: CodeGenObjectType): string[];
/**
 * Statically check if objects are correctly setup do have queries enabled.
 *
 * @param {CodeGenContext} context
 */
export function doSqlChecks(context: CodeGenContext): void;
//# sourceMappingURL=utils.d.ts.map