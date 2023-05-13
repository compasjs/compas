/**
 * Get the router file for the provided group
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function jsKoaGetRouterFile(
  generateContext: import("../generate.js").GenerateContext,
): import("../file/context.js").GenerateFile;
/**
 * Get the controller file for the provided group
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {string} group
 */
export function jsKoaGetControllerFile(
  generateContext: import("../generate.js").GenerateContext,
  group: string,
): import("../file/context.js").GenerateFile;
/**
 * Create Ctx & Fn types
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureRouteDefinition} route
 * @param {Record<string, string>} contextNames
 */
export function jsKoaPrepareContext(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  route: import("../generated/common/types.js").StructureRouteDefinition,
  contextNames: Record<string, string>,
): void;
/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types.js").StructureRouteDefinition[]} routes
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaWriteHandlers(
  file: import("../file/context.js").GenerateFile,
  group: string,
  routes: import("../generated/common/types.js").StructureRouteDefinition[],
  contextNamesMap: Map<any, Record<string, string>>,
): void;
/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} group
 * @param {import("../generated/common/types.js").StructureRouteDefinition[]} routes
 */
export function jsKoaWriteTags(
  file: import("../file/context.js").GenerateFile,
  group: string,
  routes: import("../generated/common/types.js").StructureRouteDefinition[],
): void;
/**
 * @param {import("../file/context.js").GenerateFile} file
 * @param {Record<string, import("../generated/common/types.js").StructureRouteDefinition[]>} routesPerGroup
 * @param {Map<any, Record<string, string>>} contextNamesMap
 */
export function jsKoaBuildRouterFile(
  file: import("../file/context.js").GenerateFile,
  routesPerGroup: Record<
    string,
    import("../generated/common/types.js").StructureRouteDefinition[]
  >,
  contextNamesMap: Map<any, Record<string, string>>,
): void;
/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 */
export function jsKoaRegisterCompasStructureRoute(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
): void;
//# sourceMappingURL=js-koa.d.ts.map
