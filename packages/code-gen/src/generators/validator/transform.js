import { isPlainObject } from "@lbu/stdlib";

/**
 * Recursively adds referenced models to result.
 * This is needed because of the way we generate the validators, and reuse the referenced
 * models instead of generating all over again
 */
export function extractValidatorsToGenerate(models, value, result) {
  // skip non objects and arrays
  if (!value || (!isPlainObject(value) && !Array.isArray(value))) {
    return;
  }

  if (value.type && value.uniqueName) {
    // named item, should be top level
    if (result.indexOf(value.uniqueName) === -1) {
      result.push(value.uniqueName);
    } else {
      // already this this variant
      return;
    }
  } else if (value.type && value.reference && value.reference.uniqueName) {
    // reference
    if (result.indexOf(value.reference.uniqueName) === -1) {
      extractValidatorsToGenerate(
        models,
        models[value.reference.uniqueName],
        result,
      );
    }

    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) {
      extractValidatorsToGenerate(models, value[key], result);
    }
  } else if (Array.isArray(value)) {
    for (const v of value) {
      extractValidatorsToGenerate(models, v, result);
    }
  }
}
