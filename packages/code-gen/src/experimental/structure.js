import { AppError, isNil } from "@compas/stdlib";
import { isNamedTypeBuilderLike } from "../builders/index.js";
import { typeDefinitionHelpers } from "./type-definition.js";

/**
 * Add a specific type to the structure
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {import("./generated/common/types").ExperimentalNamedTypeDefinition} type
 * @param {{ skipReferencesCheck: boolean }} options
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

  if (!options?.skipReferencesCheck) {
    structureExtractReferences(structure, type);
  }
}

/**
 * Returns an array of all the named types in the provided structure
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @returns {import("./generated/common/types").ExperimentalNamedTypeDefinition[]}
 */
export function structureNamedTypes(structure) {
  return Object.values(structure)
    .map((it) => Object.values(it))
    .flat();
}

/**
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {string[]} groups
 * @returns {import("./generated/common/types").ExperimentalStructure}
 */
export function structureExtractGroups(structure, groups) {
  /** @type {import("./generated/common/types").ExperimentalStructure} */
  const newStructure = {};

  for (const group of groups) {
    for (const namedType of Object.values(structure[group] ?? {})) {
      structureAddType(newStructure, namedType, { skipReferencesCheck: true });

      structureIncludeReferences(structure, newStructure, namedType);
    }
  }

  return newStructure;
}

/**
 * Top down extract references from the provided type. Unlike the previous versions of
 * code-gen we prefer to keep references as much as possible and resolve them on the fly
 * while generating if necessary.
 *
 * @param {import("./generated/common/types").ExperimentalStructure} structure
 * @param {import("./generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureExtractReferences(structure, type) {
  typeDefinitionHelpers[type.type].structureExtractReferences(structure, type);
}

/**
 * Include all references referenced by type in to the new structure.
 *
 * @param {import("./generated/common/types").ExperimentalStructure} fullStructure
 * @param {import("./generated/common/types").ExperimentalStructure} newStructure
 * @param {import("./generated/common/types").ExperimentalTypeDefinition} type
 */
export function structureIncludeReferences(fullStructure, newStructure, type) {
  typeDefinitionHelpers[type.type].structureIncludeReferences(
    fullStructure,
    newStructure,
    type,
  );
}
