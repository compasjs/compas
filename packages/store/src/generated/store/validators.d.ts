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
 * @param {import("../common/types").StoreFileInput|any} value
 * @returns {Either<import("../common/types").StoreFile, ValidatorErrorMap>}
 */
export function validateStoreFile(
  value: import("../common/types").StoreFileInput | any,
): Either<import("../common/types").StoreFile, ValidatorErrorMap>;
/**
 * User definable, optional object to store whatever you want
 *
 * @param {import("../common/types").StoreFileMetaInput|any} value
 * @returns {Either<import("../common/types").StoreFileMeta, ValidatorErrorMap>}
 */
export function validateStoreFileMeta(
  value: import("../common/types").StoreFileMetaInput | any,
): Either<import("../common/types").StoreFileMeta, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileWhereInput|any} value
 * @returns {Either<import("../common/types").StoreFileWhere, ValidatorErrorMap>}
 */
export function validateStoreFileWhere(
  value: import("../common/types").StoreFileWhereInput | any,
): Either<import("../common/types").StoreFileWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileOrderByInput|any} value
 * @returns {Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBy(
  value: import("../common/types").StoreFileOrderByInput | any,
): Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileOrderBySpecInput|any} value
 * @returns {Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBySpec(
  value: import("../common/types").StoreFileOrderBySpecInput | any,
): Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreFileQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreFileQueryBuilder(
  value: import("../common/types").StoreFileQueryBuilderInput | any,
): Either<import("../common/types").StoreFileQueryBuilder, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileReturningInput|any} value
 * @returns {Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>}
 */
export function validateStoreFileReturning(
  value: import("../common/types").StoreFileReturningInput | any,
): Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileInsertInput|any} value
 * @returns {Either<import("../common/types").StoreFileInsert, ValidatorErrorMap>}
 */
export function validateStoreFileInsert(
  value: import("../common/types").StoreFileInsertInput | any,
): Either<import("../common/types").StoreFileInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileInsertPartialInput|any} value
 * @returns {Either<import("../common/types").StoreFileInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreFileInsertPartial(
  value: import("../common/types").StoreFileInsertPartialInput | any,
): Either<import("../common/types").StoreFileInsertPartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreFileUpdate, ValidatorErrorMap>}
 */
export function validateStoreFileUpdate(
  value: import("../common/types").StoreFileUpdateInput | any,
): Either<import("../common/types").StoreFileUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileUpdatePartialInput|any} value
 * @returns {Either<import("../common/types").StoreFileUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreFileUpdatePartial(
  value: import("../common/types").StoreFileUpdatePartialInput | any,
): Either<import("../common/types").StoreFileUpdatePartial, ValidatorErrorMap>;
/**
 * Postgres based job queue.
 *Use {@link queueWorkerAddJob} to insert new jobs in to the queue and {@link queueWorkerRegisterCronJobs} for all your recurring jobs.
 *Use {@link queueWorkerCreate} as a way to pick up jobs.
 *
 * @param {import("../common/types").StoreJobInput|any} value
 * @returns {Either<import("../common/types").StoreJob, ValidatorErrorMap>}
 */
export function validateStoreJob(
  value: import("../common/types").StoreJobInput | any,
): Either<import("../common/types").StoreJob, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobWhereInput|any} value
 * @returns {Either<import("../common/types").StoreJobWhere, ValidatorErrorMap>}
 */
export function validateStoreJobWhere(
  value: import("../common/types").StoreJobWhereInput | any,
): Either<import("../common/types").StoreJobWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderByInput|any} value
 * @returns {Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBy(
  value: import("../common/types").StoreJobOrderByInput | any,
): Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderBySpecInput|any} value
 * @returns {Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBySpec(
  value: import("../common/types").StoreJobOrderBySpecInput | any,
): Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreJobQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreJobQueryBuilder(
  value: import("../common/types").StoreJobQueryBuilderInput | any,
): Either<import("../common/types").StoreJobQueryBuilder, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobReturningInput|any} value
 * @returns {Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>}
 */
export function validateStoreJobReturning(
  value: import("../common/types").StoreJobReturningInput | any,
): Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsertInput|any} value
 * @returns {Either<import("../common/types").StoreJobInsert, ValidatorErrorMap>}
 */
