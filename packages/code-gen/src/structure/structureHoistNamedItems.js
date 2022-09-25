import { isNamedTypeBuilderLike, ReferenceType } from "../builders/index.js";
import { structureAddType } from "./structureAddType.js";
import { structureTraverserAssign } from "./structureTraverseAssign.js";

/**
 * Hoist all named types to the top of the structure, replacing them with references
 * before serialization
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 */
export function structureHoistNamedItems(structure) {
  structureTraverserAssign(structure, (type, metadata) => {
    if ("type" in type && type.type === "reference") {
      type.reference = {
        name: type.reference.name,
        group: type.reference.group,
      };
    }

    if (!isNamedTypeBuilderLike(type)) {
      return type;
    }

    if (metadata.isNamedType && structure[type.group]?.[type.name]) {
      return type;
    } else if (!structure[type.group]?.[type.name]) {
      structureAddType(structure, type);
    }

    return new ReferenceType(type.group, type.name).build();
  });
}
