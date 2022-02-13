/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|CompasSqlOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasSqlOrderBy>}
 */
export function validateCompasSqlOrderBy(
  value: undefined | any | CompasSqlOrderByInput,
  propertyPath?: string | undefined,
): Either<CompasSqlOrderBy>;
/**
 * @param {undefined|any|CompasSqlOrderByOptionalFieldInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasSqlOrderByOptionalField>}
 */
export function validateCompasSqlOrderByOptionalField(
  value: undefined | any | CompasSqlOrderByOptionalFieldInput,
  propertyPath?: string | undefined,
): Either<CompasSqlOrderByOptionalField>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
