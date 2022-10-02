import { AppError, isNil } from "@compas/stdlib";
import { stringFormatNameForError } from "../string-format.js";
import {
  structureAddType,
  structureExtractReferences,
  structureIncludeReferences,
  structureResolveReference,
  structureValidateReferenceForType,
} from "./structure.js";

/**
 * Implementations for structure behaviors per type.
 * This is optimized for adding new types without altering many files, it will grow in to
 * a pretty decent file, but should be pretty stable.
 *
 * These are not tested directly, but via their callers.
 *
 * @type {Record<
 *   import("../generated/common/types").ExperimentalTypeDefinition["type"],
 *   {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalTypeDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   }
 * >}
 */
export const typeDefinitionHelpers = {
  any: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  anyOf: {
    structureExtractReferences(structure, type) {
      if (type.type !== "anyOf") {
        return;
      }

      for (const value of type.values) {
        structureExtractReferences(structure, value);
      }
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type.type !== "anyOf") {
        return;
      }

      for (const value of type.values) {
        structureIncludeReferences(fullStructure, newStructure, value);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type.type !== "anyOf") {
        return;
      }

      const typeStack = [...parentTypeStack, stringFormatNameForError(type)];

      for (const value of type.values) {
        structureValidateReferenceForType(structure, value, [...typeStack]);
      }
    },
  },
  array: {
    structureExtractReferences(structure, type) {
      if (type.type !== "array") {
        return;
      }

      structureExtractReferences(structure, type.values);
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type.type !== "array") {
        return;
      }

      structureIncludeReferences(fullStructure, newStructure, type.values);
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type.type !== "array") {
        return;
      }

      const typeStack = [...parentTypeStack, stringFormatNameForError(type)];

      structureValidateReferenceForType(structure, type.values, typeStack);
    },
  },
  boolean: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  date: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  number: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  object: {
    structureExtractReferences(structure, type) {
      if (type.type !== "object") {
        return;
      }

      for (const key of Object.keys(type.keys)) {
        structureExtractReferences(structure, type.keys[key]);
      }

      for (const relation of type.relations ?? []) {
        structureExtractReferences(structure, relation);
      }
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type.type !== "object") {
        return;
      }

      for (const key of Object.keys(type.keys)) {
        structureIncludeReferences(fullStructure, newStructure, type.keys[key]);
      }

      for (const relation of type.relations ?? []) {
        structureIncludeReferences(fullStructure, newStructure, relation);
      }
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type.type !== "object") {
        return;
      }

      const typeStack = [...parentTypeStack, stringFormatNameForError(type)];

      for (const key of Object.keys(type.keys)) {
        structureValidateReferenceForType(structure, type.keys[key], [
          ...typeStack,
        ]);
      }

      for (const relation of type.relations ?? []) {
        structureValidateReferenceForType(structure, relation, [...typeStack]);
      }
    },
  },
  reference: {
    structureExtractReferences(structure, type) {
      if (type.type !== "reference") {
        return;
      }

      // @ts-expect-error TypeBuilder only properties
      if (type.reference.type) {
        // @ts-expect-error TypeBuilder only properties
        structureAddType(structure, type.reference, {
          skipReferencesCheck: false,
        });

        type.reference = {
          group: type.reference.group,
          name: type.reference.name,
        };
      }
    },
    structureIncludeReferences(fullStructure, newStructure, type) {
      if (type.type !== "reference") {
        return;
      }

      const referencedType =
        fullStructure[type.reference.group]?.[type.reference.name];
      if (isNil(referencedType)) {
        return;
      }

      structureAddType(newStructure, referencedType, {
        skipReferenceExtraction: true,
      });
    },
    structureValidateReferenceForType(structure, type, parentTypeStack) {
      if (type.type !== "reference") {
        return;
      }

      try {
        structureResolveReference(structure, type);
      } catch {
        throw AppError.serverError({
          message: `Could not resolve reference to ${stringFormatNameForError(
            type.reference,
          )} via ${parentTypeStack.join(" -> ")}`,
        });
      }
    },
  },
  string: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  uuid: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
};
