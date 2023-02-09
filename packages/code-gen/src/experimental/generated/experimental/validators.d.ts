/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").ExperimentalAnyDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalAnyDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalAnyDefinition(
  value: import("../common/types").ExperimentalAnyDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalAnyDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalAnyDefinitionTargetInput|any} value
 * @returns {Either<import("../common/types").ExperimentalAnyDefinitionTarget, ValidatorErrorMap>}
 */
export function validateExperimentalAnyDefinitionTarget(
  value: import("../common/types").ExperimentalAnyDefinitionTargetInput | any,
): Either<
  import("../common/types").ExperimentalAnyDefinitionTarget,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalAnyOfDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalAnyOfDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalAnyOfDefinition(
  value: import("../common/types").ExperimentalAnyOfDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalAnyOfDefinition,
  ValidatorErrorMap
>;
/**
 * All type definitions that can be used inside other types, like object keys.
 *
 * @param {import("../common/types").ExperimentalTypeSystemDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalTypeSystemDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalTypeSystemDefinition(
  value: import("../common/types").ExperimentalTypeSystemDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalTypeSystemDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalArrayDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalArrayDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalArrayDefinition(
  value: import("../common/types").ExperimentalArrayDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalArrayDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalBooleanDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalBooleanDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalBooleanDefinition(
  value: import("../common/types").ExperimentalBooleanDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalBooleanDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalCrudDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalCrudDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalCrudDefinition(
  value: import("../common/types").ExperimentalCrudDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalCrudDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalReferenceDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalReferenceDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalReferenceDefinition(
  value: import("../common/types").ExperimentalReferenceDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalReferenceDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNamePartInput|any} value
 * @returns {Either<import("../common/types").ExperimentalNamePart, ValidatorErrorMap>}
 */
export function validateExperimentalNamePart(
  value: import("../common/types").ExperimentalNamePartInput | any,
): Either<import("../common/types").ExperimentalNamePart, ValidatorErrorMap>;
/**
 * @param {import("../common/types").ExperimentalDateDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalDateDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalDateDefinition(
  value: import("../common/types").ExperimentalDateDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalDateDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalExtendDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalExtendDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalExtendDefinition(
  value: import("../common/types").ExperimentalExtendDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalExtendDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalFileDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalFileDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalFileDefinition(
  value: import("../common/types").ExperimentalFileDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalFileDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalGenericDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalGenericDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalGenericDefinition(
  value: import("../common/types").ExperimentalGenericDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalGenericDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNumberDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalNumberDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalNumberDefinition(
  value: import("../common/types").ExperimentalNumberDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalNumberDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalObjectDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalObjectDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalObjectDefinition(
  value: import("../common/types").ExperimentalObjectDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalObjectDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRelationDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalRelationDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRelationDefinition(
  value: import("../common/types").ExperimentalRelationDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalRelationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalOmitDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalOmitDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalOmitDefinition(
  value: import("../common/types").ExperimentalOmitDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalOmitDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalPickDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalPickDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalPickDefinition(
  value: import("../common/types").ExperimentalPickDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalPickDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalStringDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalStringDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalStringDefinition(
  value: import("../common/types").ExperimentalStringDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalStringDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalUuidDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalUuidDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalUuidDefinition(
  value: import("../common/types").ExperimentalUuidDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalUuidDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalGenerateOptionsInput|any} value
 * @returns {Either<import("../common/types").ExperimentalGenerateOptions, ValidatorErrorMap>}
 */
export function validateExperimentalGenerateOptions(
  value: import("../common/types").ExperimentalGenerateOptionsInput | any,
): Either<
  import("../common/types").ExperimentalGenerateOptions,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNamePartOptionalInput|any} value
 * @returns {Either<import("../common/types").ExperimentalNamePartOptional, ValidatorErrorMap>}
 */
export function validateExperimentalNamePartOptional(
  value: import("../common/types").ExperimentalNamePartOptionalInput | any,
): Either<
  import("../common/types").ExperimentalNamePartOptional,
  ValidatorErrorMap
>;
/**
 * This contains all types that can be added top level to the structure.
 *
 * @param {import("../common/types").ExperimentalNamedTypeDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalNamedTypeDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalNamedTypeDefinition(
  value: import("../common/types").ExperimentalNamedTypeDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalNamedTypeDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRouteDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalRouteDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRouteDefinition(
  value: import("../common/types").ExperimentalRouteDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalRouteDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRouteInvalidationDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalRouteInvalidationDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRouteInvalidationDefinition(
  value:
    | import("../common/types").ExperimentalRouteInvalidationDefinitionInput
    | any,
): Either<
  import("../common/types").ExperimentalRouteInvalidationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalStructureInput|any} value
 * @returns {Either<import("../common/types").ExperimentalStructure, ValidatorErrorMap>}
 */
export function validateExperimentalStructure(
  value: import("../common/types").ExperimentalStructureInput | any,
): Either<import("../common/types").ExperimentalStructure, ValidatorErrorMap>;
/**
 * This contains all known type definitions.
 *
 * @param {import("../common/types").ExperimentalTypeDefinitionInput|any} value
 * @returns {Either<import("../common/types").ExperimentalTypeDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalTypeDefinition(
  value: import("../common/types").ExperimentalTypeDefinitionInput | any,
): Either<
  import("../common/types").ExperimentalTypeDefinition,
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
