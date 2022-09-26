/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|import("../common/types").ExperimentalBooleanDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalBooleanDefinition>}
 */
export function validateExperimentalBooleanDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalBooleanDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalBooleanDefinition>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalGenerateOptionsInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalGenerateOptions>}
 */
export function validateExperimentalGenerateOptions(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalGenerateOptionsInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalGenerateOptions>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalNamePartInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalNamePart>}
 */
export function validateExperimentalNamePart(
  value: undefined | any | import("../common/types").ExperimentalNamePartInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalNamePart>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalNamedTypeDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalNamedTypeDefinition>}
 */
export function validateExperimentalNamedTypeDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalNamedTypeDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalNamedTypeDefinition>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalNumberDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalNumberDefinition>}
 */
export function validateExperimentalNumberDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalNumberDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalNumberDefinition>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalReferenceDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalReferenceDefinition>}
 */
export function validateExperimentalReferenceDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalReferenceDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalReferenceDefinition>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalStringDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalStringDefinition>}
 */
export function validateExperimentalStringDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalStringDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalStringDefinition>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalStructureInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalStructure>}
 */
export function validateExperimentalStructure(
  value: undefined | any | import("../common/types").ExperimentalStructureInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalStructure>;
/**
 * @param {undefined|any|import("../common/types").ExperimentalTypeDefinitionInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<import("../common/types").ExperimentalTypeDefinition>}
 */
export function validateExperimentalTypeDefinition(
  value:
    | undefined
    | any
    | import("../common/types").ExperimentalTypeDefinitionInput,
  propertyPath?: string | undefined,
): Either<import("../common/types").ExperimentalTypeDefinition>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=validators.d.ts.map
