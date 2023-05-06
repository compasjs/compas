/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function jsFetchGenerateCommonFile(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").ExperimentalRouteDefinition} route
 * @returns {import("../file/context.js").GenerateFile}
 */
export function jsFetchGetApiClientFile(
  generateContext: import("../generate.js").GenerateContext,
  route: import("../generated/common/types.js").ExperimentalRouteDefinition,
): import("../file/context.js").GenerateFile;
/**
 * Generate the api client function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function jsFetchGenerateFunction(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  route: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=js-fetch.d.ts.map
