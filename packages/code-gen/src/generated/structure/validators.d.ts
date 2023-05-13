/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
/**
 * @typedef {Record<string, any|undefined>} ValidatorErrorMap
 */
/**
 * @param {import("../common/types").StructureAnyDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureAnyDefinition, ValidatorErrorMap>}
 */
export function validateStructureAnyDefinition(
  value: import("../common/types").StructureAnyDefinitionInput | any,
): Either<import("../common/types").StructureAnyDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureAnyDefinitionTarget|any} value
 * @returns {Either<import("../common/types").StructureAnyDefinitionTarget, ValidatorErrorMap>}
 */
export function validateStructureAnyDefinitionTarget(
  value: import("../common/types").StructureAnyDefinitionTarget | any,
): Either<
  import("../common/types").StructureAnyDefinitionTarget,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureAnyOfDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureAnyOfDefinition, ValidatorErrorMap>}
 */
export function validateStructureAnyOfDefinition(
  value: import("../common/types").StructureAnyOfDefinitionInput | any,
): Either<
  import("../common/types").StructureAnyOfDefinition,
  ValidatorErrorMap
>;
/**
 * All type definitions that can be used inside other types, like object keys.
 *
 * @param {import("../common/types").StructureTypeSystemDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureTypeSystemDefinition, ValidatorErrorMap>}
 */
export function validateStructureTypeSystemDefinition(
  value: import("../common/types").StructureTypeSystemDefinitionInput | any,
): Either<
  import("../common/types").StructureTypeSystemDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureArrayDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureArrayDefinition, ValidatorErrorMap>}
 */
export function validateStructureArrayDefinition(
  value: import("../common/types").StructureArrayDefinitionInput | any,
): Either<
  import("../common/types").StructureArrayDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureBooleanDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureBooleanDefinition, ValidatorErrorMap>}
 */
export function validateStructureBooleanDefinition(
  value: import("../common/types").StructureBooleanDefinitionInput | any,
): Either<
  import("../common/types").StructureBooleanDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureCrudDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureCrudDefinition, ValidatorErrorMap>}
 */
export function validateStructureCrudDefinition(
  value: import("../common/types").StructureCrudDefinitionInput | any,
): Either<import("../common/types").StructureCrudDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureReferenceDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureReferenceDefinition, ValidatorErrorMap>}
 */
export function validateStructureReferenceDefinition(
  value: import("../common/types").StructureReferenceDefinitionInput | any,
): Either<
  import("../common/types").StructureReferenceDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureNamePart|any} value
 * @returns {Either<import("../common/types").StructureNamePart, ValidatorErrorMap>}
 */
export function validateStructureNamePart(
  value: import("../common/types").StructureNamePart | any,
): Either<import("../common/types").StructureNamePart, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureDateDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureDateDefinition, ValidatorErrorMap>}
 */
export function validateStructureDateDefinition(
  value: import("../common/types").StructureDateDefinitionInput | any,
): Either<import("../common/types").StructureDateDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureExtendDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureExtendDefinition, ValidatorErrorMap>}
 */
export function validateStructureExtendDefinition(
  value: import("../common/types").StructureExtendDefinitionInput | any,
): Either<
  import("../common/types").StructureExtendDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureRelationDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureRelationDefinition, ValidatorErrorMap>}
 */
export function validateStructureRelationDefinition(
  value: import("../common/types").StructureRelationDefinitionInput | any,
): Either<
  import("../common/types").StructureRelationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureFileDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureFileDefinition, ValidatorErrorMap>}
 */
export function validateStructureFileDefinition(
  value: import("../common/types").StructureFileDefinitionInput | any,
): Either<import("../common/types").StructureFileDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureGenericDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureGenericDefinition, ValidatorErrorMap>}
 */
export function validateStructureGenericDefinition(
  value: import("../common/types").StructureGenericDefinitionInput | any,
): Either<
  import("../common/types").StructureGenericDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureNumberDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureNumberDefinition, ValidatorErrorMap>}
 */
