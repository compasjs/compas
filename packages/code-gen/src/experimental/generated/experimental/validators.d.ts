/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").ExperimentalAnyDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalAnyDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalAnyDefinition(
  value: import("../common/types").ExperimentalAnyDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalAnyDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalAnyOfDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalAnyOfDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalAnyOfDefinition(
  value: import("../common/types").ExperimentalAnyOfDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalAnyOfDefinition,
  ValidatorErrorMap
>;
/**
 * All type definitions that can be used inside other types, like object keys.
 *
 * @param {import("../common/types").ExperimentalTypeSystemDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalTypeSystemDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalTypeSystemDefinition(
  value:
    | import("../common/types").ExperimentalTypeSystemDefinitionInput
    | unknown,
): Either<
  import("../common/types").ExperimentalTypeSystemDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalArrayDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalArrayDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalArrayDefinition(
  value: import("../common/types").ExperimentalArrayDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalArrayDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalBooleanDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalBooleanDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalBooleanDefinition(
  value: import("../common/types").ExperimentalBooleanDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalBooleanDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalCrudDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalCrudDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalCrudDefinition(
  value: import("../common/types").ExperimentalCrudDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalCrudDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalReferenceDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalReferenceDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalReferenceDefinition(
  value:
    | import("../common/types").ExperimentalReferenceDefinitionInput
    | unknown,
): Either<
  import("../common/types").ExperimentalReferenceDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNamePartInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalNamePart, ValidatorErrorMap>}
 */
export function validateExperimentalNamePart(
  value: import("../common/types").ExperimentalNamePartInput | unknown,
): Either<import("../common/types").ExperimentalNamePart, ValidatorErrorMap>;
/**
 * @param {import("../common/types").ExperimentalDateDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalDateDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalDateDefinition(
  value: import("../common/types").ExperimentalDateDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalDateDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalExtendDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalExtendDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalExtendDefinition(
  value: import("../common/types").ExperimentalExtendDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalExtendDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalFileDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalFileDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalFileDefinition(
  value: import("../common/types").ExperimentalFileDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalFileDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalGenericDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalGenericDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalGenericDefinition(
  value: import("../common/types").ExperimentalGenericDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalGenericDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNumberDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalNumberDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalNumberDefinition(
  value: import("../common/types").ExperimentalNumberDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalNumberDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalObjectDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalObjectDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalObjectDefinition(
  value: import("../common/types").ExperimentalObjectDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalObjectDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRelationDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalRelationDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRelationDefinition(
  value:
    | import("../common/types").ExperimentalRelationDefinitionInput
    | unknown,
): Either<
  import("../common/types").ExperimentalRelationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalOmitDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalOmitDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalOmitDefinition(
  value: import("../common/types").ExperimentalOmitDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalOmitDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalPickDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalPickDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalPickDefinition(
  value: import("../common/types").ExperimentalPickDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalPickDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalStringDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalStringDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalStringDefinition(
  value: import("../common/types").ExperimentalStringDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalStringDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalUuidDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalUuidDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalUuidDefinition(
  value: import("../common/types").ExperimentalUuidDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalUuidDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalGenerateOptionsInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalGenerateOptions, ValidatorErrorMap>}
 */
export function validateExperimentalGenerateOptions(
  value: import("../common/types").ExperimentalGenerateOptionsInput | unknown,
): Either<
  import("../common/types").ExperimentalGenerateOptions,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalNamePartOptionalInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalNamePartOptional, ValidatorErrorMap>}
 */
export function validateExperimentalNamePartOptional(
  value: import("../common/types").ExperimentalNamePartOptionalInput | unknown,
): Either<
  import("../common/types").ExperimentalNamePartOptional,
  ValidatorErrorMap
>;
/**
 * This contains all types that can be added top level to the structure.
 *
 * @param {import("../common/types").ExperimentalNamedTypeDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalNamedTypeDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalNamedTypeDefinition(
  value:
    | import("../common/types").ExperimentalNamedTypeDefinitionInput
    | unknown,
): Either<
  import("../common/types").ExperimentalNamedTypeDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRouteDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalRouteDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRouteDefinition(
  value: import("../common/types").ExperimentalRouteDefinitionInput | unknown,
): Either<
  import("../common/types").ExperimentalRouteDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalRouteInvalidationDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalRouteInvalidationDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalRouteInvalidationDefinition(
  value:
    | import("../common/types").ExperimentalRouteInvalidationDefinitionInput
    | unknown,
): Either<
  import("../common/types").ExperimentalRouteInvalidationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").ExperimentalStructureInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalStructure, ValidatorErrorMap>}
 */
export function validateExperimentalStructure(
  value: import("../common/types").ExperimentalStructureInput | unknown,
): Either<import("../common/types").ExperimentalStructure, ValidatorErrorMap>;
/**
 * This contains all known type definitions.
 *
 * @param {import("../common/types").ExperimentalTypeDefinitionInput|unknown} value
 * @returns {Either<import("../common/types").ExperimentalTypeDefinition, ValidatorErrorMap>}
 */
export function validateExperimentalTypeDefinition(
  value: import("../common/types").ExperimentalTypeDefinitionInput | unknown,
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
