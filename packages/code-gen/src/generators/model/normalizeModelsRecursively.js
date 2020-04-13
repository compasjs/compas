import { isNil, isPlainObject } from "@lbu/stdlib";

/**
 * On the way down, register unknown named models
 * On the way up, replace anything that is named with a referene
 * @param models
 * @param value
 */
export function normalizeModelsRecursively(models, value) {
  if (isNil(value) || (!isPlainObject(value) && !Array.isArray(value))) {
    return;
  }

  if (isPlainObject(value) && value.type && value.uniqueName) {
    // Type is most likely a build from a named Modelbuiler
    // Make sure that if it is not in known models, put it there
    if (!models[value.uniqueName]) {
      models[value.uniqueName] = value;
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      normalizeModelsRecursively(models, value[key]);
      if (value[key] && value[key].uniqueName && value[key].type) {
        value[key] = {
          type: "reference",
          docString: "",
          isOptional: false,
          referenceModel: value[key].uniqueName,
          referenceField: undefined,
        };
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      normalizeModelsRecursively(models, value[i]);
      if (value[i] && value[i].uniqueName && value[i].type) {
        value[i] = {
          type: "reference",
          docString: "",
          isOptional: false,
          referenceModel: value[i].uniqueName,
          referenceField: undefined,
        };
      }
    }
  }
}
