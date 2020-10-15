import { DateType } from "../../builders/DateType.js";
import { buildOrInfer } from "../../builders/utils.js";
import { getQueryEnabledObjects, getTypeOfPrimaryKey } from "./utils.js";

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
      if (relation.isOptional) {
        type.keys[relation.ownKey].isOptional = true;
      }
      break;
  }
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
