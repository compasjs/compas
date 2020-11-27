import { isNil } from "@lbu/stdlib";
import { AnyOfType } from "../../builders/AnyOfType.js";
import { AnyType } from "../../builders/AnyType.js";
import { ArrayType } from "../../builders/ArrayType.js";
import { BooleanType } from "../../builders/BooleanType.js";
import { ObjectType } from "../../builders/ObjectType.js";
import { ReferenceType } from "../../builders/ReferenceType.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import { getQueryEnabledObjects, getSortedKeysForType } from "./utils.js";

const whereTypeTable = {
  number: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  date: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  uuid: ["equal", "notEqual", "in", "notIn", "like", "notLike"],
  string: ["equal", "notEqual", "in", "notIn", "like", "notLike"],
  boolean: ["equal"],
};

/**
 * Creates a where type and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createWhereTypes(context) {
  const defaults = {
    name: undefined,
    group: undefined,
    uniqueName: undefined,
    isOptional: true,
    defaultValue: undefined,
  };

  for (const type of getQueryEnabledObjects(context)) {
    const fields = getSearchableFields(type);

    const fieldsArray = [];
    const whereType = new ObjectType(type.group, `${type.name}Where`).build();
    whereType.uniqueName = `${upperCaseFirst(whereType.group)}${upperCaseFirst(
      whereType.name,
    )}`;

    // new ReferenceType(type.group, `${type.name}Where`)
    whereType.keys["$or"] = {
      ...new ArrayType().values(true).optional().build(),
      values: new ReferenceType(type.group, `${type.name}Where`).build(),
    };

    for (const key of Object.keys(fields)) {
      const fieldType = fields[key];
      if (isNil(whereTypeTable[fieldType.type])) {
        continue;
      }

      const whereVariants = [...whereTypeTable[fieldType.type]];
      if (type.queryOptions.withSoftDeletes && key === "deletedAt") {
        // Special case for deletedAt.
        // We want to be safe by default and thus not return any soft deleted rows,
        // without explicit consent
        whereVariants.push("includeNotNull");
      } else if (fieldType.isOptional) {
        whereVariants.push("isNull", "isNotNull");
      }

      for (const variant of whereVariants) {
        const name =
          variant === "equal" ? key : `${key}${upperCaseFirst(variant)}`;
        fieldsArray.push({
          key,
          name,
          variant,
        });

        if (["in", "notIn"].indexOf(variant) !== -1) {
          // Accept an array, instead of the plain type
          // Uses 'true' as a temporary placeholder to get the correct structure
          whereType.keys[name] = {
            ...new AnyOfType().values(true).optional().build(),
            values: [
              {
                ...new ArrayType().values(true).optional().build(),
                values: { ...fieldType, ...defaults, isOptional: false },
              },
              {
                ...new AnyType().optional().build(),
                rawValue: "QueryPart",
                rawValueImport: {
                  javaScript: undefined,
                  typeScript: `import { QueryPart } from "@lbu/store";`,
                },
                rawValidator: "isQueryObject",
                rawValidatorImport: {
                  javaScript: `import { isQueryObject } from "@lbu/store";`,
                  typeScript: `import { isQueryObject } from "@lbu/store";`,
                },
              },
            ],
          };
        } else if (
          ["isNull", "isNotNull", "includeNotNull"].indexOf(variant) !== -1
        ) {
          // Accept a boolean instead of the plain type
          whereType.keys[name] = new BooleanType().optional().build();
        } else {
          whereType.keys[name] = { ...fieldType, ...defaults };
        }
      }
    }

    type.where = {
      type: getTypeNameForType(context, whereType, "", {
        useDefaults: false,
      }),
      fields: fieldsArray,
    };
  }
}

/**
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getWhereFieldSet(context, type) {
  return `const ${
    type.name
  }WhereFieldSet = new Set(["$or", "${type.where.fields
    .map((it) => it.name)
    .join(`", "`)}"]);`;
}

/**
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getWherePartial(context, type) {
  const partials = [];

  partials.push(`
    if (Array.isArray(where.$or) && where.$or.length > 0) {
      strings.push(" AND ((");
      for (let i = 0; i < where.$or.length; i++) {
        values.push(${type.name}Where(where.$or[i], tableName));
        
        if (i === where.$or.length - 1) {
          strings.push("))");
          values.push(undefined);
        } else {
          strings.push(") OR (");
        }
      }
    }
  `);

  for (const field of type.where.fields) {
    const realField = type.keys[field.key].reference ?? type.keys[field.key];
    // Type to cast arrays to, use for in & notIn
    const fieldType =
      realField.type === "number" && !realField.floatingPoint
        ? "int"
        : realField.type === "number" && realField.floatingPoint
        ? "float"
        : realField.type === "string"
        ? "varchar"
        : realField.type === "date"
        ? "timestamptz"
        : "uuid";

    let str = "";
    if (field.variant === "includeNotNull") {
      str += `
        if ((where.${field.name} ?? false) === false) {
          strings.push(\` AND ($\{tableName}"${field.key}" IS NULL OR $\{tableName}"${field.key}" > now()) \`);
          values.push(undefined);
        }
      `;
    } else {
      str += `if (where.${field.name} !== undefined) {\n`;

      switch (field.variant) {
        case "equal":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" = \`);
            values.push(where.${field.name});
          `;
          break;
        case "notEqual":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" != \`);
            values.push(where.${field.name});
          `;
          break;
        case "in":
          str += `
            if (isQueryObject(where.${field.name})) {
              strings.push(\` AND $\{tableName}"${field.key}" = ANY(\`, ")");
              values.push(where.${field.name}, undefined);
            } else if (Array.isArray(where.${field.name}) && where.${field.name}.length > 0) {
              strings.push(\` AND $\{tableName}"${field.key}" = ANY(ARRAY[\`);
              for (let i = 0; i < where.${field.name}.length; ++i) {
                values.push(where.${field.name}[i]);
                if (i === where.${field.name}.length - 1) {
                  strings.push("]::${fieldType}[])");
                  values.push(undefined);
                } else {
                  strings.push(", ");
                }
              }
            }
          `;
          break;
        case "notIn":
          str += `
            if (isQueryObject(where.${field.name})) {
              strings.push(\` AND $\{tableName}"${field.key}" != ANY(\`, ")");
              values.push(where.${field.name}, undefined);
            } else if (Array.isArray(where.${field.name}) && where.${field.name}.length > 0) {
              strings.push(\` AND $\{tableName}"${field.key}" != ANY(ARRAY[\`);
              for (let i = 0; i < where.${field.name}.length; ++i) {
                values.push(where.${field.name}[i]);
                if (i === where.${field.name}.length - 1) {
                  strings.push("]::${fieldType}[])");
                  values.push(undefined);
                } else {
                  strings.push(", ");
                }
              }
            }
          `;
          break;
        case "greaterThan":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" > \`);
            values.push(where.${field.name});
          `;
          break;
        case "lowerThan":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" < \`);
            values.push(where.${field.name});
          `;
          break;
        case "isNull":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" IS NULL \`);
            values.push(undefined);
          `;
          break;
        case "isNotNull":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" IS NOT NULL \`);
            values.push(undefined);
          `;
          break;
        case "like":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" LIKE \`);
            values.push(\`%$\{where.${field.name}}%\`);
          `;
          break;
        case "notLike":
          str += `
            strings.push(\` AND $\{tableName}"${field.key}" NOT LIKE \`);
            values.push(\`%$\{where.${field.name}}%\`);
          `;
          break;
      }
      str += "}";
    }

    partials.push(str);
  }

  return js`
    /**
     * Build 'WHERE ' part for ${type.name}
     * @param {${type.where.type}} [where={}]
     * @param {string} [tableName="${type.shortName}."]
     * @returns {QueryPart}
     */
    export function ${type.name}Where(where = {}, tableName = "${type.shortName}.") {
      if (tableName.length > 0 && !tableName.endsWith(".")) {
        tableName = \`$\{tableName}.\`;
      }

      checkFieldsInSet("${type.name}", "where", ${type.name}WhereFieldSet, where);

      const strings = [ "1 = 1" ];
      const values = [ undefined ];

      ${partials}
      strings.push("");

      return query(strings, ...values);
    }
  `;
}

/**
 * Returns an object with only the searchable fields
 * @param {CodeGenObjectType} type
 * @return {Object<string, CodeGenType>}
 */
export function getSearchableFields(type) {
  return getSortedKeysForType(type)
    .map((it) => [it, type.keys[it]])
    .filter((it) => it[1].sql?.searchable || it[1].reference?.sql?.searchable)
    .reduce((acc, [key, value]) => {
      acc[key] = value.reference ?? value;
      return acc;
    }, {});
}
