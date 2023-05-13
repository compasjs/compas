import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of routes in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>)[]}
 */
export function structureRoutes(generateContext) {
  /**
   * @type {(import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "route") {
      result.push(namedType);
    }
  }

  return result;
}
