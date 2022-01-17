/**
 * Transforms compas query params to OpenApi parameters objects
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Set<string>} uniqueNameSet
 * @returns {{parameters?: Object[]}}
 */
export function transformParams(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  uniqueNameSet: Set<string>,
): {
  parameters?: any[] | undefined;
};
/**
 * Transform compas body and files to OpenApi requestBody object
 *
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Set<string>} uniqueNameSet
 * @returns {{requestBody?: Object}}
 */
export function transformBody(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  uniqueNameSet: Set<string>,
): {
  requestBody?: any;
};
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {Set<string>} uniqueNameSet
 * @returns {any}
 */
export function transformResponse(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
  uniqueNameSet: Set<string>,
): any;
/**
 *
 * @param {Object<string,import("../../generated/common/types").CodeGenStructure>} flattenStructure
 * @param {Set<string>} uniqueNameSet
 * @returns {Object<string, any>}
 */
export function transformComponents(
  flattenStructure: {
    [x: string]: import("../../generated/common/types").CodeGenStructure;
  },
  uniqueNameSet: Set<string>,
): {
  [x: string]: any;
};
//# sourceMappingURL=transform.d.ts.map
