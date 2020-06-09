import { camelToSnakeCase } from "@lbu/stdlib";
import { addToData } from "../../generate.js";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { getTypeOfItem } from "../../utils.js";

/**
 * @param data
 */
export function buildExtraTypes(data) {
  for (const group of Object.keys(data.structure)) {
    for (const name of Object.keys(data.structure[group])) {
      const item = data.structure[group][name];

      if (
        !item.enableQueries ||
        item.type !== "object" ||
        item._didSqlGenerate
      ) {
        continue;
      }

      // withHistory implies withDates
      if (item?.queryOptions?.withDates || item?.queryOptions?.withHistory) {
        addDateFields(item);
      }

      const queryType = {
        type: "sql",
        group: group,
        name: name + "Sql",
        original: {
          group: group,
          name: name,
        },
        shortName: item.name
          .split(/(?=[A-Z])/)
          .map((it) => (it[0] || "").toLowerCase())
          .join(""), // FileHistory => fh
      };

      addToData(data, queryType);

      const where = getWhereFields(item);
      addToData(data, where.type);

      const partial = getPartialFields(item);
      addToData(data, partial.type);

      queryType.whereFields = where.fieldsArray;
      queryType.partialFields = partial.fieldsArray;

      item._didSqlGenerate = true;
    }
  }
}

/**
 * Add createdAt and updatedAt to this item
 * These fields are optional as either LBU or Postgres will fill them
 *
 * @param item
 */
function addDateFields(item) {
  item.queryOptions.dateFields = true;
  item.keys.createdAt = {
    ...TypeBuilder.baseData,
    ...TypeCreator.types.get("date").class.baseData,
    type: "date",
    defaultValue: "(new Date())",
    isOptional: true,
    sql: {
      searchable: true,
    },
  };
  item.keys.updatedAt = {
    ...TypeBuilder.baseData,
    ...TypeCreator.types.get("date").class.baseData,
    type: "date",
    defaultValue: "(new Date())",
    isOptional: true,
    sql: {
      searchable: true,
    },
  };
}

/**
 * Get where fields and input type
 *
 * @param item
 * @returns {{type: object, fieldsArray: *[]}}
 */
function getWhereFields(item) {
  const fieldsArray = [];
  const resultType = {
    ...TypeBuilder.baseData,
    ...TypeCreator.types.get("object").baseData,
    type: "object",
    group: item.group,
    name: item.name + "Where",
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = item.keys[key];
    // We don't support optional field searching, since it will break the way we do the
    // query generation e.g. NULL IS NULL is always true and thus the search results are
    // invalid
    if (it.isOptional || (!it?.sql?.searchable && !it?.reference?.field)) {
      continue;
    }

    // Also supports referenced fields
    const type = getTypeOfItem(it);

    if (type === "number" || type === "date") {
      // Generate =, > and < queries

      fieldsArray.push(
        {
          key,
          name: key,
          type: "equal",
        },
        { key, name: key + "GreaterThan", type: "greaterThan" },
        { key, name: key + "LowerThan", type: "lowerThan" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[key + "GreaterThan"] = { ...it, isOptional: true };
      resultType.keys[key + "LowerThan"] = { ...it, isOptional: true };
    } else if (type === "string") {
      // Generate = and LIKE %input% queries

      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: key + "Like", type: "like" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[key + "Like"] = { ...it, isOptional: true };
    } else if (type === "uuid") {
      // Generate = and IN (uuid1, uuid2) queries
      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: key + "In", type: "in" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[key + "In"] = {
        ...TypeBuilder.baseData,
        ...TypeCreator.types.get("array").class.baseData,
        type: "array",
        isOptional: true,
        values: { ...it },
      };
    }
  }

  return { fieldsArray, type: resultType };
}

/**
 * Get where fields and input type
 *
 * @param item
 * @returns {{type: object, fieldsArray: *[]}}
 */
function getPartialFields(item) {
  const fieldsArray = [];
  const resultType = {
    ...TypeBuilder.baseData,
    ...TypeCreator.types.get("object").baseData,
    type: "object",
    group: item.group,
    name: item.name + "InsertPartial",
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = item.keys[key];

    // Partial updates don't need to update primary key
    if (it?.sql?.primary) {
      continue;
    }

    // Support updating referenced field
    const type = getTypeOfItem(it);

    // JSON.stringify all values that are not 'primitives'
    // So the user will can have a lbu GenericType into a JSONB field
    fieldsArray.push({
      source: key,
      result: camelToSnakeCase(key),
      defaultValue: it.defaultValue,
      stringify:
        ["number", "boolean", "string", "date", "uuid"].indexOf(type) === -1,
    });

    resultType.keys[key] = { ...it };
  }

  return { fieldsArray, type: resultType };
}
