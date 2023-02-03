/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * Postgres based file storage.
 *
 * @param {import("../common/types").StoreFileInput|unknown} value
 * @returns {Either<import("../common/types").StoreFile, ValidatorErrorMap>}
 */
export function validateStoreFile(
  value: import("../common/types").StoreFileInput | unknown,
): Either<import("../common/types").StoreFile, ValidatorErrorMap>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {import("../common/types").StoreFileMetaInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileMeta, ValidatorErrorMap>}
 */
export function validateStoreFileMeta(
  value: import("../common/types").StoreFileMetaInput | unknown,
): Either<import("../common/types").StoreFileMeta, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileResponseInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileResponse, ValidatorErrorMap>}
 */
export function validateStoreFileResponse(
  value: import("../common/types").StoreFileResponseInput | unknown,
): Either<import("../common/types").StoreFileResponse, ValidatorErrorMap>;
/**
 * Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.
 *
 * @param {import("../common/types").StoreImageTransformOptionsInput|unknown} value
 * @returns {Either<import("../common/types").StoreImageTransformOptions, ValidatorErrorMap>}
 */
export function validateStoreImageTransformOptions(
  value: import("../common/types").StoreImageTransformOptionsInput | unknown,
): Either<
  import("../common/types").StoreImageTransformOptions,
  ValidatorErrorMap
>;
/**
 * Postgres based job queue.
 *Use {@link queueWorkerAddJob} to insert new jobs in to the queue and {@link queueWorkerRegisterCronJobs} for all your recurring jobs.
 *Use {@link queueWorkerCreate} as a way to pick up jobs.
 *
 * @param {import("../common/types").StoreJobInput|unknown} value
 * @returns {Either<import("../common/types").StoreJob, ValidatorErrorMap>}
 */
export function validateStoreJob(
  value: import("../common/types").StoreJobInput | unknown,
): Either<import("../common/types").StoreJob, ValidatorErrorMap>;
/**
 * Set as '.query(T.reference("store", "secureImageTransformOptions"))' of routes that use 'sendTransformedImage' and 'fileVerifyAccessToken'.
 *
 * @param {import("../common/types").StoreSecureImageTransformOptionsInput|unknown} value
 * @returns {Either<import("../common/types").StoreSecureImageTransformOptions, ValidatorErrorMap>}
 */
export function validateStoreSecureImageTransformOptions(
  value:
    | import("../common/types").StoreSecureImageTransformOptionsInput
    | unknown,
): Either<
  import("../common/types").StoreSecureImageTransformOptions,
  ValidatorErrorMap
>;
/**
 * Session data store, used by 'sessionStore\*' functions.
 *
 * @param {import("../common/types").StoreSessionStoreInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStore, ValidatorErrorMap>}
 */
export function validateStoreSessionStore(
  value: import("../common/types").StoreSessionStoreInput | unknown,
): Either<import("../common/types").StoreSessionStore, ValidatorErrorMap>;
/**
 * Store all tokens that belong to a session.
 *
 * @param {import("../common/types").StoreSessionStoreTokenInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreToken, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreToken(
  value: import("../common/types").StoreSessionStoreTokenInput | unknown,
): Either<import("../common/types").StoreSessionStoreToken, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileWhereInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileWhere, ValidatorErrorMap>}
 */
export function validateStoreFileWhere(
  value: import("../common/types").StoreFileWhereInput | unknown,
): Either<import("../common/types").StoreFileWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobWhereInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobWhere, ValidatorErrorMap>}
 */
export function validateStoreJobWhere(
  value: import("../common/types").StoreJobWhereInput | unknown,
): Either<import("../common/types").StoreJobWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreWhereInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreWhere, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreWhere(
  value: import("../common/types").StoreSessionStoreWhereInput | unknown,
): Either<import("../common/types").StoreSessionStoreWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhereInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenWhere, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenWhere(
  value: import("../common/types").StoreSessionStoreTokenWhereInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenWhere,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileReturningInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>}
 */
export function validateStoreFileReturning(
  value: import("../common/types").StoreFileReturningInput | unknown,
): Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobReturningInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>}
 */
