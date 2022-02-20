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
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function setupMemoizedTypes(
  context: import("../generated/common/types").CodeGenContext,
): void;
/**
 * Use the memoized types and the provided settings to create a new type
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 * @param {CodeGenType} type
 * @param {string} suffix
 * @param {CodeGenTypeSettings} settings
 */
export function getTypeNameForType(
  context: import("../generated/common/types").CodeGenContext,
  type: CodeGenType,
  suffix: string,
  settings: CodeGenTypeSettings,
): any;
/**
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function generateTypeFile(
  context: import("../generated/common/types").CodeGenContext,
): void;
/**
 * @param {import("../generated/common/types").CodeGenContext} context
 * @param {CodeGenType} type
 * @param {CodeGenTypeSettings} settings
 */
export function generateTypeDefinition(
  context: import("../generated/common/types").CodeGenContext,
  type: CodeGenType,
  {
    isJSON,
    useConvert,
    useDefaults,
    useTypescript,
    isCommonFile,
    isTypeFile,
    isNode,
    isBrowser,
    suffix,
    fileTypeIO,
  }?: CodeGenTypeSettings,
): any;
//# sourceMappingURL=types.d.ts.map
