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
 * @param {import("../common/types").StoreFileWhere|any} value
 * @returns {Either<import("../common/types").StoreFileWhereValidated, ValidatorErrorMap>}
 */
export function validateStoreFileWhereValidated(
  value: import("../common/types").StoreFileWhere | any,
): Either<import("../common/types").StoreFileWhereValidated, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileOrderBy|any} value
 * @returns {Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBy(
  value: import("../common/types").StoreFileOrderBy | any,
): Either<import("../common/types").StoreFileOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileOrderBySpec|any} value
 * @returns {Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreFileOrderBySpec(
  value: import("../common/types").StoreFileOrderBySpec | any,
): Either<import("../common/types").StoreFileOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileQueryBuilder|any} value
 * @returns {Either<import("../common/types").StoreFileQueryBuilderValidated, ValidatorErrorMap>}
 */
export function validateStoreFileQueryBuilderValidated(
  value: import("../common/types").StoreFileQueryBuilder | any,
): Either<
  import("../common/types").StoreFileQueryBuilderValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileReturning|any} value
 * @returns {Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>}
 */
export function validateStoreFileReturning(
  value: import("../common/types").StoreFileReturning | any,
): Either<import("../common/types").StoreFileReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreFileInsert|any} value
 * @returns {Either<import("../common/types").StoreFileInsertValidated, ValidatorErrorMap>}
 */
export function validateStoreFileInsertValidated(
  value: import("../common/types").StoreFileInsert | any,
): Either<
  import("../common/types").StoreFileInsertValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileInsertPartial|any} value
 * @returns {Either<import("../common/types").StoreFileInsertPartialValidated, ValidatorErrorMap>}
 */
export function validateStoreFileInsertPartialValidated(
  value: import("../common/types").StoreFileInsertPartial | any,
): Either<
  import("../common/types").StoreFileInsertPartialValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileUpdate|any} value
 * @returns {Either<import("../common/types").StoreFileUpdateValidated, ValidatorErrorMap>}
 */
export function validateStoreFileUpdateValidated(
  value: import("../common/types").StoreFileUpdate | any,
): Either<
  import("../common/types").StoreFileUpdateValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileUpdatePartial|any} value
 * @returns {Either<import("../common/types").StoreFileUpdatePartialValidated, ValidatorErrorMap>}
 */
export function validateStoreFileUpdatePartialValidated(
  value: import("../common/types").StoreFileUpdatePartial | any,
): Either<
  import("../common/types").StoreFileUpdatePartialValidated,
  ValidatorErrorMap
>;
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
 * @param {import("../common/types").StoreJobWhere|any} value
 * @returns {Either<import("../common/types").StoreJobWhereValidated, ValidatorErrorMap>}
 */
export function validateStoreJobWhereValidated(
  value: import("../common/types").StoreJobWhere | any,
): Either<import("../common/types").StoreJobWhereValidated, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderBy|any} value
 * @returns {Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBy(
  value: import("../common/types").StoreJobOrderBy | any,
): Either<import("../common/types").StoreJobOrderBy, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobOrderBySpec|any} value
 * @returns {Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreJobOrderBySpec(
  value: import("../common/types").StoreJobOrderBySpec | any,
): Either<import("../common/types").StoreJobOrderBySpec, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobQueryBuilder|any} value
 * @returns {Either<import("../common/types").StoreJobQueryBuilderValidated, ValidatorErrorMap>}
 */
export function validateStoreJobQueryBuilderValidated(
  value: import("../common/types").StoreJobQueryBuilder | any,
): Either<
  import("../common/types").StoreJobQueryBuilderValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobReturning|any} value
 * @returns {Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>}
 */
export function validateStoreJobReturning(
  value: import("../common/types").StoreJobReturning | any,
): Either<import("../common/types").StoreJobReturning, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsert|any} value
 * @returns {Either<import("../common/types").StoreJobInsertValidated, ValidatorErrorMap>}
 */
export function validateStoreJobInsertValidated(
  value: import("../common/types").StoreJobInsert | any,
): Either<import("../common/types").StoreJobInsertValidated, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobInsertPartial|any} value
 * @returns {Either<import("../common/types").StoreJobInsertPartialValidated, ValidatorErrorMap>}
 */
