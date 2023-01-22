import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of CRUD objects in the structure
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {(import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>)[]}
 */
export function structureCrud(generateContext) {
  /**
   * @type {(import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "crud") {
      result.push(namedType);
    }
  }

  return result;
}
