/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFile>}
 */
export function validateStoreFile(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFile>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroup>}
 */
export function validateStoreFileGroup(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroup>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupMeta>}
 */
export function validateStoreFileGroupMeta(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroupMeta>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileMeta>}
 */
export function validateStoreFileMeta(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileMeta>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreImageTransformOptions>}
 */
export function validateStoreImageTransformOptions(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreImageTransformOptions>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJob>}
 */
export function validateStoreJob(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJob>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobInterval>}
 */
export function validateStoreJobInterval(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJobInterval>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStore>}
 */
export function validateStoreSessionStore(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStore>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreToken>}
 */
export function validateStoreSessionStoreToken(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreToken>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileWhere>}
 */
export function validateStoreFileWhere(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileWhere>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupWhere>}
 */
export function validateStoreFileGroupWhere(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroupWhere>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobWhere>}
 */
export function validateStoreJobWhere(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJobWhere>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreWhere>}
 */
export function validateStoreSessionStoreWhere(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreWhere>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenWhere>}
 */
export function validateStoreSessionStoreTokenWhere(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenWhere>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileOrderBy>}
 */
export function validateStoreFileOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileOrderBySpec>}
 */
export function validateStoreFileOrderBySpec(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileOrderBySpec>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupOrderBy>}
 */
export function validateStoreFileGroupOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroupOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupOrderBySpec>}
 */
export function validateStoreFileGroupOrderBySpec(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroupOrderBySpec>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobOrderBy>}
 */
export function validateStoreJobOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJobOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobOrderBySpec>}
 */
export function validateStoreJobOrderBySpec(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJobOrderBySpec>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreOrderBy>}
 */
export function validateStoreSessionStoreOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreOrderBySpec>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreOrderBySpec>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenOrderBy>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenOrderBySpec>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenOrderBySpec>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileQueryBuilder>}
 */
export function validateStoreFileQueryBuilder(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileQueryBuilder>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileGroupQueryBuilder>}
 */
export function validateStoreFileGroupQueryBuilder(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreFileGroupQueryBuilder>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobQueryBuilder>}
 */
export function validateStoreJobQueryBuilder(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreJobQueryBuilder>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreQueryBuilder>}
 */
export function validateStoreSessionStoreQueryBuilder(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreQueryBuilder>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenQueryBuilder>}
 */
export function validateStoreSessionStoreTokenQueryBuilder(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenQueryBuilder>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
