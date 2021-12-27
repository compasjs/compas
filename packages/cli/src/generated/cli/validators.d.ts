/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|import("../common/types").CliCommandDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CliCommandDefinition>}
 */
export function validateCliCommandDefinition(
  value: undefined | any | import("../common/types").CliCommandDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").CliCommandDefinition>;
/**
 * @param {undefined|any|import("../common/types").CliFlagDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").CliFlagDefinition>}
 */
export function validateCliFlagDefinition(
  value: undefined | any | import("../common/types").CliFlagDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").CliFlagDefinition>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
