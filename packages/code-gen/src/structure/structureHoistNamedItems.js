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
    if (!isNamedTypeBuilderLike(type)) {
      return type;
    }

    structureAddType(structure, type);

    if (metadata.isNamedType) {
      return type;
    }

    // @ts-expect-error
    return new ReferenceType(type.group, type.name).build();
  });
}
