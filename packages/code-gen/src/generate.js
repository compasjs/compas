// @ts-nocheck

import { AppError, isNil, isPlainObject } from "@compas/stdlib";
import { isNamedTypeBuilderLike, TypeBuilder } from "./builders/index.js";
import { upperCaseFirst } from "./utils.js";

/**
 * Provided that input is empty
 *
 * @param {CodeGenStructure} input
 * @param {CodeGenStructure} structure
 * @param {string[]} groups
 */
export function addGroupsToGeneratorInput(input, structure, groups) {
  for (const group of groups) {
    input[group] = structure[group] || {};
  }

  includeReferenceTypes(structure, input);
}

/**
 * Find nested references and add to generatorInput in the correct group
 *
 * @param {CodeGenStructure} structure
 * @param {CodeGenStructure} input
 * @returns {void}
 */
function includeReferenceTypes(structure, input) {
  const stack = [input];

  while (stack.length) {
    const currentObject = stack.shift();

    // handle values
    if (currentObject?.type === "reference") {
      const { group, name, uniqueName } = currentObject.reference;

      // ensure ref does not already exits
      if (!isNil(structure[group]?.[name]) && isNil(input[group]?.[name])) {
        addToData(input, structure[group][name]);

        // Note that we need the full referenced object here, since
        // currentObject.reference only contains { group, name, uniqueName }
        stack.push(input[group][name]);

        continue;
      } else if (isNil(structure[group]?.[name])) {
        throw new AppError("codeGen.app.followReferences", 500, {
          message: `Could not resolve reference '${uniqueName}'`,
        });
      }
    }

    // extend stack
    if (Array.isArray(currentObject)) {
      for (const it of currentObject) {
        stack.push(it);
      }
    } else if (isPlainObject(currentObject)) {
      for (const key of Object.keys(currentObject)) {
        stack.push(currentObject[key]);
      }
    }
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
