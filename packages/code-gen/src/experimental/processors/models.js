import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of query enabled objects in the structure.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {(import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>)[]}
 */
export function structureModels(generateContext) {
  /**
   * @type {(import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "object" && namedType.enableQueries) {
      result.push(namedType);
    }
  }

  return result;
}
