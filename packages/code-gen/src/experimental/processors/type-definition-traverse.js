import { AppError, isNil } from "@compas/stdlib";

/**
 * A collection of all traversal paths per type.
 *
 * There are two traversal methods possible;
 * - single: the provided key directly points to a typeDefinition
 * - many: the provided key points to an array or object. The values of the array or
 * object are all typeDefiniton.
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
      key: "fieldOptions.readableType",
      amount: "single",
    },
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
    {
      key: "keys",
      amount: "many",
    },
    {
      key: "relations",
      amount: "many",
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
 * This function is tested indirectly by all its users.
 *
 * @param {import("../generated/common/types").ExperimentalTypeDefinition|undefined} typeToTraverse
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
export function typeDefinitionTraverse(typeToTraverse, callback, options) {
  // Skip traversal if the provided value is undefined
  if (isNil(typeToTraverse)) {
    return;
  }

  const nestedCallback = (currentType) => {
    // Skip traversal if the provided value is undefined.
    if (isNil(currentType)) {
      return;
    }

    if (options.isInitialType) {
      // Initial call, this one doesn't call any of the provided hooks, we expect that
      // the caller did the necessary setup if needed.
      options.isInitialType = false;

      callback(currentType, nestedCallback);
    } else {
      options?.beforeTraversal && options.beforeTraversal(currentType);

      const pathSpecs = typeDefinitionTraversePaths[currentType.type];

      if (!Array.isArray(pathSpecs)) {
        throw AppError.serverError({
          message: `Can't iterate over pathSpecs. This is probably a bug in Compas.`,
          pathSpecs,
          currentType,
          typeToTraverse,
        });
      }

      for (const spec of pathSpecs) {
        let specKey = spec.key;
        let nestedType = currentType;

        if (spec.key.includes(".")) {
          const pathParts = spec.key.split(".");
          specKey = pathParts.pop();

          for (const part of pathParts) {
            nestedType = nestedType[part] ?? {};
          }
        }

        if (spec.amount === "single" && !isNil(nestedType[specKey])) {
          const nestedResult = callback(nestedType[specKey], nestedCallback);

          if (nestedResult && options.assignResult) {
            nestedType[specKey] = nestedResult;
          }
        } else if (Array.isArray(nestedType[specKey])) {
          // Many array handling

          for (let i = 0; i < nestedType[specKey].length; ++i) {
            const nestedResult = callback(
              nestedType[specKey][i],
              nestedCallback,
            );

            if (nestedResult && options.assignResult) {
              nestedType[specKey][i] = nestedResult;
            }
          }
        } else {
          // Many -> object handling

          for (const key of Object.keys(nestedType[specKey] ?? {})) {
            const nestedResult = callback(
              nestedType[specKey][key],
              nestedCallback,
            );

            if (nestedResult && options.assignResult) {
              nestedType[specKey][key] = nestedResult;
            }
          }
        }
      }

      options?.afterTraversal && options.afterTraversal(currentType);
    }
  };

  // Kickstart!
  nestedCallback(typeToTraverse);
}
