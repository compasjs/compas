/**
 * Postgres based file storage.
 *
 * @param {import("../common/types").StoreFileInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFile, import("@compas/stdlib").AppError>}
 */
export function validateStoreFile(
  value: import("../common/types").StoreFileInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFile,
  import("@compas/stdlib").AppError
>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {import("../common/types").StoreFileMetaInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileMeta, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileMeta(
  value: import("../common/types").StoreFileMetaInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileMeta,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileResponseInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileResponse, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileResponse(
  value: import("../common/types").StoreFileResponseInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileResponse,
  import("@compas/stdlib").AppError
>;
/**
 * Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.
 *
 * @param {import("../common/types").StoreImageTransformOptionsInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreImageTransformOptions, import("@compas/stdlib").AppError>}
 */
export function validateStoreImageTransformOptions(
  value: import("../common/types").StoreImageTransformOptionsInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreImageTransformOptions,
  import("@compas/stdlib").AppError
>;
/**
 * Postgres based job queue.
 *Use {@link queueWorkerAddJob} to insert new jobs in to the queue and {@link queueWorkerRegisterCronJobs} for all your recurring jobs.
 *Use {@link queueWorkerCreate} as a way to pick up jobs.
 *
 * @param {import("../common/types").StoreJobInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJob, import("@compas/stdlib").AppError>}
 */
export function validateStoreJob(
  value: import("../common/types").StoreJobInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJob,
  import("@compas/stdlib").AppError
>;
/**
 * Set as '.query(T.reference("store", "secureImageTransformOptions"))' of routes that use 'sendTransformedImage' and 'fileVerifyAccessToken'.
 *
 * @param {import("../common/types").StoreSecureImageTransformOptionsInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSecureImageTransformOptions, import("@compas/stdlib").AppError>}
 */
export function validateStoreSecureImageTransformOptions(
  value:
    | import("../common/types").StoreSecureImageTransformOptionsInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSecureImageTransformOptions,
  import("@compas/stdlib").AppError
>;
/**
 * Session data store, used by 'sessionStore\*' functions.
 *
 * @param {import("../common/types").StoreSessionStoreInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStore, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStore(
  value: import("../common/types").StoreSessionStoreInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStore,
  import("@compas/stdlib").AppError
>;
/**
 * Store all tokens that belong to a session.
 *
 * @param {import("../common/types").StoreSessionStoreTokenInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreToken, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreToken(
  value: import("../common/types").StoreSessionStoreTokenInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreToken,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileWhereInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileWhere, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileWhere(
  value: import("../common/types").StoreFileWhereInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileWhere,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobWhereInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobWhere, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobWhere(
  value: import("../common/types").StoreJobWhereInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobWhere,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreWhereInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreWhere, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreWhere(
  value: import("../common/types").StoreSessionStoreWhereInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreWhere,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhereInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenWhere, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenWhere(
  value: import("../common/types").StoreSessionStoreTokenWhereInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenWhere,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileReturningInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileReturning, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileReturning(
  value: import("../common/types").StoreFileReturningInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileReturning,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobReturningInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobReturning, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobReturning(
  value: import("../common/types").StoreJobReturningInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobReturning,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreReturningInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreReturning, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreReturning(
  value: import("../common/types").StoreSessionStoreReturningInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreReturning,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenReturningInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenReturning, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenReturning(
  value:
    | import("../common/types").StoreSessionStoreTokenReturningInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenReturning,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileInsertPartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileInsertPartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileInsertPartial(
  value: import("../common/types").StoreFileInsertPartialInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileInsertPartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileInsertInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileInsert, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileInsert(
  value: import("../common/types").StoreFileInsertInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileInsert,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobInsertPartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobInsertPartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobInsertPartial(
  value: import("../common/types").StoreJobInsertPartialInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobInsertPartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobInsertInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobInsert, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobInsert(
  value: import("../common/types").StoreJobInsertInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobInsert,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertPartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreInsertPartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreInsertPartial(
  value:
    | import("../common/types").StoreSessionStoreInsertPartialInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreInsertPartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreInsert, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreInsert(
  value: import("../common/types").StoreSessionStoreInsertInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreInsert,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertPartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenInsertPartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenInsertPartial(
  value:
    | import("../common/types").StoreSessionStoreTokenInsertPartialInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenInsertPartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenInsert, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenInsert(
  value: import("../common/types").StoreSessionStoreTokenInsertInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenInsert,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileUpdatePartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileUpdatePartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileUpdatePartial(
  value: import("../common/types").StoreFileUpdatePartialInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileUpdatePartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileUpdateInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileUpdate, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileUpdate(
  value: import("../common/types").StoreFileUpdateInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileUpdate,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobUpdatePartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobUpdatePartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobUpdatePartial(
  value: import("../common/types").StoreJobUpdatePartialInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobUpdatePartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobUpdateInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobUpdate, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobUpdate(
  value: import("../common/types").StoreJobUpdateInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobUpdate,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdatePartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreUpdatePartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreUpdatePartial(
  value:
    | import("../common/types").StoreSessionStoreUpdatePartialInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreUpdatePartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdateInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreUpdate, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreUpdate(
  value: import("../common/types").StoreSessionStoreUpdateInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreUpdate,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdatePartialInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenUpdatePartial, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenUpdatePartial(
  value:
    | import("../common/types").StoreSessionStoreTokenUpdatePartialInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenUpdatePartial,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdateInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenUpdate, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenUpdate(
  value: import("../common/types").StoreSessionStoreTokenUpdateInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenUpdate,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileOrderByInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileOrderBy, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileOrderBy(
  value: import("../common/types").StoreFileOrderByInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileOrderBy,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileOrderBySpecInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileOrderBySpec, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileOrderBySpec(
  value: import("../common/types").StoreFileOrderBySpecInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileOrderBySpec,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobOrderByInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobOrderBy, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobOrderBy(
  value: import("../common/types").StoreJobOrderByInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobOrderBy,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobOrderBySpecInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobOrderBySpec, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobOrderBySpec(
  value: import("../common/types").StoreJobOrderBySpecInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobOrderBySpec,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderByInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreOrderBy, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreOrderBy(
  value: import("../common/types").StoreSessionStoreOrderByInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreOrderBy,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderBySpecInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreOrderBySpec, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: import("../common/types").StoreSessionStoreOrderBySpecInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreOrderBySpec,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderByInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenOrderBy, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: import("../common/types").StoreSessionStoreTokenOrderByInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenOrderBy,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderBySpecInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenOrderBySpec, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value:
    | import("../common/types").StoreSessionStoreTokenOrderBySpecInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenOrderBySpec,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreFileQueryBuilderInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreFileQueryBuilder, import("@compas/stdlib").AppError>}
 */
export function validateStoreFileQueryBuilder(
  value: import("../common/types").StoreFileQueryBuilderInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreFileQueryBuilder,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreJobQueryBuilderInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreJobQueryBuilder, import("@compas/stdlib").AppError>}
 */
export function validateStoreJobQueryBuilder(
  value: import("../common/types").StoreJobQueryBuilderInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreJobQueryBuilder,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreQueryBuilder, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreQueryBuilder(
  value: import("../common/types").StoreSessionStoreQueryBuilderInput | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreQueryBuilder,
  import("@compas/stdlib").AppError
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilderInput|unknown} value
 * @returns {import("@compas/stdlib").Either<import("../common/types").StoreSessionStoreTokenQueryBuilder, import("@compas/stdlib").AppError>}
 */
export function validateStoreSessionStoreTokenQueryBuilder(
  value:
    | import("../common/types").StoreSessionStoreTokenQueryBuilderInput
    | unknown,
): import("@compas/stdlib").Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilder,
  import("@compas/stdlib").AppError
>;
//# sourceMappingURL=validators.d.ts.map
