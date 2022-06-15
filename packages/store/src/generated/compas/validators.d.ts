/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|CompasOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasOrderBy>}
 */
export function validateCompasOrderBy(
  value: undefined | any | CompasOrderByInput,
  propertyPath?: string | undefined,
): Either<CompasOrderBy>;
/**
 * @param {undefined|any|CompasOrderByOptionalInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasOrderByOptional>}
 */
export function validateCompasOrderByOptional(
  value: undefined | any | CompasOrderByOptionalInput,
  propertyPath?: string | undefined,
): Either<CompasOrderByOptional>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
