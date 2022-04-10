/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * Postgres based file storage.
 *
 * @param {undefined|any|StoreFileInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFile>}
 */
export function validateStoreFile(
  value: undefined | any | StoreFileInput,
  propertyPath?: string | undefined,
): Either<StoreFile>;
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
 * Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.
 *
 * @param {undefined|any|StoreImageTransformOptionsInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreImageTransformOptions>}
 */
export function validateStoreImageTransformOptions(
  value: undefined | any | StoreImageTransformOptionsInput,
  propertyPath?: string | undefined,
): Either<StoreImageTransformOptions>;
/**
 * Postgres based job queue.
 * Use {@link addEventToQueue}, {@link addRecurringJobToQueue} and {@link addJobWithCustomTimeoutToQueue}
 * to insert new jobs in to the queue.
 * Use {@link JobQueueWorker} as a way to pick up jobs.
 *
 * @param {undefined|any|StoreJobInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJob>}
 */
export function validateStoreJob(
  value: undefined | any | StoreJobInput,
  propertyPath?: string | undefined,
): Either<StoreJob>;
/**
 * Interval specification of 'addRecurringJobToQueue'.
 *
 * @param {undefined|any|StoreJobIntervalInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobInterval>}
 */
export function validateStoreJobInterval(
  value: undefined | any | StoreJobIntervalInput,
  propertyPath?: string | undefined,
): Either<StoreJobInterval>;
/**
 * Session data store, used by 'sessionStore\*' functions.
 *
 * @param {undefined|any|StoreSessionStoreInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStore>}
 */
export function validateStoreSessionStore(
  value: undefined | any | StoreSessionStoreInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStore>;
/**
 * Store all tokens that belong to a session.
 *
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
 * @param {undefined|any|StoreFileUpdatePartialInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileUpdatePartial>}
 */
export function validateStoreFileUpdatePartial(
  value: undefined | any | StoreFileUpdatePartialInput,
  propertyPath?: string | undefined,
): Either<StoreFileUpdatePartial>;
/**
 * @param {undefined|any|StoreFileUpdateInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileUpdate>}
 */
export function validateStoreFileUpdate(
  value: undefined | any | StoreFileUpdateInput,
  propertyPath?: string | undefined,
): Either<StoreFileUpdate>;
/**
 * @param {undefined|any|StoreFileUpdateFnInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreFileUpdateFn>}
 */
export function validateStoreFileUpdateFn(
  value: undefined | any | StoreFileUpdateFnInput,
  propertyPath?: string | undefined,
): Either<StoreFileUpdateFn>;
/**
 * @param {undefined|any|StoreJobUpdatePartialInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobUpdatePartial>}
 */
export function validateStoreJobUpdatePartial(
  value: undefined | any | StoreJobUpdatePartialInput,
  propertyPath?: string | undefined,
): Either<StoreJobUpdatePartial>;
/**
 * @param {undefined|any|StoreJobUpdateInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobUpdate>}
 */
export function validateStoreJobUpdate(
  value: undefined | any | StoreJobUpdateInput,
  propertyPath?: string | undefined,
): Either<StoreJobUpdate>;
/**
 * @param {undefined|any|StoreJobUpdateFnInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreJobUpdateFn>}
 */
export function validateStoreJobUpdateFn(
  value: undefined | any | StoreJobUpdateFnInput,
  propertyPath?: string | undefined,
): Either<StoreJobUpdateFn>;
/**
 * @param {undefined|any|StoreSessionStoreUpdatePartialInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreUpdatePartial>}
 */
export function validateStoreSessionStoreUpdatePartial(
  value: undefined | any | StoreSessionStoreUpdatePartialInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreUpdatePartial>;
/**
 * @param {undefined|any|StoreSessionStoreUpdateInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreUpdate>}
 */
export function validateStoreSessionStoreUpdate(
  value: undefined | any | StoreSessionStoreUpdateInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreUpdate>;
/**
 * @param {undefined|any|StoreSessionStoreUpdateFnInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreUpdateFn>}
 */
export function validateStoreSessionStoreUpdateFn(
  value: undefined | any | StoreSessionStoreUpdateFnInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreUpdateFn>;
/**
 * @param {undefined|any|StoreSessionStoreTokenUpdatePartialInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenUpdatePartial>}
 */
export function validateStoreSessionStoreTokenUpdatePartial(
  value: undefined | any | StoreSessionStoreTokenUpdatePartialInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenUpdatePartial>;
/**
 * @param {undefined|any|StoreSessionStoreTokenUpdateInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenUpdate>}
 */
export function validateStoreSessionStoreTokenUpdate(
  value: undefined | any | StoreSessionStoreTokenUpdateInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenUpdate>;
/**
 * @param {undefined|any|StoreSessionStoreTokenUpdateFnInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<StoreSessionStoreTokenUpdateFn>}
 */
export function validateStoreSessionStoreTokenUpdateFn(
  value: undefined | any | StoreSessionStoreTokenUpdateFnInput,
  propertyPath?: string | undefined,
): Either<StoreSessionStoreTokenUpdateFn>;
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
