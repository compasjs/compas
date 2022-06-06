import { lowerCaseFirst, upperCaseFirst } from "../utils.js";

/**
 * Create a route name based on parent names
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {string} suffix
 * @returns {string}
 */
export function crudCreateName(type, suffix) {
  let result = lowerCaseFirst(suffix ?? "");

  if (type.fromParent) {
    // @ts-expect-error
    result = type.fromParent.options.name + upperCaseFirst(result);
    // @ts-expect-error
    return crudCreateName(type.internalSettings.parent, result);
  }

  return result;
}

/**
 * Find the group that this crud type belongs to.
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @returns {string}
 */
export function crudResolveGroup(type) {
  if (type.fromParent) {
    // @ts-expect-error
    return crudResolveGroup(type.internalSettings.parent);
  }

  // @ts-expect-error
  return type.group;
}
