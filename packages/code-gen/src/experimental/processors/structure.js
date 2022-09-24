import { AppError, isNil } from "@compas/stdlib";
import { isNamedTypeBuilderLike } from "../../builders/index.js";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { typeDefinitionHelpers } from "./type-definition.js";

/**
 * Add a specific type to the structure
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalNamedTypeDefinition} type
 * @param {{ skipReferenceExtraction: boolean }} options
 */
export function structureAddType(structure, type, options) {
  if (!isNamedTypeBuilderLike(type)) {
    throw AppError.serverError({
      message: `Could not add this type to the structure, as it doesn't have a name. Provided when creating the type like 'T.bool("myName")'.`,
      type,
    });
  }

  if (isNil(structure[type.group])) {
    structure[type.group] = {};
  }

  structure[type.group][type.name] = type;

  if (!options?.skipReferenceExtraction) {
    structureExtractReferences(structure, type);
  }
}

/**
 * Returns an array of all the named types in the provided structure
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @returns {import("../generated/common/types").ExperimentalNamedTypeDefinition[]}
 */
export function structureNamedTypes(structure) {
  return Object.values(structure)
    .map((it) => Object.values(it))
    .flat();
}

/**
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {string[]} groups
 * @returns {import("../generated/common/types").ExperimentalStructure}
 */
export function structureExtractGroups(structure, groups) {
  /** @type {import("../generated/common/types").ExperimentalStructure} */
  const newStructure = {};

  for (const group of groups) {
    for (const namedType of Object.values(structure[group] ?? {})) {
      structureAddType(newStructure, namedType, {
        skipReferenceExtraction: true,
      });

      structureIncludeReferences(structure, newStructure, namedType);
    }
  }

  return newStructure;
}

/**
 * Check if all references in the current structure resolve
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 */
export function structureValidateReferences(structure) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const namedType of structureNamedTypes(structure)) {
    try {
      structureValidateReferenceForType(structure, namedType, [
        stringFormatNameForError(namedType),
      ]);
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Resolve the provided reference
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} reference
 * @returns {import("../generated/common/types").ExperimentalNamedTypeDefinition}
 */
export function structureResolveReference(structure, reference) {
  if (reference.type !== "reference") {
    throw AppError.serverError({
      message: `Expected 'reference', found ${stringFormatNameForError({
        type: reference.type,
      })}`,
      reference,
    });
  }

  const result =
    structure[reference.reference.group]?.[reference.reference.name];

  if (!result) {
    throw AppError.serverError({
      message: `Could not resolve reference to ${stringFormatNameForError(
        reference.reference,
      )}`,
    });
  }

  return result;
}

/**
 * Copy and sort the structure. We do this for 2 reasons;
 * - It allows multiple generate calls within the same 'Generator'
 * - The JS iterators in Node.js are based on object insertion order, so this ensures
 * that our output is stable.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @returns {import("../generated/common/types").ExperimentalStructure}
 */
export function structureCopyAndSort(structure) {
  /** @type {import("../generated/common/types").ExperimentalStructure} */
  const newStructure = {};

  const groups = Object.keys(structure).sort();
  for (const group of groups) {
    // This makes sure that an empty group is copied over as well, may have semantic
    // meaning sometime down the road.
    newStructure[group] = {};

    const typeNames = Object.keys(structure[group]).sort();

    for (const name of typeNames) {
      structureAddType(newStructure, structure[group][name], {
        skipReferenceExtraction: true,
      });
    }
  }

  return newStructure;
}

/**
 * Top down extract references from the provided type. Unlike the previous versions of
 * code-gen we prefer to keep references as much as possible and resolve them on the fly
 * while generating if necessary.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureExtractReferences(structure, type) {
  // @ts-expect-error
  typeDefinitionHelpers[type.type].structureExtractReferences(structure, type);
}

/**
 * Include all references referenced by type in to the new structure.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} fullStructure
 * @param {import("../generated/common/types").ExperimentalStructure} newStructure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureIncludeReferences(fullStructure, newStructure, type) {
  typeDefinitionHelpers[type.type].structureIncludeReferences(
    fullStructure,
    newStructure,

    // @ts-expect-error
    type,
  );
}

/**
 * Recursively check if all references used by the provided type can be resolved.
 *
 * @param {import("../generated/common/types").ExperimentalStructure} structure
 * @param {import("../generated/common/types").ExperimentalTypeDefinition} type
 * @param {string[]} parentTypeStack
 */
export function structureValidateReferenceForType(
  structure,
  type,
  parentTypeStack,
) {
  typeDefinitionHelpers[type.type].structureValidateReferenceForType(
    structure,

    // @ts-expect-error
    type,
    parentTypeStack,
  );
}
