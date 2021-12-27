/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|StoreFileInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFile>}
 */
export function validateStoreFile(
  value: undefined | any | StoreFileInput,
  propertyPath?: string | undefined,
): Either<StoreFile>;
/**
 * @param {undefined|any|StoreFileGroupInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroup>}
 */
export function validateStoreFileGroup(
  value: undefined | any | StoreFileGroupInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroup>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {undefined|any|StoreFileGroupMetaInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupMeta>}
 */
export function validateStoreFileGroupMeta(
  value: undefined | any | StoreFileGroupMetaInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroupMeta>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {undefined|any|StoreFileMetaInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileMeta>}
 */
export function validateStoreFileMeta(
  value: undefined | any | StoreFileMetaInput,
  propertyPath?: string | undefined,
): Either<StoreFileMeta>;
/**
 * @param {undefined|any|StoreImageTransformOptionsInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreImageTransformOptions>}
 */
export function validateStoreImageTransformOptions(
  value: undefined | any | StoreImageTransformOptionsInput,
  propertyPath?: string | undefined,
): Either<StoreImageTransformOptions>;
/**
 * @param {undefined|any|StoreJobInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJob>}
 */
export function validateStoreJob(
  value: undefined | any | StoreJobInput,
  propertyPath?: string | undefined,
): Either<StoreJob>;
/**
 * @param {undefined|any|StoreJobIntervalInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobInterval>}
 */
export function validateStoreJobInterval(
  value: undefined | any | StoreJobIntervalInput,
  propertyPath?: string | undefined,
): Either<StoreJobInterval>;
/**
 * @param {undefined|any|StoreSessionStoreInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStore>}
 */
export function validateStoreSessionStore(
  value: undefined | any | StoreSessionStoreInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStore>;
/**
 * @param {undefined|any|StoreSessionStoreTokenInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreToken>}
 */
export function validateStoreSessionStoreToken(
  value: undefined | any | StoreSessionStoreTokenInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreToken>;
/**
 * @param {undefined|any|StoreFileWhereInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileWhere>}
 */
export function validateStoreFileWhere(
  value: undefined | any | StoreFileWhereInput,
  propertyPath?: string | undefined,
): Either<StoreFileWhere>;
/**
 * @param {undefined|any|StoreFileGroupWhereInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupWhere>}
 */
export function validateStoreFileGroupWhere(
  value: undefined | any | StoreFileGroupWhereInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroupWhere>;
/**
 * @param {undefined|any|StoreJobWhereInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobWhere>}
 */
export function validateStoreJobWhere(
  value: undefined | any | StoreJobWhereInput,
  propertyPath?: string | undefined,
): Either<StoreJobWhere>;
/**
 * @param {undefined|any|StoreSessionStoreWhereInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreWhere>}
 */
export function validateStoreSessionStoreWhere(
  value: undefined | any | StoreSessionStoreWhereInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreWhere>;
/**
 * @param {undefined|any|StoreSessionStoreTokenWhereInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenWhere>}
 */
export function validateStoreSessionStoreTokenWhere(
  value: undefined | any | StoreSessionStoreTokenWhereInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenWhere>;
/**
 * @param {undefined|any|StoreFileOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileOrderBy>}
 */
export function validateStoreFileOrderBy(
  value: undefined | any | StoreFileOrderByInput,
  propertyPath?: string | undefined,
): Either<StoreFileOrderBy>;
/**
 * @param {undefined|any|StoreFileOrderBySpecInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileOrderBySpec>}
 */
export function validateStoreFileOrderBySpec(
  value: undefined | any | StoreFileOrderBySpecInput,
  propertyPath?: string | undefined,
): Either<StoreFileOrderBySpec>;
/**
 * @param {undefined|any|StoreFileGroupOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupOrderBy>}
 */
export function validateStoreFileGroupOrderBy(
  value: undefined | any | StoreFileGroupOrderByInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroupOrderBy>;
/**
 * @param {undefined|any|StoreFileGroupOrderBySpecInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupOrderBySpec>}
 */
export function validateStoreFileGroupOrderBySpec(
  value: undefined | any | StoreFileGroupOrderBySpecInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroupOrderBySpec>;
/**
 * @param {undefined|any|StoreJobOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobOrderBy>}
 */
export function validateStoreJobOrderBy(
  value: undefined | any | StoreJobOrderByInput,
  propertyPath?: string | undefined,
): Either<StoreJobOrderBy>;
/**
 * @param {undefined|any|StoreJobOrderBySpecInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobOrderBySpec>}
 */
export function validateStoreJobOrderBySpec(
  value: undefined | any | StoreJobOrderBySpecInput,
  propertyPath?: string | undefined,
): Either<StoreJobOrderBySpec>;
/**
 * @param {undefined|any|StoreSessionStoreOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreOrderBy>}
 */
export function validateStoreSessionStoreOrderBy(
  value: undefined | any | StoreSessionStoreOrderByInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreOrderBy>;
/**
 * @param {undefined|any|StoreSessionStoreOrderBySpecInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreOrderBySpec>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: undefined | any | StoreSessionStoreOrderBySpecInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreOrderBySpec>;
/**
 * @param {undefined|any|StoreSessionStoreTokenOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenOrderBy>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: undefined | any | StoreSessionStoreTokenOrderByInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenOrderBy>;
/**
 * @param {undefined|any|StoreSessionStoreTokenOrderBySpecInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenOrderBySpec>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value: undefined | any | StoreSessionStoreTokenOrderBySpecInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenOrderBySpec>;
/**
 * @param {undefined|any|StoreFileQueryBuilderInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileQueryBuilder>}
 */
export function validateStoreFileQueryBuilder(
  value: undefined | any | StoreFileQueryBuilderInput,
  propertyPath?: string | undefined,
): Either<StoreFileQueryBuilder>;
/**
 * @param {undefined|any|StoreFileGroupQueryBuilderInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupQueryBuilder>}
 */
export function validateStoreFileGroupQueryBuilder(
  value: undefined | any | StoreFileGroupQueryBuilderInput,
  propertyPath?: string | undefined,
): Either<StoreFileGroupQueryBuilder>;
/**
 * @param {undefined|any|StoreJobQueryBuilderInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobQueryBuilder>}
 */
export function validateStoreJobQueryBuilder(
  value: undefined | any | StoreJobQueryBuilderInput,
  propertyPath?: string | undefined,
): Either<StoreJobQueryBuilder>;
/**
 * @param {undefined|any|StoreSessionStoreQueryBuilderInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreQueryBuilder>}
 */
export function validateStoreSessionStoreQueryBuilder(
  value: undefined | any | StoreSessionStoreQueryBuilderInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreQueryBuilder>;
/**
 * @param {undefined|any|StoreSessionStoreTokenQueryBuilderInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenQueryBuilder>}
 */
export function validateStoreSessionStoreTokenQueryBuilder(
  value: undefined | any | StoreSessionStoreTokenQueryBuilderInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenQueryBuilder>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
