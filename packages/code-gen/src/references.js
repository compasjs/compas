import { isNil, isPlainObject } from "@lbu/stdlib";

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
    value.type &&
    value.type === "reference" &&
    isPlainObject(value.reference)
  ) {
    const { group, name } = value.reference;
    if (!isNil(structure[group]?.[name])) {
      value.referencedItem = structure[group][name];
    }

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
