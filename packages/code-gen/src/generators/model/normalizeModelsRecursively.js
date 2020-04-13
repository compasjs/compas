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

  if (isPlainObject(value) && value.type && value.name) {
    // Type is most likely a build from a named Modelbuiler
    // Make sure that if it is not in known models, put it there
    if (!models[value.name]) {
      models[value.name] = value;
    }
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      normalizeModelsRecursively(models, value[key]);
      if (value[key] && value[key].name && value[key].type) {
        value[key] = {
          type: "reference",
          docs: "",
          optional: false,
          referenceModel: value[key].name,
          referenceField: undefined,
        };
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      normalizeModelsRecursively(models, value[i]);
      if (value[i] && value[i].name && value[i].type) {
        value[i] = {
          type: "reference",
          docs: "",
          optional: false,
          referenceModel: value[i].name,
          referenceField: undefined,
        };
      }
    }
  }
}