export function validateStoreJobInsert(
  value: import("../common/types").StoreJobInsertInput | any,
): Either<import("../common/types").StoreJobInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsertPartialInput|any} value
 * @returns {Either<import("../common/types").StoreJobInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreJobInsertPartial(
  value: import("../common/types").StoreJobInsertPartialInput | any,
): Either<import("../common/types").StoreJobInsertPartial, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreJobUpdate, ValidatorErrorMap>}
 */
export function validateStoreJobUpdate(
  value: import("../common/types").StoreJobUpdateInput | any,
): Either<import("../common/types").StoreJobUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdatePartialInput|any} value
 * @returns {Either<import("../common/types").StoreJobUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreJobUpdatePartial(
  value: import("../common/types").StoreJobUpdatePartialInput | any,
): Either<import("../common/types").StoreJobUpdatePartial, ValidatorErrorMap>;
/**
 * Session data store, used by 'sessionStore\*' functions.
 *
 * @param {import("../common/types").StoreSessionStoreInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStore, ValidatorErrorMap>}
 */
export function validateStoreSessionStore(
  value: import("../common/types").StoreSessionStoreInput | any,
): Either<import("../common/types").StoreSessionStore, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreWhereInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreWhere, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreWhere(
  value: import("../common/types").StoreSessionStoreWhereInput | any,
): Either<import("../common/types").StoreSessionStoreWhere, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhereInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenWhere, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenWhere(
  value: import("../common/types").StoreSessionStoreTokenWhereInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenWhere,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderByInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBy(
  value: import("../common/types").StoreSessionStoreOrderByInput | any,
): Either<
  import("../common/types").StoreSessionStoreOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderBySpecInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: import("../common/types").StoreSessionStoreOrderBySpecInput | any,
): Either<
  import("../common/types").StoreSessionStoreOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreQueryBuilder(
  value: import("../common/types").StoreSessionStoreQueryBuilderInput | any,
): Either<
  import("../common/types").StoreSessionStoreQueryBuilder,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreReturningInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreReturning(
  value: import("../common/types").StoreSessionStoreReturningInput | any,
): Either<
  import("../common/types").StoreSessionStoreReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenQueryBuilder, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenQueryBuilder(
  value:
    | import("../common/types").StoreSessionStoreTokenQueryBuilderInput
    | any,
): Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilder,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderByInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: import("../common/types").StoreSessionStoreTokenOrderByInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderBySpecInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value: import("../common/types").StoreSessionStoreTokenOrderBySpecInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenReturningInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenReturning(
  value: import("../common/types").StoreSessionStoreTokenReturningInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsert, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsert(
  value: import("../common/types").StoreSessionStoreInsertInput | any,
): Either<import("../common/types").StoreSessionStoreInsert, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertPartialInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsertPartial(
  value: import("../common/types").StoreSessionStoreInsertPartialInput | any,
): Either<
  import("../common/types").StoreSessionStoreInsertPartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdate, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdate(
  value: import("../common/types").StoreSessionStoreUpdateInput | any,
): Either<import("../common/types").StoreSessionStoreUpdate, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdatePartialInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdatePartial(
  value: import("../common/types").StoreSessionStoreUpdatePartialInput | any,
): Either<
  import("../common/types").StoreSessionStoreUpdatePartial,
  ValidatorErrorMap
>;
/**
 * Store all tokens that belong to a session.
 *
 * @param {import("../common/types").StoreSessionStoreTokenInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreToken, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreToken(
  value: import("../common/types").StoreSessionStoreTokenInput | any,
): Either<import("../common/types").StoreSessionStoreToken, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsert, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsert(
  value: import("../common/types").StoreSessionStoreTokenInsertInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenInsert,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertPartialInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsertPartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsertPartial(
  value:
    | import("../common/types").StoreSessionStoreTokenInsertPartialInput
    | any,
): Either<
  import("../common/types").StoreSessionStoreTokenInsertPartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdate, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdate(
  value: import("../common/types").StoreSessionStoreTokenUpdateInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdate,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdatePartialInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdatePartial, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdatePartial(
  value:
    | import("../common/types").StoreSessionStoreTokenUpdatePartialInput
    | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdatePartial,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileResponseInput|any} value
 * @returns {Either<import("../common/types").StoreFileResponse, ValidatorErrorMap>}
 */
export function validateStoreFileResponse(
  value: import("../common/types").StoreFileResponseInput | any,
): Either<import("../common/types").StoreFileResponse, ValidatorErrorMap>;
/**
 * Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.
 *
 * @param {import("../common/types").StoreImageTransformOptionsInput|any} value
 * @returns {Either<import("../common/types").StoreImageTransformOptions, ValidatorErrorMap>}
 */
export function validateStoreImageTransformOptions(
  value: import("../common/types").StoreImageTransformOptionsInput | any,
): Either<
  import("../common/types").StoreImageTransformOptions,
  ValidatorErrorMap
>;
/**
 * Set as '.query(T.reference("store", "secureImageTransformOptions"))' of routes that use 'sendTransformedImage' and 'fileVerifyAccessToken'.
 *
 * @param {import("../common/types").StoreSecureImageTransformOptionsInput|any} value
 * @returns {Either<import("../common/types").StoreSecureImageTransformOptions, ValidatorErrorMap>}
 */
export function validateStoreSecureImageTransformOptions(
  value: import("../common/types").StoreSecureImageTransformOptionsInput | any,
): Either<
  import("../common/types").StoreSecureImageTransformOptions,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileWhereInput_1|any} value
 * @returns {Either<import("../common/types").StoreFileWhere_1, ValidatorErrorMap>}
 */
export function validateStoreFileWhere_1(
  value: import("../common/types").StoreFileWhereInput_1 | any,
): Either<import("../common/types").StoreFileWhere_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobWhereInput_1|any} value
 * @returns {Either<import("../common/types").StoreJobWhere_1, ValidatorErrorMap>}
 */
