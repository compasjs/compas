/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenAnyOfType>}
 */
export function validateCodeGenAnyOfType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenAnyOfType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenAnyType>}
 */
export function validateCodeGenAnyType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenAnyType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenArrayType>}
 */
export function validateCodeGenArrayType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenArrayType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenBooleanType>}
 */
export function validateCodeGenBooleanType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenBooleanType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenContext>}
 */
export function validateCodeGenContext(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenContext>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenDateType>}
 */
export function validateCodeGenDateType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenDateType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenFile>}
 */
export function validateCodeGenFile(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenFile>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenFileType>}
 */
export function validateCodeGenFileType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenFileType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenGenericType>}
 */
export function validateCodeGenGenericType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenGenericType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenNumberType>}
 */
export function validateCodeGenNumberType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenNumberType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenObjectType>}
 */
export function validateCodeGenObjectType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenObjectType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenReferenceType>}
 */
export function validateCodeGenReferenceType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenReferenceType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenRelationType>}
 */
export function validateCodeGenRelationType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenRelationType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenRouteType>}
 */
export function validateCodeGenRouteType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenRouteType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenStringType>}
 */
export function validateCodeGenStringType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenStringType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenStructure>}
 */
export function validateCodeGenStructure(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenStructure>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenTemplateState>}
 */
export function validateCodeGenTemplateState(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenTemplateState>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenType>}
 */
export function validateCodeGenType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenTypeSettings>}
 */
export function validateCodeGenTypeSettings(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenTypeSettings>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CodeGenUuidType>}
 */
export function validateCodeGenUuidType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<import("../common/types").CodeGenUuidType>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
