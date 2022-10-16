import { AppError, isNil } from "@compas/stdlib";
import { DateType, UuidType } from "../../builders/index.js";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { queryEnabledObjects } from "./query-enabled-objects.js";

/**
 * Cache primary key lookups.
 *
 * @type {WeakMap<object, {
 *   primaryKeyName: string,
 *   primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition
 * }>}
 */
const primaryKeyCache = new WeakMap();

/**
 * Add or resolve the primary key of query enabled objects.
 *
 * It tries to find the existing primary key. If it i can't find any, we check if we may
 * add one ('withPrimaryKey: true'). If we also may not add a primary key, we throw an
 * error.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseFieldsAddPrimaryKey(generateContext) {
  /**
   * @type {import("@compas/stdlib").AppError[]}
   */
  const errors = [];

  for (const namedType of queryEnabledObjects(generateContext)) {
    try {
      databaseFieldGetPrimaryKey(namedType);
    } catch (/** @type {any} */ error) {
      if (
        namedType.queryOptions?.withPrimaryKey === false ||
        !isNil(namedType.keys.id)
      ) {
        errors.push(error);
      } else {
        namedType.keys["id"] = new UuidType()
          .primary()
          .docs(`The primary key of the '${namedType.name} model.`)
          .build();
      }
    }
  }

  return errorsThrowCombinedError(errors);
}

/**
 * Add default date fields to the query enabled objects.
 *
 * Could add `createdAt`, `updatedAt` and `deletedAt` fields.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseFieldsAddDateFields(generateContext) {
  for (const namedType of queryEnabledObjects(generateContext)) {
    // Add date fields if necessary
    if (
      namedType.queryOptions?.withDates ||
      namedType.queryOptions?.withSoftDeletes
    ) {
      namedType.keys["createdAt"] = new DateType()
        .defaultToNow()
        .searchable()
        .docs("Automatically generated 'createdAt' field.")
        .build();
      namedType.keys["updatedAt"] = new DateType()
        .defaultToNow()
        .searchable()
        .docs("Automatically generated 'updatedAt' field.")
        .build();
    }

    if (namedType.queryOptions?.withSoftDeletes) {
      namedType.keys["deletedAt"] = new DateType()
        .searchable()
        .docs(
          "Automatically generated 'deletedAt' field. This is by default filtered on in 'select' queries.",
        )
        .build();
    }
  }
}

/**
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} namedType
 * @returns {{
 *   primaryKeyName: string,
 *   primaryKeyDefinition: import("../generated/common/types").ExperimentalTypeDefinition
 * }}
 */
export function databaseFieldGetPrimaryKey(namedType) {
  if (primaryKeyCache.has(namedType)) {
    // @ts-expect-error
    //
    // This pretty much can't go wrong...
    // One of the reason why I don't use TS normally.
    return primaryKeyCache.get(namedType);
  }

  for (const key of Object.keys(namedType.keys)) {
    const value = namedType.keys[key];
    if (value.sql?.primary) {
      const result = {
        primaryKeyName: key,
        primaryKeyDefinition: value,
      };

      primaryKeyCache.set(namedType, result);

      return result;
    }
  }

  throw AppError.serverError({
    message: `Could not resolve the primary key of ${stringFormatNameForError(
      namedType,
    )}. Either add a primary key to the definition like: 'T.uuid().primary()' or remove 'withPrimaryKey: false' from the '.enableQueries()' call.`,
  });
}
