/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenAnyOfType>}
 */
export function validateCodeGenAnyOfType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenAnyOfType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenAnyType>}
 */
export function validateCodeGenAnyType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenAnyType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenArrayType>}
 */
export function validateCodeGenArrayType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenArrayType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenBooleanType>}
 */
export function validateCodeGenBooleanType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenBooleanType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenContext>}
 */
export function validateCodeGenContext(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenContext>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenDateType>}
 */
export function validateCodeGenDateType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenDateType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenFile>}
 */
export function validateCodeGenFile(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenFile>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenFileType>}
 */
export function validateCodeGenFileType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenFileType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenGenerateOpts>}
 */
export function validateCodeGenGenerateOpts(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenGenerateOpts>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenGenericType>}
 */
export function validateCodeGenGenericType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenGenericType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenNumberType>}
 */
export function validateCodeGenNumberType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenNumberType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenObjectType>}
 */
export function validateCodeGenObjectType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenObjectType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenReferenceType>}
 */
export function validateCodeGenReferenceType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenReferenceType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenRelationType>}
 */
export function validateCodeGenRelationType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenRelationType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenRouteType>}
 */
export function validateCodeGenRouteType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenRouteType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenStringType>}
 */
export function validateCodeGenStringType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenStringType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenStructure>}
 */
export function validateCodeGenStructure(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenStructure>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenTemplateState>}
 */
export function validateCodeGenTemplateState(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenTemplateState>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenType>}
 */
export function validateCodeGenType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenType>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenTypeSettings>}
 */
export function validateCodeGenTypeSettings(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenTypeSettings>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CodeGenUuidType>}
 */
export function validateCodeGenUuidType(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CodeGenUuidType>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
