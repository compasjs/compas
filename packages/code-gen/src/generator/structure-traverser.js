import { isNil } from "@compas/stdlib";

/**
 * Traverse the structure, calling the callback for each unique type. Can only be used
 * after 'linkupReferencesInStructure'.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {import("../generated/common/types.js").CodeGenType} type
 * @param {(type: import("../generated/common/types.js").CodeGenType) => void} callback
 */
export function traverseType(structure, type, callback) {
  const handledSet = new Set();

  /** @type {import("../generated/common/types.js").CodeGenType[]} */
  const stack = [type];
  handledSet.add(type);

  /**
   * @param {import("../generated/common/types.js").CodeGenType|undefined} value
   */
  const stackPushSkipHandled = (value) => {
    if (isNil(value)) {
      return;
    }

    if (handledSet.has(value)) {
      return;
    }

    stack.push(value);
    handledSet.add(value);
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
        stackPushSkipHandled(
          // @ts-ignore
          structure[item.reference.group][item.reference.name],
        );
        break;
      case "anyOf":
        // @ts-ignore
        for (const v of item.values) {
          stackPushSkipHandled(v);
        }
        break;
      case "array":
        // @ts-ignore
        stackPushSkipHandled(item.values);
        break;
      case "generic":
        // @ts-ignore
        stackPushSkipHandled(item.keys);
        // @ts-ignore
        stackPushSkipHandled(item.values);
        break;
      case "object":
        // @ts-ignore
        for (const v of Object.values(item.keys)) {
          stackPushSkipHandled(v);
        }
        break;
      case "omit":
      case "pick":
        stackPushSkipHandled(item.reference);
        break;
    }
  }
}