export function validateStoreJobInsertPartialValidated(
  value: import("../common/types").StoreJobInsertPartial | any,
): Either<
  import("../common/types").StoreJobInsertPartialValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobUpdate|any} value
 * @returns {Either<import("../common/types").StoreJobUpdateValidated, ValidatorErrorMap>}
 */
export function validateStoreJobUpdateValidated(
  value: import("../common/types").StoreJobUpdate | any,
): Either<import("../common/types").StoreJobUpdateValidated, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StoreJobUpdatePartial|any} value
 * @returns {Either<import("../common/types").StoreJobUpdatePartialValidated, ValidatorErrorMap>}
 */
export function validateStoreJobUpdatePartialValidated(
  value: import("../common/types").StoreJobUpdatePartial | any,
): Either<
  import("../common/types").StoreJobUpdatePartialValidated,
  ValidatorErrorMap
>;
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
 * @param {import("../common/types").StoreSessionStoreWhere|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreWhereValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreWhereValidated(
  value: import("../common/types").StoreSessionStoreWhere | any,
): Either<
  import("../common/types").StoreSessionStoreWhereValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhere|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenWhereValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenWhereValidated(
  value: import("../common/types").StoreSessionStoreTokenWhere | any,
): Either<
  import("../common/types").StoreSessionStoreTokenWhereValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderBy|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBy(
  value: import("../common/types").StoreSessionStoreOrderBy | any,
): Either<
  import("../common/types").StoreSessionStoreOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderBySpec|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderBySpec(
  value: import("../common/types").StoreSessionStoreOrderBySpec | any,
): Either<
  import("../common/types").StoreSessionStoreOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilder|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreQueryBuilderValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreQueryBuilderValidated(
  value: import("../common/types").StoreSessionStoreQueryBuilder | any,
): Either<
  import("../common/types").StoreSessionStoreQueryBuilderValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreReturning|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreReturning(
  value: import("../common/types").StoreSessionStoreReturning | any,
): Either<
  import("../common/types").StoreSessionStoreReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilder|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenQueryBuilderValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenQueryBuilderValidated(
  value: import("../common/types").StoreSessionStoreTokenQueryBuilder | any,
): Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilderValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderBy|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBy, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBy(
  value: import("../common/types").StoreSessionStoreTokenOrderBy | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBy,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderBySpec|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderBySpec, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderBySpec(
  value: import("../common/types").StoreSessionStoreTokenOrderBySpec | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderBySpec,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenReturning|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenReturning, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenReturning(
  value: import("../common/types").StoreSessionStoreTokenReturning | any,
): Either<
  import("../common/types").StoreSessionStoreTokenReturning,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsert|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsertValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsertValidated(
  value: import("../common/types").StoreSessionStoreInsert | any,
): Either<
  import("../common/types").StoreSessionStoreInsertValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreInsertPartial|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreInsertPartialValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreInsertPartialValidated(
  value: import("../common/types").StoreSessionStoreInsertPartial | any,
): Either<
  import("../common/types").StoreSessionStoreInsertPartialValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdate|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdateValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdateValidated(
  value: import("../common/types").StoreSessionStoreUpdate | any,
): Either<
  import("../common/types").StoreSessionStoreUpdateValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdatePartial|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdatePartialValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdatePartialValidated(
  value: import("../common/types").StoreSessionStoreUpdatePartial | any,
): Either<
  import("../common/types").StoreSessionStoreUpdatePartialValidated,
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
 * @param {import("../common/types").StoreSessionStoreTokenInsert|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsertValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsertValidated(
  value: import("../common/types").StoreSessionStoreTokenInsert | any,
): Either<
  import("../common/types").StoreSessionStoreTokenInsertValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenInsertPartial|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenInsertPartialValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenInsertPartialValidated(
  value: import("../common/types").StoreSessionStoreTokenInsertPartial | any,
): Either<
  import("../common/types").StoreSessionStoreTokenInsertPartialValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdate|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdateValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdateValidated(
  value: import("../common/types").StoreSessionStoreTokenUpdate | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdateValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdatePartial|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdatePartialValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdatePartialValidated(
  value: import("../common/types").StoreSessionStoreTokenUpdatePartial | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdatePartialValidated,
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
 * @param {import("../common/types").StoreFileWhereInput|any} value
 * @returns {Either<import("../common/types").StoreFileWhereValidated_1, ValidatorErrorMap>}
 */
export function validateStoreFileWhereValidated_1(
  value: import("../common/types").StoreFileWhereInput | any,
): Either<
  import("../common/types").StoreFileWhereValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobWhereInput|any} value
 * @returns {Either<import("../common/types").StoreJobWhereValidated_1, ValidatorErrorMap>}
 */
export function validateStoreJobWhereValidated_1(
  value: import("../common/types").StoreJobWhereInput | any,
): Either<
  import("../common/types").StoreJobWhereValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreWhereInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreWhereValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreWhereValidated_1(
  value: import("../common/types").StoreSessionStoreWhereInput | any,
): Either<
  import("../common/types").StoreSessionStoreWhereValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenWhereInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenWhereValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenWhereValidated_1(
  value: import("../common/types").StoreSessionStoreTokenWhereInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenWhereValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreFileUpdateValidated_1, ValidatorErrorMap>}
 */
export function validateStoreFileUpdateValidated_1(
  value: import("../common/types").StoreFileUpdateInput | any,
): Either<
  import("../common/types").StoreFileUpdateValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreJobUpdateValidated_1, ValidatorErrorMap>}
 */
export function validateStoreJobUpdateValidated_1(
  value: import("../common/types").StoreJobUpdateInput | any,
): Either<
  import("../common/types").StoreJobUpdateValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreUpdateValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreUpdateValidated_1(
  value: import("../common/types").StoreSessionStoreUpdateInput | any,
): Either<
  import("../common/types").StoreSessionStoreUpdateValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenUpdateInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenUpdateValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenUpdateValidated_1(
  value: import("../common/types").StoreSessionStoreTokenUpdateInput | any,
): Either<
  import("../common/types").StoreSessionStoreTokenUpdateValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileOrderByValidated|any} value
 * @returns {Either<import("../common/types").StoreFileOrderByValidated, ValidatorErrorMap>}
 */
export function validateStoreFileOrderByValidated(
  value: import("../common/types").StoreFileOrderByValidated | any,
): Either<
  import("../common/types").StoreFileOrderByValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobOrderByValidated|any} value
 * @returns {Either<import("../common/types").StoreJobOrderByValidated, ValidatorErrorMap>}
 */
export function validateStoreJobOrderByValidated(
  value: import("../common/types").StoreJobOrderByValidated | any,
): Either<
  import("../common/types").StoreJobOrderByValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreOrderByValidated|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreOrderByValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreOrderByValidated(
  value: import("../common/types").StoreSessionStoreOrderByValidated | any,
): Either<
  import("../common/types").StoreSessionStoreOrderByValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenOrderByValidated|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenOrderByValidated, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenOrderByValidated(
  value: import("../common/types").StoreSessionStoreTokenOrderByValidated | any,
): Either<
  import("../common/types").StoreSessionStoreTokenOrderByValidated,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreFileQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreFileQueryBuilderValidated_1, ValidatorErrorMap>}
 */
export function validateStoreFileQueryBuilderValidated_1(
  value: import("../common/types").StoreFileQueryBuilderInput | any,
): Either<
  import("../common/types").StoreFileQueryBuilderValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreJobQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreJobQueryBuilderValidated_1, ValidatorErrorMap>}
 */
export function validateStoreJobQueryBuilderValidated_1(
  value: import("../common/types").StoreJobQueryBuilderInput | any,
): Either<
  import("../common/types").StoreJobQueryBuilderValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreQueryBuilderValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreQueryBuilderValidated_1(
  value: import("../common/types").StoreSessionStoreQueryBuilderInput | any,
): Either<
  import("../common/types").StoreSessionStoreQueryBuilderValidated_1,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StoreSessionStoreTokenQueryBuilderInput|any} value
 * @returns {Either<import("../common/types").StoreSessionStoreTokenQueryBuilderValidated_1, ValidatorErrorMap>}
 */
export function validateStoreSessionStoreTokenQueryBuilderValidated_1(
  value:
    | import("../common/types").StoreSessionStoreTokenQueryBuilderInput
    | any,
): Either<
  import("../common/types").StoreSessionStoreTokenQueryBuilderValidated_1,
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
