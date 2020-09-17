import { isNil, isPlainObject } from "@lbu/stdlib";
import { compileTemplate } from "./template.js";
import { TypeCreator } from "./types/index.js";

/**
 * @param {*} data
 * @param {string} type
 * @returns {string[]}
 */
export function getGroupsThatIncludeType(data, type) {
  if (!isPlainObject(data)) {
    throw new Error(`data should be an object.`);
  }

  const result = [];

  for (const groupData of Object.values(data)) {
    for (const item of Object.values(groupData)) {
      if (item.type === type) {
        result.push(item.group);
        break;
      }
    }
  }

  return result;
}

/**
 * Uppercase first character of the input string
 *
 * @param {string} str input string
 * @returns {string}
 */
export function upperCaseFirst(str) {
  return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : "";
}

/**
 * Lowercase first character of the input string
 *
 * @param {string} str input string
 * @returns {string}
 */
export function lowerCaseFirst(str) {
  return str.length > 0 ? str[0].toLowerCase() + str.substring(1) : "";
}

/**
 * Compile templates from types and build a dynamic execute template function
 *
 * @param {object} options
 * @param {string} key
 * @param {string} fnStringStart
 * @param {function(TypePlugin, string): string} fnStringAdd
 * @param {string} fnStringEnd
 * @param {string} [pluginKey]
 * @returns {void}
 */
export function compileDynamicTemplates(
  options,
  key,
  { fnStringStart, fnStringAdd, fnStringEnd },
  pluginKey = key,
) {
  const typePlugins = TypeCreator.getTypesWithProperty(pluginKey);
  const optsKey = `${key}_enabledTypes`;

  options[optsKey] = [];
  let fnString = fnStringStart;

  for (const type of typePlugins) {
    options[optsKey].push(type.name);

    const templateName = `${type.name}${upperCaseFirst(key)}`;
    compileTemplate(templateName, type[pluginKey]());

    fnString += fnStringAdd(type, templateName);
  }

  fnString += fnStringEnd;

  compileTemplate(`${key}Exec`, fnString);
}

/**
 * Follows references till back at the root with a named item
 * @param {CodeGenStructure} structure
 * @param {object} reference
 */
export function followReference(structure, reference) {
  const item = structure?.[reference?.group]?.[reference?.name];

  if (isNil(item)) {
    return item;
  }

  if (item.type === "reference") {
    if (!isNil(item.reference.type)) {
      return item.reference;
    }
    return followReference(structure, item.reference);
  }

  return item;
}

/**
 * Try to get the (recursive) (referenced) item.
 * Only works in the preGenerate or generate phase of code-generation
 *
 * @param {object} item
 * @returns {object}
 */
export function getItem(item) {
  if (item?.type !== "reference") {
    return item;
  }

  return item?.reference;
}
