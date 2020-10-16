import { DateType } from "../../builders/DateType.js";
import { buildOrInfer } from "../../builders/utils.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";

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
  if (["manyToOne", "oneToOne"].indexOf(relation.subType) === -1) {
    return;
  }

  const { field } = getPrimaryKeyWithType(type);
  type.keys[relation.ownKey] = {
    ...field,
    sql: {
      searchable: true,
    },
    isOptional: true,
  };
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
