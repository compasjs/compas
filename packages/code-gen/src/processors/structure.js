import { AppError, isNil } from "@compas/stdlib";
import { isNamedTypeBuilderLike } from "../builders/index.js";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Add a specific type to the structure. By default, directly normalizes references and
 * extracts them via {@link structureExtractReferences}.
 *
 * This function can be used all over the generation process, to optimize cases where
 * references are already normalized, it supports to skip reference extraction.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @param {import("../generated/common/types.js").ExperimentalNamedTypeDefinition} type
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
 * Returns an array of all the named types in the provided structure.
 * Can be used to iterate over the full structure, without using nested loops
 *
 * ```
 * // Without this function.
 * for (const group of Object.keys(structure)) {
 *   for (const name of Object.keys(structure[group])) {
 *     const namedType = structure[group][name];
 *   }
 * }
 *
 * // Can be written as
 * for (const namedType of structureNamedTypes(structure) {
 *
 * }
 * ```
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @returns {(import("../types.js").NamedType<import("../generated/common/types").ExperimentalNamedTypeDefinition>)[]}
 */
export function structureNamedTypes(structure) {
  // @ts-expect-error
  //
  // All top level types here are named
  return Object.values(structure)
    .map((it) => Object.values(it))
    .flat();
}

/**
 * Extract a selection of groups from the provided structure. This function resolves
 * references that point to not included groups and will try to include them.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @param {string[]} groups
 * @returns {import("../generated/common/types.js").ExperimentalStructure}
 */
