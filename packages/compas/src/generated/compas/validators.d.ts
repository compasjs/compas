/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").CompasConfig|any} value
 * @returns {Either<import("../common/types").CompasConfig, ValidatorErrorMap>}
 */
export function validateCompasConfig(
  value: import("../common/types").CompasConfig | any,
): Either<import("../common/types").CompasConfig, ValidatorErrorMap>;
/**
 * @param {import("../common/types").CompasResolvedConfig|any} value
 * @returns {Either<import("../common/types").CompasResolvedConfig, ValidatorErrorMap>}
 */
export function validateCompasResolvedConfig(
  value: import("../common/types").CompasResolvedConfig | any,
): Either<import("../common/types").CompasResolvedConfig, ValidatorErrorMap>;
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
