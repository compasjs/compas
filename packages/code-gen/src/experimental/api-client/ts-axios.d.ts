/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function tsAxiosGenerateCommonFile(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function tsAxiosGetApiClientFile(
  generateContext: import("../generate").GenerateContext,
  route: import("../generated/common/types").ExperimentalRouteDefinition,
): import("../file/context").GenerateFile;
/**
 * Generate the api client function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalGenerateOptions["generators"]["apiClient"]} options
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function tsAxiosGenerateFunction(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  options: import("../generated/common/types").ExperimentalGenerateOptions["generators"]["apiClient"],
  route: import("../types").NamedType<
    import("../generated/common/types").ExperimentalRouteDefinition
  >,
  contextNames: Record<string, string>,
): void;
//# sourceMappingURL=ts-axios.d.ts.map