export function structureExtractGroups(structure, groups) {
  /** @type {import("../generated/common/types.js").ExperimentalStructure} */
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
 * Check if all references in the current structure resolve. Will try to collect as much
 * errors as possible before throwing a combined error via {@link
 * errorsThrowCombinedError}.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 */
export function structureValidateReferences(structure) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const namedType of structureNamedTypes(structure)) {
    try {
      structureValidateReferenceForType(structure, namedType);
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Resolve the provided reference.
 *
 * Throws if the provided value is not a reference or if the reference can not be
 * resolved.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @param {import("../generated/common/types.js").ExperimentalTypeDefinition} reference
 * @returns {import("../types.js").NamedType<import("../generated/common/types").ExperimentalNamedTypeDefinition>}
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

  // @ts-expect-error
  return result;
}

/**
 * Create a new reference to the provided group and name.
 *
 * @param {string} group
 * @param {string} name
 * @returns {import("../generated/common/types.js").ExperimentalReferenceDefinition}
 */
export function structureCreateReference(group, name) {
  return {
    type: "reference",
    docString: "",
    isOptional: false,
    sql: {},
    validator: {},
    reference: {
      group,
      name,
    },
  };
}

/**
 * Copy and sort the structure. We do this for 2 reasons;
 * - It allows multiple generate calls within the same 'Generator', since we don't mutate
 * the original structure
 * - The JS iterators in Node.js are based on object insertion order, so this ensures
 * that our output is stable.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @returns {import("../generated/common/types.js").ExperimentalStructure}
 */
export function structureCopyAndSort(structure) {
  /** @type {import("../generated/common/types.js").ExperimentalStructure} */
  const newStructure = {};

  const groups = Object.keys(structure).sort();
  for (const group of groups) {
    // This makes sure that an empty group is copied over as well, may have semantic
    // meaning sometime down the road.
    newStructure[group] = {};

    const typeNames = Object.keys(structure[group]).sort();

    for (const name of typeNames) {
      structureAddType(
        newStructure,
        JSON.parse(JSON.stringify(structure[group][name])),
        {
          skipReferenceExtraction: true,
        },
      );
    }
  }

  return newStructure;
}

/**
 * Recursively extract references from the provided type.
 *
 * Unlike the previous versions of code-gen we prefer to keep references as much as
 * possible and resolve them on the fly. This prevents weird recursion errors and should
 * simplify conditional logic down in the generators.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @param {import("../generated/common/types.js").ExperimentalTypeDefinition} type
 * @returns {void}
 */
export function structureExtractReferences(structure, type) {
  typeDefinitionTraverse(
    type,
    (type, callback) => {
      if (type.type === "reference") {
        // @ts-expect-error
        //
        // A reference can be constructed via `T.reference(T.bool('foo'))` resulting in a
        // nested type definition, which we need to extract here.
        if (type.reference.type) {
          // @ts-expect-error
          //
          // A reference can be constructed via `T.reference(T.bool('foo'))` resulting in a
          // nested type definition, which we need to extract here.
          structureAddType(structure, type.reference, {
            skipReferenceExtraction: true,
          });

          // @ts-expect-error
          //
          // A reference can be constructed via `T.reference(T.bool('foo'))` resulting in a
          // nested type definition, which we need to extract here.
          callback(type.reference);

          type.reference = {
            group: type.reference.group,
            name: type.reference.name,
          };
        }

        return type;
      }

      callback(type);

      // Someone inline defined something like:
      //
      // `T.anyOf("namedAnyOf").values(T.bool("namedBool"))`

      // The first one is already on the structure, the second one should be added to the
      // structure and be replaced by a reference.
      if (isNamedTypeBuilderLike(type)) {
        structureAddType(structure, type, {
          // We are already doing this above when calling the callback.
          skipReferenceExtraction: true,
        });

        return structureCreateReference(type.group, type.name);
      }

      return type;
    },
    {
      isInitialType: true,
      assignResult: true,
    },
  );
}

/**
 * Recursively add references that are necessary in the newStructure from the
 * fullStructure.
 *
 * This is used when extracting groups or specific types from the structure in to a new
 * structure. By resolving out of group references a valid structure is created.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} fullStructure
 * @param {import("../generated/common/types.js").ExperimentalStructure} newStructure
 * @param {import("../generated/common/types.js").ExperimentalTypeDefinition} type
 */
export function structureIncludeReferences(fullStructure, newStructure, type) {
  typeDefinitionTraverse(
    type,
    (type, callback) => {
      // Only references can point out of the current group
      if (type.type === "reference") {
        const referencedType =
          fullStructure[type.reference.group]?.[type.reference.name];

        // We currently silently ignore this, since correct values may be added by the
        // user. We will throw when generating with this specific structure.
        if (isNil(referencedType)) {
          return;
        }

        if (newStructure[type.reference.group]?.[type.reference.name]) {
          // Type is already present on the new structure, and all references will be
          // included already
          return;
        }

        structureAddType(newStructure, referencedType, {
          skipReferenceExtraction: true,
        });

        // Recurse in to the referenced type, so if it contains other out of group
        // references we include those as well.
        callback(referencedType);
      } else {
        callback(type);
      }
    },
    {
      isInitialType: true,
      assignResult: false,
    },
  );
}

/**
 * Recursively validate references for the provided type.
 *
 * We do this early in the generation process to check the user input, and expect that
 * processors don't create invalid references.
 *
 * @param {import("../generated/common/types.js").ExperimentalStructure} structure
 * @param {import("../generated/common/types.js").ExperimentalTypeDefinition} type
 */
export function structureValidateReferenceForType(structure, type) {
  // Keep a type stack so we can give the user pointers where this happened.
  const typeStack = [];

  typeDefinitionTraverse(
    type,
    (type, callback) => {
      if (type.type === "reference") {
        try {
          structureResolveReference(structure, type);
        } catch {
          // We throw an internal error in `structureResolveReference`, this is however a
          // human error, so should have a better error message.
          throw AppError.serverError({
            message: `Could not resolve reference to ${stringFormatNameForError(
              type.reference,
            )} via ${typeStack.join(" -> ")}`,
          });
        }
      } else {
        callback(type);
      }
    },
    {
      isInitialType: true,
      assignResult: false,
      beforeTraversal: (type) => {
        typeStack.push(stringFormatNameForError(type));
      },
      afterTraversal: () => {
        typeStack.pop();
      },
    },
  );
}
