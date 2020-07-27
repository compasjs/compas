import { addToData } from "../../generate.js";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { getItem, upperCaseFirst } from "../../utils.js";

/**
 * Build types for objects that have queries enabled
 * Does it in 2 passes:
 *  - Create the basic sql type
 *  - Add relations to the sql type
 * @param data
 */
export function buildExtraTypes(data) {
  for (const group of Object.keys(data.structure)) {
    for (const name of Object.keys(data.structure[group])) {
      const item = data.structure[group][name];

      if (!item.enableQueries || item.type !== "object") {
        continue;
      }

      if (!item._didSqlGenerate) {
        buildSqlType(data, item);
      } else if (!item._didSqlSelectJoinGenerate) {
        buildSqlSelectJoinType(data, item);
      }
    }
  }
}

function buildSqlType(data, item) {
  const { group, name } = item;
  // withHistory implies withDates
  if (item?.queryOptions?.withDates || item?.queryOptions?.withHistory) {
    addDateFields(item);
  }

  // The sql generator filters on type === "sql"
  const queryType = {
    type: "sql",
    group: group,
    name: `${name}Sql`,
    original: {
      group: group,
      name: name,
    },
    shortName: shortName(item.name),
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

function buildSqlSelectJoinType(data, item) {
  // Bruteforce way of getting all relations
  const relations = [];
  for (const group of Object.keys(data.structure)) {
    for (const name of Object.keys(data.structure[group])) {
      const rel = data.structure[group][name];
      if (rel.type === "relation") {
        const left = getItem(rel.left);
        if (left.group === item.group && left.name === item.name) {
          relations.push(rel);
        }
      }
    }
  }

  const queryType = data.structure[item.group][`${item.name}Sql`];
  queryType.relations = [];

  const T = new TypeCreator(item.group);
  for (const rel of relations) {
    if (rel.relationType === "manyToOne") {
      const rightSide = getItem(rel.right);

      // Useful data for the template
      const relationMeta = {
        name: `${item.name}With${upperCaseFirst(rightSide.name)}`,
        whereType: undefined,
        selectName: `${item.name}SelectWith${upperCaseFirst(rightSide.name)}`,
        rightShortName: shortName(rightSide.name),
        rightName: rightSide.name,
        rightGroup: rightSide.group,
        leftKey: rel.leftKey,
        rightKey: rel.rightKey,
        substituteKey: rel.substituteKey,
      };

      // Creates the new type with field added
      addToData(data, {
        ...item,
        name: relationMeta.name,
        keys: {
          ...item.keys,
          [rel.substituteKey]: T.reference(
            rightSide.group,
            rightSide.name,
          ).build(),
        },
        enableQueries: false,
      });

      // Creates the new where type with embedded where for the joined type
      // TODO: Add support for a where type that can filter on results that don't have
      //   a joined item
      const whereItem = {
        ...data.structure[item.group][`${item.name}Where`],
        name: `${relationMeta.name}Where`,
        keys: {
          ...data.structure[item.group][`${item.name}Where`].keys,
          [rel.substituteKey]: T.reference(
            rightSide.group,
            `${rightSide.name}Where`,
          )
            .optional()
            .build(),
        },
      };
      addToData(data, whereItem);
      relationMeta.whereType = whereItem.uniqueName;

      queryType.relations.push(relationMeta);
    }
  }

  item._didSqlSelectJoinGenerate = true;
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
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("date").class.getBaseData(),
    type: "date",
    defaultValue: "(new Date())",
    isOptional: true,
    sql: {
      searchable: true,
    },
  };
  item.keys.updatedAt = {
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("date").class.getBaseData(),
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
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("object").class.getBaseData(),
    type: "object",
    group: item.group,
    name: `${item.name}Where`,
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = item.keys[key];
    // We don't support optional field searching, since it will break the way we do the
    // query generation e.g. NULL IS NULL is always true and thus the search results are
    // invalid
    if (it.isOptional || !it?.sql?.searchable) {
      continue;
    }

    // Also supports referenced fields
    const type = getItem(it)?.type;

    if (type === "number" || type === "date") {
      // Generate =, > and < queries

      fieldsArray.push(
        {
          key,
          name: key,
          type: "equal",
        },
        { key, name: `${key}GreaterThan`, type: "greaterThan" },
        { key, name: `${key}LowerThan`, type: "lowerThan" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[`${key}GreaterThan`] = { ...it, isOptional: true };
      resultType.keys[`${key}LowerThan`] = { ...it, isOptional: true };
    } else if (type === "string") {
      // Generate = and LIKE %input% queries

      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: `${key}Like`, type: "like" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[`${key}Like`] = { ...it, isOptional: true };
    } else if (type === "uuid") {
      // Generate = and IN (uuid1, uuid2) queries
      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: `${key}In`, type: "in" },
      );

      resultType.keys[key] = { ...it, isOptional: true };
      resultType.keys[`${key}In`] = {
        ...TypeBuilder.getBaseData(),
        ...TypeCreator.types.get("array").class.getBaseData(),
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
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("object").class.getBaseData(),
    type: "object",
    group: item.group,
    name: `${item.name}InsertPartial`,
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = item.keys[key];

    // Partial updates don't need to update primary key
    if (it?.sql?.primary) {
      continue;
    }

    // Support updating referenced field
    const type = getItem(it)?.type;

    // JSON.stringify all values that are not 'primitives'
    // So the user will can have a lbu GenericType into a JSONB field
    fieldsArray.push({
      source: key,
      defaultValue: it.defaultValue,
      stringify:
        ["number", "boolean", "string", "date", "uuid"].indexOf(type) === -1,
    });

    resultType.keys[key] = { ...it };
  }

  return { fieldsArray, type: resultType };
}

/**
 * FileHistory => fh
 * @param {string} name
 * @returns {string}
 */
function shortName(name) {
  return name
    .split(/(?=[A-Z])/)
    .map((it) => (it[0] || "").toLowerCase())
    .join("");
}
