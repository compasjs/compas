/**
 * Links up references in the structure.
 *
 * @param {CodeGenContext} context
 */
import { isNil } from "@lbu/stdlib";

export function linkupReferencesInStructure(context) {
  for (const group of Object.values(context.structure)) {
    for (const item of Object.values(group)) {
      recursivelyLinkupReferences(context, item);
    }
  }
}

/**
 * @param {CodeGenContext} context
 * @param {CodeGenType} item
 * @returns {CodeGenType}
 */
function recursivelyLinkupReferences(context, item) {
  if (isNil(item?.type)) {
    return item;
  }

  switch (item.type) {
    case "any":
    case "boolean":
    case "date":
    case "file":
    case "number":
    case "string":
    case "uuid":
      break;
    case "anyOf":
      for (let i = 0; i < item.values.length; ++i) {
        item.values[i] = recursivelyLinkupReferences(context, item.values[i]);
      }
      break;
    case "array":
      item.values = recursivelyLinkupReferences(context, item.values);
      break;
    case "generic":
      item.keys = recursivelyLinkupReferences(context, item.keys);
      item.values = recursivelyLinkupReferences(context, item.values);
      break;
    case "object":
      for (const key of Object.keys(item.keys)) {
        item.keys[key] = recursivelyLinkupReferences(context, item.keys[key]);
      }
      for (let i = 0; i < item.relations.length; ++i) {
        recursivelyLinkupReferences(context, item.relations[i]);
      }
      break;
    case "reference":
      item.reference =
        context.structure[item.reference.group][item.reference.name];
      return item;
    case "relation":
      item.reference = recursivelyLinkupReferences(context, item.reference);
      break;
    case "route":
      item.params = recursivelyLinkupReferences(context, item.params);
      item.query = recursivelyLinkupReferences(context, item.query);
      item.body = recursivelyLinkupReferences(context, item.body);
      item.files = recursivelyLinkupReferences(context, item.files);
      item.response = recursivelyLinkupReferences(context, item.response);
      break;
  }

  return item;
}
