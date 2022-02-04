/**
 * Transforms compas query params to OpenApi parameters objects
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {{parameters?: object[]}}
 */
export function transformParams(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  existingSchemas: Record<string, any>,
): {
  parameters?: any[] | undefined;
};
/**
 * Transform compas body and files to OpenApi requestBody object
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Record<string, any>} existingSchemas
 * @returns {{requestBody?: object}}
 */
export function transformBody(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  existingSchemas: Record<string, any>,
): {
  requestBody?: object;
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
