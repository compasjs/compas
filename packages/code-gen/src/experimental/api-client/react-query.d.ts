/**
 * Write wrapper context to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function reactQueryGenerateCommonFile(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Get the api client file
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function reactQueryGetApiClientFile(
  generateContext: import("../generate").GenerateContext,
  route: import("../generated/common/types").ExperimentalRouteDefinition,
): import("../file/context").GenerateFile;
/**
 * Generate the api client hooks
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function reactQueryGenerateFunction(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  route: import("../types").NamedType<
    import("../generated/common/types").ExperimentalRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=react-query.d.ts.map
