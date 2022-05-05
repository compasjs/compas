// @ts-nocheck

import { AppError, isNil, isPlainObject } from "@compas/stdlib";
import { structureAddType } from "./structure/structureAddType.js";

/**
 * Provided that input is empty, copy over all enabled groups from structure,
 * automatically include references of groups that are not enabled.
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
export function includeReferenceTypes(structure, input) {
  const stack = [input];

  while (stack.length) {
    const currentObject = stack.shift();

    // handle values
    if (currentObject?.type === "reference") {
      const { group, name, uniqueName } = currentObject.reference;

      // ensure ref does not already exits
      if (!isNil(structure[group]?.[name]) && isNil(input[group]?.[name])) {
        structureAddType(input, structure[group][name]);

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
