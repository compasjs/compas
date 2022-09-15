import { isNil } from "@compas/stdlib";
import { structureAddType } from "./structure.js";
/**
 * @typedef {object} TypeDefinitionHelper
 * @property {import("./structure").structureExtractReferences} structureExtractReferences
 * @property {import("./structure").structureIncludeReferences} structureIncludeReferences
 */

/**
 * @type {Record<
 *   import("./generated/common/types").ExperimentalTypeDefinition["type"],
 *   TypeDefinitionHelper
 * >}
 */
export const typeDefinitionHelpers = {
  bool: {
    structureExtractReferences() {},
    structureIncludeReferences() {},
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
        skipReferencesCheck: true,
      });
    },
  },
};
