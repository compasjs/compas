/**
 * @typedef {CodeGenAnyType|CodeGenAnyOfType|CodeGenArrayType|CodeGenBooleanType|CodeGenDateType|CodeGenFileType|CodeGenGenericType|CodeGenNumberType|CodeGenReferenceType|CodeGenStringType|CodeGenUuidType|CodeGenObjectType|CodeGenRouteType} TransformCodeGenType
 */
/**
 * @param {CodeGenStructure} structure
 * @param {CodeGenRouteType} route
 * @returns {any}
 */
export function transformParams(
  structure: CodeGenStructure,
  route: CodeGenRouteType,
): any;
/**
 * @param {CodeGenStructure} structure
 * @param {CodeGenRouteType} route
 * @returns {any}
 */
export function transformBody(
  structure: CodeGenStructure,
  route: CodeGenRouteType,
): any;
/**
 * @param {CodeGenStructure} structure
 * @param {CodeGenRouteType} route
 * @returns {any}
 */
export function transformResponse(
  structure: CodeGenStructure,
  route: CodeGenRouteType,
): any;
/**
 * @param {CodeGenStructure} structure
 * @param {TransformCodeGenType[]} components
 * @returns {Object<string, any>}
 */
export function transformComponents(
  structure: CodeGenStructure,
  components: TransformCodeGenType[],
): {
  [x: string]: any;
};
export type TransformCodeGenType =
  | CodeGenAnyType
  | CodeGenAnyOfType
  | CodeGenArrayType
  | CodeGenBooleanType
  | CodeGenDateType
  | CodeGenFileType
  | CodeGenGenericType
  | CodeGenNumberType
  | CodeGenReferenceType
  | CodeGenStringType
  | CodeGenUuidType
  | CodeGenObjectType
  | CodeGenRouteType;
//# sourceMappingURL=transform.d.ts.map
