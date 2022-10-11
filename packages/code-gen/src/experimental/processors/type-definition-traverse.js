import { isNil } from "@compas/stdlib";

/**
 * A collection of all traversal paths per type
 *
 * @type {Record<
 *   import("../generated/common/types").ExperimentalTypeDefinition["type"],
 *   {
 *     key: string,
 *     amount: "single" | "many"
 *   }[]>}
 */
export const typeDefinitionTraversePaths = {
  any: [],
  anyOf: [
    {
      key: "values",
      amount: "many",
    },
  ],
  array: [
    {
      key: "values",
      amount: "single",
    },
  ],
  boolean: [],
  crud: [
    {
      key: "entity",
      amount: "single",
    },
    {
      key: "inlineRelations",
      amount: "many",
    },
    {
      key: "nestedRelations",
      amount: "many",
    },
  ],
  date: [],
  extend: [
    {
      key: "reference",
      amount: "single",
    },
  ],
  file: [],
  generic: [
    {
      key: "keys",
      amount: "single",
    },
    {
      key: "values",
      amount: "single",
    },
  ],
  number: [],
  object: [
    {
      key: "keys",
      amount: "many",
    },
    {
      key: "relations",
      amount: "many",
    },
  ],
  omit: [
    {
      key: "reference",
      amount: "single",
    },
  ],
  pick: [
    {
      key: "reference",
      amount: "single",
    },
  ],
  reference: [],
  relation: [
    {
      key: "reference",
      amount: "single",
    },
  ],
  route: [
    {
      key: "params",
      amount: "single",
    },
    {
      key: "query",
      amount: "single",
    },
    {
      key: "body",
      amount: "single",
    },
    {
      key: "files",
      amount: "single",
    },
    {
      key: "response",
      amount: "single",
    },
    {
      key: "invalidations",
      amount: "many",
    },
  ],
  routeInvalidation: [],
  string: [],
  uuid: [],
};

/**
 * Traverse the type recursively
 *
 * Order of operations when an object definition is provided
 * - `options.isInitialType` should be set to true
 * - `callback` is called with the object definition and a new nested callback
 * - If the nested callback is called, the traversal kicks in
 * - `options.beforeTraversal` is called when provided
 * - For each traversal path of the provided type, the callback is called with a nested
 * callback
 * - When all traversal paths are exhausted / the nested callback is not called again.
 * `options.afterTraversal` is called when provided.
 *
 * @param {import("../generated/common/types").ExperimentalTypeDefinition|undefined} type
 * @param {(
 *   type: import("../generated/common/types").ExperimentalTypeDefinition,
 *   callback: (
 *   type: import("../generated/common/types").ExperimentalTypeDefinition,
 * ) => import("../generated/common/types").ExperimentalTypeDefinition|void,
 * ) => import("../generated/common/types").ExperimentalTypeDefinition|void} callback
 * @param {{
 *   isInitialType: boolean,
 *   assignResult?: boolean,
 *   beforeTraversal?: (
 *   type: import("../generated/common/types").ExperimentalTypeDefinition,
 *   ) => void,
 *   afterTraversal?: (
 *   type: import("../generated/common/types").ExperimentalTypeDefinition,
 *   ) => void,
 * }} options
 */
export function typeDefinitionTraverse(type, callback, options) {
  if (isNil(type)) {
    return;
  }

  const nestedCallback = (nestedType) => {
    if (isNil(nestedType)) {
      return;
    }

    if (options.isInitialType) {
      options.isInitialType = false;

      callback(nestedType, nestedCallback);
    } else {
      options?.beforeTraversal && options.beforeTraversal(nestedType);

      const pathSpecs = typeDefinitionTraversePaths[type.type];

      for (const spec of pathSpecs) {
        if (spec.amount === "single") {
          const nestedResult = callback(type[spec.key], nestedCallback);

          if (nestedResult && options.assignResult) {
            type[spec.key] = nestedResult;
          }
        } else if (Array.isArray(type[spec.key])) {
          for (let i = 0; i < type[spec.key]; ++i) {
            const nestedResult = callback(type[spec.key][i], nestedCallback);

            if (nestedResult && options.assignResult) {
              type[spec.key][i] = nestedResult;
            }
          }
        } else {
          for (const key of Object.keys(type[spec.key])) {
            const nestedResult = callback(type[spec.key][key], nestedCallback);

            if (nestedResult && options.assignResult) {
              type[spec.key][key] = nestedResult;
            }
          }
        }
      }

      options?.afterTraversal && options.afterTraversal(nestedType);
    }
  };

  nestedCallback(type);
}
