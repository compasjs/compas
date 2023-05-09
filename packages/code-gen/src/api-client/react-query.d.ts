/**
 * Write wrapper context to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function reactQueryGenerateCommonFile(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Get the api client file
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").ExperimentalRouteDefinition} route
 * @returns {import("../file/context.js").GenerateFile}
 */
export function reactQueryGetApiClientFile(
  generateContext: import("../generate.js").GenerateContext,
  route: import("../generated/common/types.js").ExperimentalRouteDefinition,
): import("../file/context.js").GenerateFile;
/**
 * Generate the api client hooks
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function reactQueryGenerateFunction(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  route: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").ExperimentalRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=react-query.d.ts.map
