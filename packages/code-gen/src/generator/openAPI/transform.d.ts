/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @returns {any}
 */
export function transformParams(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
): any;
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @returns {any}
 */
export function transformBody(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
): any;
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @returns {any}
 */
export function transformResponse(
  structure: import("../../generated/common/types").CodeGenStructure,
  route: import("../../generated/common/types").CodeGenRouteType,
): any;
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {(import("../../generated/common/types").CodeGenType)[]} components
 * @returns {Object<string, any>}
 */
export function transformComponents(
  structure: import("../../generated/common/types").CodeGenStructure,
  components: import("../../generated/common/types").CodeGenType[],
): {
  [x: string]: any;
};
//# sourceMappingURL=transform.d.ts.map
