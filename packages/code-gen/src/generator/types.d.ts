/**
 * @typedef {import("../../../../types/generated/common/types").CodeGenContext & {
 *   types: any,
 * }} CodeGenContext
 */
/**
 * @param options
 * @returns {{apiInput: string, apiResponse: string}}
 */
export function getTypeSuffixForUseCase(options: any): {
    apiInput: string;
    apiResponse: string;
};
/**
 * Setup stores for memoized types, so we can reuse types if necessary
 *
 * @param {CodeGenContext} context
 */
export function setupMemoizedTypes(context: CodeGenContext): void;
/**
 * Use the memoized types and the provided settings to create a new type
 *
 * @param {CodeGenContext} context
 * @param {CodeGenType} type
 * @param {string} suffix
 * @param {CodeGenTypeSettings} settings
 */
export function getTypeNameForType(context: CodeGenContext, type: CodeGenType, suffix: string, settings: CodeGenTypeSettings): any;
/**
 * @param {CodeGenContext} context
 */
export function generateTypeFile(context: CodeGenContext): void;
/**
 * @param {CodeGenContext} context
 * @param {CodeGenType} type
 * @param {CodeGenTypeSettings} settings
 */
export function generateTypeDefinition(context: CodeGenContext, type: CodeGenType, { isJSON, nestedIsJSON, useConvert, useDefaults, useTypescript, isNode, isBrowser, suffix, fileTypeIO, }?: CodeGenTypeSettings): any;
export type CodeGenContext = import("../../../../types/generated/common/types").CodeGenContext & {
    types: any;
};
//# sourceMappingURL=types.d.ts.map