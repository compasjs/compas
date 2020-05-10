import { compileTemplate, isNil, isPlainObject } from "@lbu/stdlib";
import { TypeCreator } from "./types/index.js";

export function upperCaseFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}

export function lowerCaseFirst(str) {
  return str[0].toLowerCase() + str.substring(1);
}

/**
 * Compile templates from types and build a dynamic execute template function
 * @param {TemplateContext} tc
 * @param {object} options
 * @param {string} key
 * @param {string} fnStringStart
 * @param {function(TypePlugin, string): string} fnStringAdd
 * @param {string} fnStringEnd
 * @param {string} [pluginKey]
 * @return {void}
 */
export function compileDynamicTemplates(
  tc,
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
    compileTemplate(tc, templateName, type[pluginKey]());

    fnString += fnStringAdd(type, templateName);
  }

  fnString += fnStringEnd;

  compileTemplate(tc, `${key}Exec`, fnString);
}

/**
 * Create a js-reference for reference types
 * @param data
 * @param value
 */
export function recursiveLinkupReferences(structure, value) {
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
    if (!isNil(structure[group]?.[name])) {
      if (isNil(value.reference.field)) {
        value.referencedItem = structure[group][name];
      } else {
        const otherValue = structure[group][name];
        if (isNil(otherValue) || otherValue.type !== "object") {
          throw new Error(
            `Can't resolve a field reference to ${otherValue.uniqueName}, which is not an object but a ${otherValue.type}.`,
          );
        }

        if (isNil(otherValue.keys[value.reference.field.referencing])) {
          throw new Error(
            `Referenced field ${value.reference.field.referencing} does not exists on ${otherValue.uniqueName}`,
          );
        }

        value.referencedItem =
          otherValue.keys[value.reference.field.referencing];
      }
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      recursiveLinkupReferences(structure, value[key]);
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      recursiveLinkupReferences(structure, value[i]);
    }
  }
}