export function validateStoreJobReturning(
  value: import("../common/types").StoreJobReturningInput | unknown,
): Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreReturningInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreReturning(
  value: import("../common/types").StoreSessionStoreReturningInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenReturningInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenReturning(
  value:
    | import("../common/types").StoreSessionStoreTokenReturningInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileInsertPartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreFileInsertPartial(
  value: import("../common/types").StoreFileInsertPartialInput | unknown,
): Either<import("../common/types").StoreFileInsertPartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileInsertInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileInsert, ValidatorErrorMap>}
 */
export function validateStoreFileInsert(
  value: import("../common/types").StoreFileInsertInput | unknown,
): Either<import("../common/types").StoreFileInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsertPartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreJobInsertPartial(
  value: import("../common/types").StoreJobInsertPartialInput | unknown,
): Either<import("../common/types").StoreJobInsertPartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsertInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobInsert, ValidatorErrorMap>}
 */
export function validateStoreJobInsert(
  value: import("../common/types").StoreJobInsertInput | unknown,
): Either<import("../common/types").StoreJobInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertPartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsertPartial(
  value:
    | import("../common/types").StoreSessionStoreInsertPartialInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreInsertPartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsert, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsert(
  value: import("../common/types").StoreSessionStoreInsertInput | unknown,
): Either<import("../common/types").StoreSessionStoreInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertPartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsertPartial(
  value:
    | import("../common/types").StoreSessionStoreTokenInsertPartialInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenInsertPartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsert, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsert(
  value: import("../common/types").StoreSessionStoreTokenInsertInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenInsert,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileUpdatePartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreFileUpdatePartial(
  value: import("../common/types").StoreFileUpdatePartialInput | unknown,
): Either<import("../common/types").StoreFileUpdatePartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileUpdateInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileUpdate, ValidatorErrorMap>}
 */
export function validateStoreFileUpdate(
  value: import("../common/types").StoreFileUpdateInput | unknown,
): Either<import("../common/types").StoreFileUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdatePartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreJobUpdatePartial(
  value: import("../common/types").StoreJobUpdatePartialInput | unknown,
): Either<import("../common/types").StoreJobUpdatePartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdateInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobUpdate, ValidatorErrorMap>}
 */
export function validateStoreJobUpdate(
  value: import("../common/types").StoreJobUpdateInput | unknown,
): Either<import("../common/types").StoreJobUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdatePartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdatePartial(
  value:
    | import("../common/types").StoreSessionStoreUpdatePartialInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreUpdatePartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdateInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdate, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdate(
  value: import("../common/types").StoreSessionStoreUpdateInput | unknown,
): Either<import("../common/types").StoreSessionStoreUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdatePartialInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdatePartial(
  value:
    | import("../common/types").StoreSessionStoreTokenUpdatePartialInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdatePartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdateInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdate, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdate(
  value: import("../common/types").StoreSessionStoreTokenUpdateInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdate,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileOrderByInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBy(
  value: import("../common/types").StoreFileOrderByInput | unknown,
): Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileOrderBySpecInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBySpec(
  value: import("../common/types").StoreFileOrderBySpecInput | unknown,
): Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderByInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBy(
  value: import("../common/types").StoreJobOrderByInput | unknown,
): Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderBySpecInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBySpec(
  value: import("../common/types").StoreJobOrderBySpecInput | unknown,
): Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderByInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBy(
  value: import("../common/types").StoreSessionStoreOrderByInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderBySpecInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: import("../common/types").StoreSessionStoreOrderBySpecInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderByInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: import("../common/types").StoreSessionStoreTokenOrderByInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderBySpecInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value:
    | import("../common/types").StoreSessionStoreTokenOrderBySpecInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileQueryBuilderInput|unknown} value
 * @returns {Either<import("../common/types").StoreFileQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreFileQueryBuilder(
  value: import("../common/types").StoreFileQueryBuilderInput | unknown,
): Either<import("../common/types").StoreFileQueryBuilder, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobQueryBuilderInput|unknown} value
 * @returns {Either<import("../common/types").StoreJobQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreJobQueryBuilder(
  value: import("../common/types").StoreJobQueryBuilderInput | unknown,
): Either<import("../common/types").StoreJobQueryBuilder, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreQueryBuilder(
  value: import("../common/types").StoreSessionStoreQueryBuilderInput | unknown,
): Either<
  import("../common/types").StoreSessionStoreQueryBuilder,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilderInput|unknown} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenQueryBuilder(
  value:
    | import("../common/types").StoreSessionStoreTokenQueryBuilderInput
    | unknown,
): Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilder,
  ValidatorErrorMap
>;
export type Either<T, E> =
  | {
      value: T;
      error?: never;
    }
  | {
      value?: never;
      error: E;
    };
export type ValidatorErrorMap = Record<string, any | undefined>;
//# sourceMappingURL=validators.d.ts.map