export function validateStructureNumberDefinition(
  value: import("../common/types").StructureNumberDefinitionInput | any,
): Either<
  import("../common/types").StructureNumberDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureObjectDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureObjectDefinition, ValidatorErrorMap>}
 */
export function validateStructureObjectDefinition(
  value: import("../common/types").StructureObjectDefinitionInput | any,
): Either<
  import("../common/types").StructureObjectDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureOmitDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureOmitDefinition, ValidatorErrorMap>}
 */
export function validateStructureOmitDefinition(
  value: import("../common/types").StructureOmitDefinitionInput | any,
): Either<import("../common/types").StructureOmitDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructurePickDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructurePickDefinition, ValidatorErrorMap>}
 */
export function validateStructurePickDefinition(
  value: import("../common/types").StructurePickDefinitionInput | any,
): Either<import("../common/types").StructurePickDefinition, ValidatorErrorMap>;
/**
 * @param {import("../common/types").StructureStringDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureStringDefinition, ValidatorErrorMap>}
 */
export function validateStructureStringDefinition(
  value: import("../common/types").StructureStringDefinitionInput | any,
): Either<
  import("../common/types").StructureStringDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureUuidDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureUuidDefinition, ValidatorErrorMap>}
 */
export function validateStructureUuidDefinition(
  value: import("../common/types").StructureUuidDefinitionInput | any,
): Either<import("../common/types").StructureUuidDefinition, ValidatorErrorMap>;
/**
 * Select the targets and generators to be used when generating. See {@link https://compasjs.com/generators/targets.html} for more information.
 *
 * @param {import("../common/types").StructureGenerateOptionsInput|any} value
 * @returns {Either<import("../common/types").StructureGenerateOptions, ValidatorErrorMap>}
 */
export function validateStructureGenerateOptions(
  value: import("../common/types").StructureGenerateOptionsInput | any,
): Either<
  import("../common/types").StructureGenerateOptions,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureNamePartOptional|any} value
 * @returns {Either<import("../common/types").StructureNamePartOptional, ValidatorErrorMap>}
 */
export function validateStructureNamePartOptional(
  value: import("../common/types").StructureNamePartOptional | any,
): Either<
  import("../common/types").StructureNamePartOptional,
  ValidatorErrorMap
>;
/**
 * This contains all types that can be added top level to the structure.
 *
 * @param {import("../common/types").StructureNamedTypeDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureNamedTypeDefinition, ValidatorErrorMap>}
 */
export function validateStructureNamedTypeDefinition(
  value: import("../common/types").StructureNamedTypeDefinitionInput | any,
): Either<
  import("../common/types").StructureNamedTypeDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureRouteDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureRouteDefinition, ValidatorErrorMap>}
 */
export function validateStructureRouteDefinition(
  value: import("../common/types").StructureRouteDefinitionInput | any,
): Either<
  import("../common/types").StructureRouteDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureRouteInvalidationDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureRouteInvalidationDefinition, ValidatorErrorMap>}
 */
export function validateStructureRouteInvalidationDefinition(
  value:
    | import("../common/types").StructureRouteInvalidationDefinitionInput
    | any,
): Either<
  import("../common/types").StructureRouteInvalidationDefinition,
  ValidatorErrorMap
>;
/**
 * @param {import("../common/types").StructureStructureInput|any} value
 * @returns {Either<import("../common/types").StructureStructure, ValidatorErrorMap>}
 */
export function validateStructureStructure(
  value: import("../common/types").StructureStructureInput | any,
): Either<import("../common/types").StructureStructure, ValidatorErrorMap>;
/**
 * This contains all known type definitions.
 *
 * @param {import("../common/types").StructureTypeDefinitionInput|any} value
 * @returns {Either<import("../common/types").StructureTypeDefinition, ValidatorErrorMap>}
 */
export function validateStructureTypeDefinition(
  value: import("../common/types").StructureTypeDefinitionInput | any,
): Either<import("../common/types").StructureTypeDefinition, ValidatorErrorMap>;
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
