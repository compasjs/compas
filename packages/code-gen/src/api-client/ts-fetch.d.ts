/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function tsFetchGenerateCommonFile(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Get a specific api client file.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureRouteDefinition} route
 * @returns {import("../file/context.js").GenerateFile}
 */
export function tsFetchGetApiClientFile(
  generateContext: import("../generate.js").GenerateContext,
  route: import("../generated/common/types.js").StructureRouteDefinition,
): import("../file/context.js").GenerateFile;
/**
 * Generate the api client function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function tsFetchGenerateFunction(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  route: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").StructureRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=ts-fetch.d.ts.map
