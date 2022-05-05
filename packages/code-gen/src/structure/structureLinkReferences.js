import { structureTraverserAssign } from "./structureTraverseAssign.js";

/**
 * Resolve all references to their real values. This way other places won't have to do
 * lookups in the whole structure.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 */
export function structureLinkReferences(structure) {
  structureTraverserAssign(structure, (type) => {
    if (type.type !== "reference") {
      return type;
    }

    let nestedRef = type.reference;
    while (
      "reference" in nestedRef &&
      nestedRef.reference &&
      nestedRef.type === "reference"
    ) {
      nestedRef = nestedRef.reference;
    }

    // @ts-expect-error
    type.reference = structure[nestedRef.group][nestedRef.name];

    return type;
  });
}
