/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").CliCommandDefinitionInput|any} value
 * @returns {Either<import("../common/types").CliCommandDefinition, ValidatorErrorMap>}
 */
export function validateCliCommandDefinition(
  value: import("../common/types").CliCommandDefinitionInput | any,
): Either<import("../common/types").CliCommandDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").CliFlagDefinitionInput|any} value
 * @returns {Either<import("../common/types").CliFlagDefinition, ValidatorErrorMap>}
 */
export function validateCliFlagDefinition(
  value: import("../common/types").CliFlagDefinitionInput | any,
): Either<import("../common/types").CliFlagDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").CliCompletion|any} value
 * @returns {Either<import("../common/types").CliCompletion, ValidatorErrorMap>}
 */
export function validateCliCompletion(
  value: import("../common/types").CliCompletion | any,
): Either<import("../common/types").CliCompletion, ValidatorErrorMap>;
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
