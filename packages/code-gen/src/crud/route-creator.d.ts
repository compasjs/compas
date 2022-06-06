/**
 * Create the necessary routes based on the available crud types
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudCreateRoutes(
  context: import("../generated/common/types.js").CodeGenContext,
): void;
/**
 * Add route and nested types to the structure
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {import("../generated/common/types.js").CodeGenRouteType|any} route
 * @returns {void}
 */
export function crudAddRouteTypeToContext(
  structure: import("../generated/common/types.js").CodeGenStructure,
  type: import("../generated/common/types.js").CodeGenCrudType,
  {
    group,
    name,
    idempotent,
    path,
    method,
    params,
    query,
    body,
    response,
    invalidations,
  }: import("../generated/common/types.js").CodeGenRouteType | any,
): void;
//# sourceMappingURL=route-creator.d.ts.map
