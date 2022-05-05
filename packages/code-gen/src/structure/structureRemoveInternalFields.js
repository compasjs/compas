import { structureTraverseDepthFirst } from "./structureTraverseDepthFirst.js";

/**
 * Removes internals from the structure and value. These internals are not allowed in the
 * Compas structure, so if not extending from an OpenAPI spec they can't be used.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 */
export function structureRemoveInternalFields(structure) {
  structureTraverseDepthFirst(structure, (type) => {
    if ("internalSettings" in type && type.internalSettings) {
      type.internalSettings = {};
    }
  });
}
