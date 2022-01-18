/**
 * Transforms compas query params to OpenApi parameters objects
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @returns {{parameters?: Object[]}}
 */
export function transformParams(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
): {
  parameters?: any[] | undefined;
};
/**
 * Transform compas body and files to OpenApi requestBody object
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {{requestBody?: Object}}
 */
export function transformBody(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  existingSchemas: Record<string, any>,
): {
  requestBody?: any;
};
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {any}
 */
export function transformResponse(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  existingSchemas: Record<string, any>,
): any;
//# sourceMappingURL=transform.d.ts.map
