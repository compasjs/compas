import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of CRUD objects in the structure
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureCrudDefinition>)[]}
 */
export function structureCrud(generateContext) {
  /**
   * @type {(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureCrudDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "crud") {
      result.push(namedType);
    }
  }

  return result;
}

/**
 * Call the route specific functions that are enabled on the CRUD object.
 *
 * @template {any[]} X
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureCrudDefinition>} crud
 * @param {{
 *   listRoute: (...X) => void,
 *   singleRoute: (...X) => void,
 *   createRoute: (...X) => void,
 *   updateRoute: (...X) => void,
 *   deleteRoute: (...X) => void,
 * }} functions
 * @param {X} args
 */
export function crudRouteSwitch(crud, functions, args) {
  if (crud.routeOptions.listRoute) {
    functions.listRoute(...args);
  }
  if (crud.routeOptions.singleRoute) {
    functions.singleRoute(...args);
  }
  if (crud.routeOptions.createRoute) {
    functions.createRoute(...args);
  }
  if (crud.routeOptions.updateRoute) {
    functions.updateRoute(...args);
  }
  if (crud.routeOptions.deleteRoute) {
    functions.deleteRoute(...args);
  }
}
