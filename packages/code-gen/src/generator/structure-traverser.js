import { isNil } from "@compas/stdlib";

/**
 * Traverse the structure, calling the callback for each unique type. Can only be used
 * after 'linkupReferencesInStructure'.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {(type: import("../generated/common/types.js").CodeGenType) => void} callback
 */
export function traverseStructure(structure, callback) {
  /** @type {import("../generated/common/types.js").CodeGenType[]} */
  const stack = [];

  for (const group of Object.keys(structure)) {
    for (const value of Object.values(structure[group])) {
      stack.push(value);
    }
  }

  /**
   * @param {import("../generated/common/types.js").CodeGenType|undefined} value
   */
  const stackPushSkipRefs = (value) => {
    if (isNil(value)) {
      return;
    }

    if (value.type === "reference") {
      return;
    }

    stack.push(value);
  };

  while (stack.length) {
    const item = stack.pop();
    if (isNil(item)) {
      continue;
    }

    callback(item);

    switch (item.type) {
      case "file":
      case "any":
      case "boolean":
      case "date":
      case "number":
      case "string":
      case "uuid":
        break;
      case "reference":
        // We already have the named items top level, so don't add them again.
        break;
      case "route":
        // All route types are named, so skip them
        break;
      case "anyOf":
        // @ts-ignore
        for (const v of item.values) {
          stackPushSkipRefs(v);
        }
        break;
      case "array":
        // @ts-ignore
        stackPushSkipRefs(item.values);
        break;
      case "generic":
        // @ts-ignore
        stackPushSkipRefs(item.keys);
        // @ts-ignore
        stackPushSkipRefs(item.values);
        break;
      case "object":
        // @ts-ignore
        for (const v of Object.values(item.keys)) {
          stackPushSkipRefs(v);
        }
        break;
    }
  }
}
