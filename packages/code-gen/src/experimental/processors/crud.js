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

/**
 * Call the route specific functions that are enabled on the CRUD object.
 *
 * @template {any[]} X
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
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
