import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of routes in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../types.js").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>)[]}
 */
export function structureRoutes(generateContext) {
  /**
   * @type {(import("../types.js").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "route") {
      result.push(namedType);
    }
  }

  return result;
}
