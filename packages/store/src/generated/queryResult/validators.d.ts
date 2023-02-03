/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").QueryResultStoreFileInput|unknown} value
 * @returns {Either<import("../common/types").QueryResultStoreFile, ValidatorErrorMap>}
 */
export function validateQueryResultStoreFile(
  value: import("../common/types").QueryResultStoreFileInput | unknown,
): Either<import("../common/types").QueryResultStoreFile, ValidatorErrorMap>;
/**
 * @param {import("../common/types").QueryResultStoreJobInput|unknown} value
 * @returns {Either<import("../common/types").QueryResultStoreJob, ValidatorErrorMap>}
 */
export function validateQueryResultStoreJob(
  value: import("../common/types").QueryResultStoreJobInput | unknown,
): Either<import("../common/types").QueryResultStoreJob, ValidatorErrorMap>;
/**
 * @param {import("../common/types").QueryResultStoreSessionStoreInput|unknown} value
 * @returns {Either<import("../common/types").QueryResultStoreSessionStore, ValidatorErrorMap>}
 */
export function validateQueryResultStoreSessionStore(
  value: import("../common/types").QueryResultStoreSessionStoreInput | unknown,
): Either<
  import("../common/types").QueryResultStoreSessionStore,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").QueryResultStoreSessionStoreTokenInput|unknown} value
 * @returns {Either<import("../common/types").QueryResultStoreSessionStoreToken, ValidatorErrorMap>}
 */
export function validateQueryResultStoreSessionStoreToken(
  value:
    | import("../common/types").QueryResultStoreSessionStoreTokenInput
    | unknown,
): Either<
  import("../common/types").QueryResultStoreSessionStoreToken,
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
