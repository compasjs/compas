/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasSqlOrderBy>}
 */
export function validateCompasSqlOrderBy(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CompasSqlOrderBy>;
/**
 * @param {undefined|any} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasSqlOrderByOptionalField>}
 */
export function validateCompasSqlOrderByOptionalField(
  value: undefined | any,
  propertyPath?: string | undefined,
): Either<CompasSqlOrderByOptionalField>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