export function validateStoreJobWhere_1(
  value: import("../common/types").StoreJobWhereInput_1 | any,
): Either<import("../common/types").StoreJobWhere_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreWhereInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreWhere_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreWhere_1(
  value: import("../common/types").StoreSessionStoreWhereInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreWhere_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhereInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenWhere_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenWhere_1(
  value: import("../common/types").StoreSessionStoreTokenWhereInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreTokenWhere_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileUpdateInput_1|any} value
 * @returns {Either<import("../common/types").StoreFileUpdate_1, ValidatorErrorMap>}
 */
export function validateStoreFileUpdate_1(
  value: import("../common/types").StoreFileUpdateInput_1 | any,
): Either<import("../common/types").StoreFileUpdate_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdateInput_1|any} value
 * @returns {Either<import("../common/types").StoreJobUpdate_1, ValidatorErrorMap>}
 */
export function validateStoreJobUpdate_1(
  value: import("../common/types").StoreJobUpdateInput_1 | any,
): Either<import("../common/types").StoreJobUpdate_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdateInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdate_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdate_1(
  value: import("../common/types").StoreSessionStoreUpdateInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreUpdate_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdateInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdate_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdate_1(
  value: import("../common/types").StoreSessionStoreTokenUpdateInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdate_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileOrderByInput_1|any} value
 * @returns {Either<import("../common/types").StoreFileOrderBy_1, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBy_1(
  value: import("../common/types").StoreFileOrderByInput_1 | any,
): Either<import("../common/types").StoreFileOrderBy_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderByInput_1|any} value
 * @returns {Either<import("../common/types").StoreJobOrderBy_1, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBy_1(
  value: import("../common/types").StoreJobOrderByInput_1 | any,
): Either<import("../common/types").StoreJobOrderBy_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderByInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBy_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBy_1(
  value: import("../common/types").StoreSessionStoreOrderByInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreOrderBy_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderByInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBy_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBy_1(
  value: import("../common/types").StoreSessionStoreTokenOrderByInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBy_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileQueryBuilderInput_1|any} value
 * @returns {Either<import("../common/types").StoreFileQueryBuilder_1, ValidatorErrorMap>}
 */
export function validateStoreFileQueryBuilder_1(
  value: import("../common/types").StoreFileQueryBuilderInput_1 | any,
): Either<import("../common/types").StoreFileQueryBuilder_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobQueryBuilderInput_1|any} value
 * @returns {Either<import("../common/types").StoreJobQueryBuilder_1, ValidatorErrorMap>}
 */
export function validateStoreJobQueryBuilder_1(
  value: import("../common/types").StoreJobQueryBuilderInput_1 | any,
): Either<import("../common/types").StoreJobQueryBuilder_1, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreQueryBuilder_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreQueryBuilder_1(
  value: import("../common/types").StoreSessionStoreQueryBuilderInput_1 | any,
): Either<
  import("../common/types").StoreSessionStoreQueryBuilder_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilderInput_1|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenQueryBuilder_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenQueryBuilder_1(
  value:
    | import("../common/types").StoreSessionStoreTokenQueryBuilderInput_1
    | any,
): Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilder_1,
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
