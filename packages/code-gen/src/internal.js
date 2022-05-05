// @ts-nocheck

import { isNil } from "@compas/stdlib";

/**
 * Removes internals from the structure and value
 *
 * @param {CodeGenStructure|undefined} [structure]
 * @param {CodeGenType|undefined} [value]
 */
export function recursivelyRemoveInternalFields(structure, value) {
  if (isNil(value) && isNil(structure)) {
    return;
  }

  if (isNil(value)) {
    for (const group of Object.values(structure)) {
      for (const value of Object.values(group)) {
        recursivelyRemoveInternalFields(undefined, value);
      }
    }

    return;
  }

  if (value.internalSettings) {
    value.internalSettings = {};
  }

  switch (value.type) {
    case "anyOf":
      for (const item of value.values) {
        recursivelyRemoveInternalFields(undefined, item);
      }
      break;
    case "array":
      recursivelyRemoveInternalFields(undefined, value.values);
      break;
    case "generic":
      recursivelyRemoveInternalFields(undefined, value.keys);
      recursivelyRemoveInternalFields(undefined, value.values);
      break;
    case "object":
      for (const item of Object.values(value.keys)) {
        recursivelyRemoveInternalFields(undefined, item);
      }
      break;
    case "omit":
    case "pick":
      recursivelyRemoveInternalFields(undefined, value.reference);
      break;
    case "reference":
      if (value.reference?.type) {
        recursivelyRemoveInternalFields(undefined, value.reference);
      }
      break;
    case "relation":
      if (value.reference?.type) {
        recursivelyRemoveInternalFields(undefined, value.reference);
      }
      break;
    case "route":
      recursivelyRemoveInternalFields(undefined, value.query);
      recursivelyRemoveInternalFields(undefined, value.params);
      recursivelyRemoveInternalFields(undefined, value.body);
      recursivelyRemoveInternalFields(undefined, value.files);
      recursivelyRemoveInternalFields(undefined, value.response);
      break;
  }
}
