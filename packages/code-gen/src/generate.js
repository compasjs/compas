import { AppError, isNil, isPlainObject } from "@compas/stdlib";
import { isNamedTypeBuilderLike, TypeBuilder } from "./builders/index.js";
import { upperCaseFirst } from "./utils.js";

/**
 * @param {CodeGenStructure} input
 * @param {CodeGenStructure} structure
 * @param {string[]} groups
 */
export function addGroupsToGeneratorInput(input, structure, groups) {
  for (const group of groups) {
    input[group] = structure[group] || {};
  }

  const error = includeReferenceTypes(structure, input, input);
  if (error) {
    throw error;
  }
}

/**
 * Using some more memory, but ensures a mostly consistent output.
 * JS Object iterators mostly follow insert order.
 * We do this so diffs are more logical
 *
 * @param {CodeGenStructure} input
 * @param {CodeGenStructure} copy
 */
export function copyAndSort(input, copy) {
  const groups = Object.keys(input).sort();

  for (const group of groups) {
    copy[group] = {};

    const names = Object.keys(input[group]).sort();
    for (const name of names) {
      copy[group][name] = input[group][name];
    }
  }
}

/**
 * Add item to correct group and add uniqueName
 *
 * @param {CodeGenStructure} dataStructure
 * @param {CodeGenType} item
 */
export function addToData(dataStructure, item) {
  if (!item.group || !item.name || !item.type) {
    throw new Error(
      `Can't process item. Missing either group, name or type. Found: ${JSON.stringify(
        item,
      )}`,
    );
  }

  if (!dataStructure[item.group]) {
    dataStructure[item.group] = {};
  }
  dataStructure[item.group][item.name] = item;

  item.uniqueName = upperCaseFirst(item.group) + upperCaseFirst(item.name);
}

/**
 * Find nested references and add to generatorInput in the correct group
 *
 * @param rootData
 * @param generatorInput
 * @param value
 */
export function includeReferenceTypes(rootData, generatorInput, value) {
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
    if (
      !isNil(rootData[group]?.[name]) &&
      isNil(generatorInput[group]?.[name])
    ) {
      if (isNil(generatorInput[group])) {
        generatorInput[group] = {};
      }

      const refValue = rootData[group][name];
      generatorInput[group][name] = refValue;

      const err = includeReferenceTypes(rootData, generatorInput, refValue);
      if (err) {
        if (value.uniqueName) {
          err.info.foundAt = value.uniqueName;
        }
        return err;
      }
    } else if (isNil(rootData[group]?.[name])) {
      return new AppError("codeGen.app.followReferences", 500, {
        message: `Could not resolve reference '${value.reference.uniqueName}'.`,
        foundAt: "unknown",
      });
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      const err = includeReferenceTypes(rootData, generatorInput, value[key]);
      if (err) {
        if (value.uniqueName) {
          err.info.foundAt = value.uniqueName;
        }
        return err;
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      const err = includeReferenceTypes(rootData, generatorInput, value[i]);
      if (err) {
        if (value.uniqueName) {
          err.info.foundAt = value.uniqueName;
        }
        return err;
      }
    }
  }
}

/**
 * @param root
 * @param structure
 */
export function hoistNamedItems(root, structure) {
  const history = new Set();

  for (const group of Object.values(structure)) {
    for (const item of Object.values(group)) {
      hoistNamedItemsRecursive(history, root, item);
    }
  }
}

/**
 * @param {Set} history
 * @param root
 * @param value
 */
function hoistNamedItemsRecursive(history, root, value) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    // Skip primitives & null / undefined
    return;
  }

  if (history.has(value)) {
    return;
  }

  history.add(value);

  if (isNamedTypeBuilderLike(value)) {
    // Most likely valid output from TypeBuilder
    // Just overwrite it
    addToData(root, value);
  }

  if (isPlainObject(value)) {
    if (value.type === "reference" && !isNil(value.reference.type)) {
      // Skip's a linked reference so it's created infinitely nested by the followed loop
      return;
    }

    for (const key of Object.keys(value)) {
      hoistNamedItemsRecursive(history, root, value[key]);
      if (isNamedTypeBuilderLike(value[key])) {
        // value[key] got a uniqueName when called with addToData()
        value[key] = {
          ...TypeBuilder.getBaseData(),
          type: "reference",
          reference: {
            group: value[key].group,
            name: value[key].name,
            uniqueName: value[key].uniqueName,
          },
        };
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      hoistNamedItemsRecursive(history, root, value[i]);
      if (isNamedTypeBuilderLike(value[i])) {
        // value[i] got a uniqueName when called with addToData()
        value[i] = {
          ...TypeBuilder.getBaseData(),
          type: "reference",
          reference: {
            group: value[i].group,
            name: value[i].name,
            uniqueName: value[i].uniqueName,
          },
        };
      }
    }
  }

  history.delete(value);
}
