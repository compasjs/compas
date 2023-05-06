import { isNil } from "@compas/stdlib";
import { structureModels } from "./models.js";
import { structureResolveReference } from "./structure.js";

/**
 * Sort relations, forcing a consistent logical output
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function modelSortAllRelations(generateContext) {
  for (const model of structureModels(generateContext)) {
    model.relations = model.relations.sort((a, b) => {
      const aType = a.subType;
      const bType = b.subType;

      // If both types are equal, we sort them based on alphabetic order of their own
      // keys.
      if (aType === bType) {
        return a.ownKey.localeCompare(b.ownKey);
      }

      if (aType === "oneToOne") {
        return -1;
      }

      if (bType === "oneToOne") {
        return 1;
      }

      if (aType === "manyToOne") {
        return -1;
      }

      if (bType === "manyToOne") {
        return 1;
      }

      if (aType === "oneToOneReverse") {
        return -1;
      }

      if (bType === "oneToOneReverse") {
        return 1;
      }

      if (aType === "oneToMany") {
        return -1;
      }

      if (bType === "oneToMany") {
        return 1;
      }

      return -1;
    });
  }
}

/**
 * Sort relations, forcing a consistent logical output
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function modelSortAllKeys(generateContext) {
  const typeOrder = {
    boolean: 0,
    number: 1,
    uuid: 2,
    string: 3,
    date: 4,
  };

  for (const model of structureModels(generateContext)) {
    const keys = model.keys;

    model.keys = {};

    // Calculated sorted keys without generated date fields
    const sortedKeys = Object.keys(keys)
      .filter(
        (it) => it !== "createdAt" && it !== "updatedAt" && it !== "deletedAt",
      )
      .sort((a, b) => {
        const keyA = keys[a];
        const keyB = keys[b];

        const refA =
          keyA.type === "reference"
            ? structureResolveReference(generateContext.structure, keyA)
            : undefined;
        const refB =
          keyB.type === "reference"
            ? structureResolveReference(generateContext.structure, keyB)
            : undefined;

        // Primary key should be sorted first
        if (keyA.sql?.primary || refA?.sql?.primary) {
          return -1;
        }

        // Primary key should be sorted first
        if (keyB.sql?.primary || refB?.sql?.primary) {
          return 1;
        }

        // If either key is optional, it should be sorted after
        // the non optional field
        const keyAOptional = keyA.isOptional || refA?.isOptional;
        const keyBOptional = keyB.isOptional || refB?.isOptional;
        const keyADefault = refA?.defaultValue ?? keyA.defaultValue;
        const keyBDefault = refB?.defaultValue ?? keyB.defaultValue;

        if (!keyAOptional && keyBOptional && isNil(keyBDefault)) {
          return -1;
        } else if (!keyBOptional && keyAOptional && isNil(keyADefault)) {
          return 1;
        }

        // Both fields are either optional or not optional, prefer
        // primitive types
        const typeAIndex = typeOrder[keyA.type] ?? typeOrder[refA?.type] ?? 9;
        const typeBIndex = typeOrder[keyB.type] ?? typeOrder[refB?.type] ?? 9;

        if (typeAIndex !== typeBIndex) {
          return typeAIndex - typeBIndex;
        }

        // Keys are created equal, use alphabetic sort.
        return a.localeCompare(b);
      });

    // Add date fields if they existed originally
    if (keys.createdAt) {
      sortedKeys.push("createdAt");
    }
    if (keys.updatedAt) {
      sortedKeys.push("updatedAt");
    }
    if (keys.deletedAt) {
      sortedKeys.push("deletedAt");
    }

    for (const key of sortedKeys) {
      model.keys[key] = keys[key];
    }
  }
}
