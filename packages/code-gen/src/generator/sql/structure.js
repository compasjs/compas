import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { getQueryEnabledObjects, getSortedKeysForType } from "./utils.js";
import { getSearchableFields } from "./where-type.js";

const typeTable = {
  any: "jsonb",
  anyOf: "jsonb",
  array: "jsonb",
  boolean: "boolean",
  date: "timestamptz",
  generic: "jsonb",
  number: (type) =>
    !type.sql?.primary
      ? type.floatingPoint
        ? "float"
        : "int"
      : "BIGSERIAL PRIMARY KEY",
  object: "jsonb",
  string: (type) => (type.sql?.primary ? "varchar PRIMARY KEY" : "varchar"),
  uuid: (type) => (type.sql?.primary ? "uuid PRIMARY KEY" : "uuid"),
};

/**
 * Generates the sql structure, this can be used to create migration files from
 * @param {CodeGenContext} context
 */
export function generateSqlStructure(context) {
  const partials = [
    `
-- This file is a suggestion, and can be used to create your creation files.
-- Please note that indexes can have a negative impact on performance.
-- Also a reminder that the order in this file, is not the order that migrations should be created,
-- since tables can depend on other tables.
-- This file should not be committed to your version control system.
  `,
  ];

  for (const type of getQueryEnabledObjects(context)) {
    partials.push(`
      CREATE TABLE "${type.name}"
      (
        ${[].concat(getFields(type), getForeignKeys(type)).join(",\n   ")}
      );

      ${getIndexes(type)}
    `);
  }

  context.outputFiles.push({
    contents: partials.join("\n\n"),
    relativePath: "./structure.sql",
  });
}

/**
 * @param {CodeGenObjectType} object
 */
function getFields(object) {
  return getSortedKeysForType(object).map((key) => {
    let type = object.keys[key];
    if (type.type === "reference") {
      type = type.reference;
    }

    let sqlType = typeTable[type.type];
    if (typeof sqlType === "function") {
      sqlType = sqlType(type);
    }

    let defaultValue = "";
    if (type.defaultValue || type.sql?.primary) {
      switch (type.type) {
        case "uuid":
          if (type.sql?.primary) {
            defaultValue = "DEFAULT uuid_generate_v4()";
          }
          break;
        case "date":
          if (type.defaultValue === "(new Date())") {
            defaultValue = "DEFAULT now()";
          }
      }
    }

    return `"${key}" ${sqlType} ${
      type.isOptional && isNil(type.defaultValue) ? "" : "NOT "
    }NULL ${defaultValue}`;
  });
}

/**
 * @param {CodeGenType} type
 */
function getForeignKeys(type) {
  //   constraint foo foreign key ("label") REFERENCES "categoryMeta" ("id")
  const result = [];
  for (const relation of type.relations) {
    if (
      relation.subType === "oneToMany" ||
      relation.subType === "oneToOneReverse"
    ) {
      continue;
    }

    const otherSide = relation.reference.reference;
    const primaryKeyOfOtherSide = Object.entries(otherSide.keys).find(
      (it) => it[1].sql?.primary,
    )[0];

    let base = `constraint "${type.name}${upperCaseFirst(
      relation.ownKey,
    )}Fk" foreign key ("${relation.ownKey}") references "${
      otherSide.name
    }" ("${primaryKeyOfOtherSide}") `;

    // Truth table:
    // this:withSoftDeletes | other:withSoftDeletes | this:isOptional | onDelete |
    //        -             |           -           |          -      |  CASCADE |
    //
    //        x             |           -           |          -      |  CASCADE |
    //        -             |           x           |          -      |  CASCADE |
    //        -             |           -           |          x      |  NULL    |
    //
    //        x             |           x           |          -      |  CASCADE |
    //        x             |           -           |          x      |  NULL    |
    //        -             |           x           |          x      |  NULL    |
    //
    //        x             |           x           |          x      |  NULL    |

    if (relation.isOptional) {
      base += "ON DELETE SET NULL";
    } else {
      base += "ON DELETE CASCADE";
    }

    result.push(base);
  }

  return result;
}

/**
 * @param {CodeGenType} type
 */
function getIndexes(type) {
  const fields = getSearchableFields(type);

  const result = [];

  for (const key of Object.keys(fields)) {
    const field = fields[key];

    if (field.sql.primary || ["createdAt", "updatedAt"].indexOf(key) !== -1) {
      // skip primary field and default date fields
      continue;
    }

    result.push(
      `CREATE INDEX "${type.name}${upperCaseFirst(key)}Idx" ON "${
        type.name
      }" ("${key}");`,
    );
  }

  return result.join("\n");
}
