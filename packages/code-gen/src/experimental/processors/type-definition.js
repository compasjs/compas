import { AppError, isNil } from "@compas/stdlib";
import { stringFormatNameForError } from "../string-format.js";
import { structureAddType, structureResolveReference } from "./structure.js";

/**
 * Implementations for structure behaviors per type.
 * This is optimized for adding new types without altering many files, it will grow in to
 * a pretty decent file, but should be pretty stable.
 *
 * These are not tested directly, but via their callers.
 *
 * @type {{
 *   boolean: {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types.js").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalBooleanDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 *   number: {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types.js").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalNumberDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalNumberDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalNumberDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 *   reference: {
 *     structureExtractReferences: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureIncludeReferences: (
 *        fullStructure: import("../generated/common/types").ExperimentalStructure,
 *        newStructure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *     ) => void,
 *     structureValidateReferenceForType: (
 *        structure: import("../generated/common/types").ExperimentalStructure,
 *        type: import("../generated/common/types").ExperimentalReferenceDefinition,
 *        parentTypeStack: string[],
 *     ) => void,
 *   },
 * }}
 */
export const typeDefinitionHelpers = {
  boolean: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
  },
  number: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
    structureValidateReferenceForType() {},
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
};
