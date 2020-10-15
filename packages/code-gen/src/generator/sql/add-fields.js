import { isNil } from "@lbu/stdlib";
import { DateType } from "../../builders/DateType.js";
import { buildOrInfer } from "../../builders/utils.js";
import { getQueryEnabledObjects } from "./utils.js";

/**
 * Adds the fields that are added by relations
 *
 * @param {CodeGenContext} context
 */
export function addFieldsOfRelations(context) {
  for (const type of getQueryEnabledObjects(context)) {
    for (const relation of type.relations) {
      addFieldsForRelation(context, type, relation);
    }

    if (type.queryOptions.withDates || type.queryOptions.withSoftDeletes) {
      type.keys["createdAt"] = getSystemDate();
      type.keys["updatedAt"] = getSystemDate();
    }
    if (type.queryOptions.withSoftDeletes) {
      type.keys["deletedAt"] = {
        ...getSystemDate(),
        defaultValue: undefined,
      };
    }
  }
}

/**
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 * @param {CodeGenRelationType} relation
 */
export function addFieldsForRelation(context, type, relation) {
  switch (relation.subType) {
    case "manyToOne":
    case "oneToOne":
      type.keys[relation.ownKey] = getTypeOfPrimaryKey(type);
      break;
  }
}

/**
 * Get primary key of object type.
 * If not exists, throw nicely.
 * The returned value is a copy, and not primary anymore.
 *
 * @param {CodeGenObjectType} type
 */
function getTypeOfPrimaryKey(type) {
  const primary = Object.values(type.keys).find((it) => it.sql?.primary);

  if (isNil(primary)) {
    throw new Error(
      `Type ${type.group}.${type.name} is missing a primary key, but has enabled queries.`,
    );
  }

  // Override 'primary'
  return { ...primary, sql: { searchable: true } };
}

/**
 * Get the default Date type.
 *
 * @returns {CodeGenDateType}
 */
function getSystemDate() {
  return buildOrInfer(
    new DateType()
      .defaultToNow()
      .searchable()
      .docs("Automatically generated field"),
  );
}
