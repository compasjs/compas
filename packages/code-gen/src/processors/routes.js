import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of routes in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>)[]}
 */
export function structureRoutes(generateContext) {
  /**
   * @type {(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureRouteDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "route") {
      result.push(namedType);
    }
  }

  return result;
}
