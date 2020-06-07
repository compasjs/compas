import { isNil, isPlainObject } from "@lbu/stdlib";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { recursiveLinkupReferences } from "./references.js";
import { isNamedTypeBuilderLike, TypeBuilder } from "./types/index.js";
import { upperCaseFirst } from "./utils.js";

const { mkdir, writeFile } = fs;

/**
 * @name GenerateOpts
 *
 * @typedef {object}
 * @property {string[]} enabledGroups
 * @property {string[]} enabledGenerators
 * @property {boolean} [useTypescript]
 * @property {boolean} [dumpStructure]
 * @property {boolean} [useStubGenerators]
 * @property {string} fileHeader
 * @property {string} outputDirectory
 */

/**
 * The whole generate process
 *
 * @param {App} app
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
export async function runGenerators(app, options) {
  const copy = JSON.parse(JSON.stringify(app.data));
  const generatorInput = { structure: {} };

  addGroupsToGeneratorInput(generatorInput, copy, options.enabledGroups);
  generatorInput.stringified = JSON.stringify(generatorInput.structure)
    .replace(/\\/g, "\\\\")
    .replace("'", "\\'");

  hoistNamedItems(generatorInput, generatorInput.structure);
  let prevCount = getTopLevelItemCount(generatorInput);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await callGeneratorMethod(
      app,
      options.enabledGenerators,
      "preGenerate",
      generatorInput,
      options,
    );

    hoistNamedItems(generatorInput, generatorInput.structure);

    recursiveLinkupReferences(
      generatorInput.structure,
      generatorInput.structure,
    );

    const newCount = getTopLevelItemCount(generatorInput);

    if (newCount === prevCount) {
      break;
    }
    prevCount = newCount;
  }

  const files = await callGeneratorMethod(
    app,
    options.enabledGenerators,
    "generate",
    generatorInput,
    options,
  );

  if (options.dumpStructure) {
    files.push({
      path: "./structure.js",
      source: `export const structure = JSON.parse('${generatorInput.stringified}');\n`,
    });
  }

  await normalizeAndWriteFiles(options, files);
}

/**
 * @param input
 * @param copy
 * @param groups
 */
function addGroupsToGeneratorInput(input, copy, groups) {
  for (const group of groups) {
    input.structure[group] = copy.structure[group] || {};
  }

  includeReferenceTypes(copy, input, input.structure);
}

/**
 * Call a method on the specific generator with the specified arguments
 *
 * @param {App} app
 * @param {string} generatorName
 * @param {string} method
 * @param {...*} args
 * @returns {Promise<undefined|*>}
 */
export async function callSpecificGeneratorWithMethod(
  app,
  generatorName,
  method,
  ...args
) {
  const gen = app.generators.get(generatorName);
  if (!gen) {
    throw new Error(`Could not find generator with name: ${generatorName}`);
  }
  if (method in gen) {
    if (app.verbose) {
      app.logger.info(`generator: calling ${method} on ${gen.name}`);
    }
    return gen[method](app, ...args);
  }

  return undefined;
}

/**
 * Call a method on all generators
 *
 * @param {App} app
 * @param {string[]|Iterable<string>} keys
 * @param {string} method
 * @param {...*} args
 * @returns {Promise<*[]>}
 */
export async function callGeneratorMethod(app, keys, method, ...args) {
  const result = [];

  for (const key of keys) {
    const tmp = await callSpecificGeneratorWithMethod(
      app,
      key,
      method,
      ...args,
    );
    if (tmp) {
      result.push(tmp);
    }
  }

  return result;
}

/**
 * Add item to correct group and nmame
 *
 * @param dataStructure
 * @param item
 */
export function addToData(dataStructure, item) {
  if (!item.group || !item.name || !item.type) {
    throw new Error(
      `Can't process item. Missing either group, name or type. Found: ${JSON.stringify(
        item,
      )}`,
    );
  }

  if (!dataStructure.structure[item.group]) {
    dataStructure.structure[item.group] = {};
  }
  dataStructure.structure[item.group][item.name] = item;

  item.uniqueName = upperCaseFirst(item.group) + upperCaseFirst(item.name);
}

/**
 * @param {GenerateOpts} options
 * @param {(GeneratedFile|GeneratedFile[])[]} files
 */
async function normalizeAndWriteFiles(options, files) {
  const flattenedFiles = [];

  for (const file of files) {
    if (!Array.isArray(file) && isPlainObject(file)) {
      flattenedFiles.push(file);
    } else if (Array.isArray(file)) {
      flattenedFiles.push(...file);
    }
  }

  if (!existsSync(options.outputDirectory)) {
    await mkdir(options.outputDirectory, { recursive: true });
  }

  for (const file of flattenedFiles) {
    const filePath = path.join(options.outputDirectory, file.path);
    await writeFile(filePath, file.source, { encoding: "utf-8" });
  }
}

/**
 * Find nested references and add to stubData in the correct group
 *
 * @param rootData
 * @param generatorInput
 * @param value
 */
function includeReferenceTypes(rootData, generatorInput, value) {
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
      !isNil(rootData.structure[group]?.[name]) &&
      isNil(generatorInput.structure[group]?.[name])
    ) {
      if (isNil(generatorInput.structure[group])) {
        generatorInput.structure[group] = {};
      }

      const refValue = rootData.structure[group][name];
      generatorInput.structure[group][name] = refValue;
      includeReferenceTypes(rootData, generatorInput, refValue);
    } else if (isNil(rootData.structure[group]?.[name])) {
      throw new Error(`Missing item at ${value.reference.uniqueName}`);
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      includeReferenceTypes(rootData, generatorInput, value[key]);
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      includeReferenceTypes(rootData, generatorInput, value[i]);
    }
  }
}

/**
 * @param root
 * @param structure
 */
export function hoistNamedItems(root, structure) {
  for (const group of Object.values(structure)) {
    for (const item of Object.values(group)) {
      hoistNamedItemsRecursive(root, item);
    }
  }
}

/**
 * @param root
 * @param value
 */
function hoistNamedItemsRecursive(root, value) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    // Skip primitives & null / undefined
    return;
  }

  if (isNamedTypeBuilderLike(value)) {
    // Most likely valid output from TypeBuilder
    // Just overwrite it
    addToData(root, value);
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      hoistNamedItemsRecursive(root, value[key]);
      if (isNamedTypeBuilderLike(value[key])) {
        // value[key] got a uniqueName when called with addToData()
        value[key] = {
          ...TypeBuilder.baseData,
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
      hoistNamedItemsRecursive(root, value[i]);
      if (isNamedTypeBuilderLike(value[i])) {
        // value[i] got a uniqueName when called with addToData()
        value[i] = {
          ...TypeBuilder.baseData,
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
}

/**
 * Count the number of items in data
 *
 * @param data
 * @returns {number}
 */
function getTopLevelItemCount(data) {
  let count = 0;
  for (const group of Object.values(data.structure)) {
    count += Object.keys(group).length;
  }

  return count;
}
