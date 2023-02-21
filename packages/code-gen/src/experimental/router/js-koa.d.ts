/**
 * Get the router file for the provided group
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function jsKoaGetRouterFile(
  generateContext: import("../generate").GenerateContext,
): import("../file/context.js").GenerateFile;
/**
 * Get the controller file for the provided group
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {string} group
 */
export function jsKoaGetControllerFile(
  generateContext: import("../generate").GenerateContext,
  group: string,
): import("../file/context.js").GenerateFile;
/**
 * Create Ctx & Fn types
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @param {Record<string, string>} contextNames
 */
export function jsKoaPrepareContext(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  route: import("../generated/common/types").ExperimentalRouteDefinition,
  contextNames: Record<string, string>,
): void;
/**
 * @param {import("../file/context").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types").ExperimentalRouteDefinition[]} routes
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaWriteHandlers(
  file: import("../file/context").GenerateFile,
  group: string,
  routes: import("../generated/common/types").ExperimentalRouteDefinition[],
  contextNamesMap: Map<any, Record<string, string>>,
): void;
/**
 * @param {import("../file/context").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types").ExperimentalRouteDefinition[]} routes
 */
export function jsKoaWriteTags(
  file: import("../file/context").GenerateFile,
  group: string,
  routes: import("../generated/common/types").ExperimentalRouteDefinition[],
): void;
/**
 * @param {import("../file/context").GenerateFile} file
 * @param {Record<string, import("../generated/common/types").ExperimentalRouteDefinition[]>} routesPerGroup
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaBuildRouterFile(
  file: import("../file/context").GenerateFile,
  routesPerGroup: Record<
    string,
    import("../generated/common/types").ExperimentalRouteDefinition[]
  >,
  contextNamesMap: Map<any, Record<string, string>>,
): void;
/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function jsKoaRegisterCompasStructureRoute(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
): void;
//# sourceMappingURL=js-koa.d.ts.map
