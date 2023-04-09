/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function tsFetchGenerateCommonFile(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Get a specific api client file.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function tsFetchGetApiClientFile(
  generateContext: import("../generate").GenerateContext,
  route: import("../generated/common/types").ExperimentalRouteDefinition,
): import("../file/context").GenerateFile;
/**
 * Generate the api client function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function tsFetchGenerateFunction(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  route: import("../types").NamedType<
    import("../generated/common/types").ExperimentalRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=ts-fetch.d.ts.map
