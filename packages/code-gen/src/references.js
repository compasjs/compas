import { isNil, isPlainObject } from "@lbu/stdlib";
import { followReference } from "./utils.js";

/**
 * Create a js-reference for reference types
 *
 * @param structure
 * @param value
 */
export function recursiveLinkupReferences(structure, value) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    // Skip primitives & null / undefined
    return;
  }

  if (
    isPlainObject(value) &&
    value.type === "reference" &&
    isPlainObject(value.reference) &&
    isNil(value.reference.type)
  ) {
    value.reference = followReference(structure, value.reference);
    return;
  } else if (
    isPlainObject(value) &&
    value.type === "reference" &&
    isPlainObject(value.reference) &&
    !isNil(value.reference.type)
  ) {
    // We already handled this object
    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      recursiveLinkupReferences(structure, value[key]);
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      recursiveLinkupReferences(structure, value[i]);
    }
  }
}
