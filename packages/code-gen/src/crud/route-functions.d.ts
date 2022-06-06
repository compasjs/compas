/**
 * @template {any[]} Args
 *
 * @param {Record<keyof import("../generated/common/types.js").CodeGenCrudType["routeOptions"], (...args:
 *   Args) => void>} functions
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {Args} args
 */
export function crudCallFunctionsForRoutes<Args extends any[]>(
  functions: Record<
    "listRoute" | "singleRoute" | "createRoute" | "updateRoute" | "deleteRoute",
    (...args: Args) => void
  >,
  type: import("../generated/common/types.js").CodeGenCrudType,
  args: Args,
): void;
/**
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @returns {string}
 */
export function crudCreateRouteParam(
  type: import("../generated/common/types.js").CodeGenCrudType,
): string;
//# sourceMappingURL=route-functions.d.ts.map
