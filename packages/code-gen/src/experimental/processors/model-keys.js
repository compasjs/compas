import { AppError, isNil } from "@compas/stdlib";
import { DateType, UuidType } from "../../builders/index.js";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";

/**
 * Cache primary key lookups, based on the model.
 *
 * @type {WeakMap<object, {
 *   primaryKeyName: string,
 *   primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition
 * }>}
 */
const primaryKeyCache = new WeakMap();

/**
 * Cache searchable keys, based on the model.
 *
 * @type {WeakMap<object, string[]>}
 */
const searchableKeyCache = new WeakMap();

/**
 * Add or resolve the primary key of a model.
 *
 * It tries to find the existing primary key. If it can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelKeyAddPrimary(generateContext) {
  /**
   * @type {import("@compas/stdlib").AppError[]}
   */
  const errors = [];

  for (const model of structureModels(generateContext)) {
    try {
      const { primaryKeyDefinition, primaryKeyName } =
        modelKeyGetPrimary(model);

      if (!["uuid", "number", "string"].includes(primaryKeyDefinition.type)) {
        throw AppError.serverError({
          message: `The primary key of '${model.name}' has an invalid type. Expected 'T.uuid().primary()', 'T.number().primary' or 'T.string().primary()'. Found '${primaryKeyDefinition.type}' (at field '${primaryKeyName}'). The generator is able to auto-create a primary key if none is provided.`,
        });
      }
    } catch (/** @type {any} */ error) {
      if (
        model.queryOptions?.withPrimaryKey === false ||
        !isNil(model.keys.id)
      ) {
        errors.push(error);
      } else {
        model.keys["id"] = new UuidType()
          .primary()
          .docs(`The primary key of the '${model.name}' model.`)
          .build();
      }
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Add default date keys to the structureModels.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelKeyAddDateKeys(generateContext) {
  for (const model of structureModels(generateContext)) {
    // Add date fields if necessary
    if (model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes) {
      model.keys["createdAt"] = new DateType()
        .sqlDefault()
        .searchable()
        .docs(
          "Automatically generated 'createdAt', containing an ISO timestamp.",
        )
        .build();
      model.keys["updatedAt"] = new DateType()
        .sqlDefault()
        .searchable()
        .docs(
          "Automatically generated 'updatedAt', containing an ISO timestamp.",
        )
        .build();
    }

    if (model.queryOptions?.withSoftDeletes) {
      model.keys["deletedAt"] = new DateType()
        .optional()
        .searchable()
        .docs(
          "Automatically generated 'deletedAt', containing an ISO timestamp. This is by default filtered on in 'select' queries.",
        )
        .build();
    }
  }
}

/**
 * Get the primary key information of a model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition:
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * }}
 */
export function modelKeyGetPrimary(model) {
  if (primaryKeyCache.has(model)) {
    // @ts-expect-error
    //
    // This pretty much can't go wrong...
    // One of the reasons why I don't use TS.
    return primaryKeyCache.get(model);
  }

  for (const key of Object.keys(model.keys)) {
    const value = model.keys[key];
    if (value.sql?.primary) {
      const result = {
        primaryKeyName: key,
        primaryKeyDefinition: value,
      };

      primaryKeyCache.set(model, result);

      return result;
    }
  }

  throw AppError.serverError({
    message: `Could not resolve the primary key of ${stringFormatNameForError(
      model,
    )}. Either add a primary key to the definition like: 'T.uuid().primary()' or remove 'withPrimaryKey: false' from the '.enableQueries()' call.`,
  });
}

/**
 * Get the searchable model keys for the provided model.
 *
 * The result is cached and early returned in the next call with the same model.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} model
 * @returns {string[]}
 */
export function modelKeyGetSearchable(generateContext, model) {
  if (searchableKeyCache.has(model)) {
    // @ts-expect-error
    //
    // This pretty much can't go wrong...
    // One of the reasons why I don't use TS.
    return searchableKeyCache.get(model);
  }

  const fields = [];

  for (const key of Object.keys(model.keys)) {
    if (
      referenceUtilsGetProperty(generateContext, model.keys[key], [
        "sql",
        "searchable",
      ])
    ) {
      fields.push(key);
    }
  }

  searchableKeyCache.set(model, fields);

  return fields;
}
