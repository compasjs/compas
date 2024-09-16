import { AppError } from "@compas/stdlib";
import {
  errorsThrowCombinedError,
  stringFormatNameForError,
} from "../utils.js";
import { structureNamedTypes, structureResolveReference } from "./structure.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Run through all object expansion types.
 *
 * - Extends existing types via `extend`
 * - Replaces `pick` and `omit` with their evaluated object
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function objectExpansionExecute(generateContext) {
  /** @type {Array<import("@compas/stdlib").AppError>} */
  const errors = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    try {
      objectExpansionExtend(generateContext.structure, namedType);
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    try {
      objectExpansionOmit(generateContext.structure, namedType);
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    try {
      objectExpansionPick(generateContext.structure, namedType);
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Extend named objects for each 'extend' in the structure.
 *
 * The 'extend' type is then removed from the structure, as it doesn't serve a purpose
 * anymore.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionExtend(structure, namedType) {
  if (namedType.type === "extend") {
    const referencedType = structureResolveReference(
      structure,
      namedType.reference,
    );

    if (referencedType.type !== "object") {
      throw AppError.serverError({
        message: `Can't call 'T.extend()' on a non 'object' reference. Found '${
          referencedType.type
        }' ${stringFormatNameForError(referencedType)}.`,
      });
    }

    referencedType.keys = Object.assign(referencedType.keys, namedType.keys);
    referencedType.relations.push(...namedType.relations);

    // @ts-expect-error
    //
    // This is always a named time so we can assume that it has a group and name
    delete structure[namedType.group][namedType.name];
  }
}

/**
 * Replace 'omit' types with an object definition without the omitted keys.
 *
 * This function alters the type in place, creating a shallow copy of the source objects
 * keys.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionOmit(structure, namedType) {
  // We keep a callstack with `beforeTraversal` and `afterTraversal` to improve the
  // error messages.
  const typeStack = [];

  typeDefinitionTraverse(
    namedType,
    (type, callback) => {
      if (type.type === "omit") {
        const referencedType =
          type.reference.type === "reference" ?
            structureResolveReference(structure, type.reference)
          : type.reference;

        if (referencedType.type !== "object") {
          throw AppError.serverError({
            message: `Omit should reference an 'object' or a reference to an 'object', found '${
              referencedType.type
            }'. Via ${typeStack.join(" -> ")}`,
          });
        }

        const removedKeys = type.keys;

        /**
         * @type {import("../generated/common/types.js").StructureObjectDefinition}
         */
        // @ts-expect-error
        //
        // We build the new type bellow
        const newType = type;

        // @ts-expect-error
        //
        // Convert from omit to object type
        delete type.reference;

        newType.type = "object";
        newType.keys = {
          ...referencedType.keys,
        };

        newType.validator = {
          allowNull: false,
          strict: true,
        };
        newType.enableQueries = false;
        newType.relations = [];

        for (const key of removedKeys) {
          delete newType.keys[key];
        }
      }

      callback(type);
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

/**
 * Replace 'pick' types with an object definition only including the picked keys
 *
 * This function alters the type in place, creating a shallow copy of the source objects
 * keys.
 *
 * @param {import("../generated/common/types.js").StructureStructure} structure
 * @param {import("../generated/common/types.js").StructureTypeDefinition} namedType
 */
export function objectExpansionPick(structure, namedType) {
  // We keep a callstack with `beforeTraversal` and `afterTraversal` to improve the
  // error messages.
  const typeStack = [];

  typeDefinitionTraverse(
    namedType,
    (type, callback) => {
      if (type.type === "pick") {
        const referencedType =
          type.reference.type === "reference" ?
            structureResolveReference(structure, type.reference)
          : type.reference;

        if (referencedType.type !== "object") {
          throw AppError.serverError({
            message: `Pick should reference an 'object' or a reference to an 'object', found '${
              referencedType.type
            }'. Via ${typeStack.join(" -> ")}`,
          });
        }

        const pickedKeys = type.keys;

        /**
         * @type {import("../generated/common/types.js").StructureObjectDefinition}
         */
        // @ts-expect-error
        //
        // We build the new type bellow
        const newType = type;

        // @ts-expect-error
        //
        // Convert from omit to object type
        delete type.reference;

        newType.type = "object";
        newType.keys = {};

        newType.validator = {
          allowNull: false,
          strict: true,
        };

        newType.enableQueries = false;
        newType.relations = [];

        for (const key of pickedKeys) {
          newType.keys[key] = referencedType.keys[key];
        }
      }

      callback(type);
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
