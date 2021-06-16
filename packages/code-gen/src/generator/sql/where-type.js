import { isNil } from "@compas/stdlib";
import { AnyOfType } from "../../builders/AnyOfType.js";
import { AnyType } from "../../builders/AnyType.js";
import { ArrayType } from "../../builders/ArrayType.js";
import { BooleanType } from "../../builders/BooleanType.js";
import { ObjectType } from "../../builders/ObjectType.js";
import { ReferenceType } from "../../builders/ReferenceType.js";
import { addToData } from "../../generate.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import {
  getPrimaryKeyWithType,
  getQueryEnabledObjects,
  getSortedKeysForType,
} from "./utils.js";

const whereTypeTable = {
  number: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  date: ["equal", "notEqual", "in", "notIn", "greaterThan", "lowerThan"],
  uuid: ["equal", "notEqual", "in", "notIn", "like", "notLike"],
  string: ["equal", "notEqual", "in", "notIn", "like", "iLike", "notLike"],
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

    whereType.keys["$raw"] = {
      ...new AnyType().optional().build(),
      rawValue: "QueryPart",
      rawValueImport: {
        javaScript: undefined,
        typeScript: `import { QueryPart } from "@compas/store";`,
      },
      rawValidator: "isQueryPart",
      rawValidatorImport: {
        javaScript: `import { isQueryPart } from "@compas/store";`,
        typeScript: `import { isQueryPart } from "@compas/store";`,
      },
    };
    whereType.keys["$or"] = {
      ...new ArrayType().values(true).optional().build(),
      values: new ReferenceType(type.group, `${type.name}Where`).build(),
    };

    whereType.keys["$or"].values.reference = whereType;

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
                  typeScript: `import { QueryPart } from "@compas/store";`,
                },
                rawValidator: "isQueryPart",
                rawValidatorImport: {
                  javaScript: `import { isQueryPart } from "@compas/store";`,
                  typeScript: `import { isQueryPart } from "@compas/store";`,
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

        if (fieldType.sql?.primary && fieldType.type === "number") {
          // Get's a JS string to support 'bigserial', but just safely convert it to a
          // number.
          whereType.keys[name].validator.convert = true;
        }
      }
    }

    addToData(context.structure, whereType);

    type.where = {
      type: whereType,
      fields: fieldsArray,
    };
  }

  // Add where, based on relations
  for (const type of getQueryEnabledObjects(context)) {
    for (const relation of type.relations) {
      if (
        relation.subType === "oneToMany" ||
        relation.subType === "oneToOneReverse"
      ) {
        const otherSide = relation.reference.reference;

        // Support other side of the relation exists, which is the same as
        // `owningSideOfTheRelation`.isNotNull.
        type.where.type.keys[`${relation.ownKey}Exists`] = {
          ...new ReferenceType(otherSide.group, `${otherSide.name}Where`)
            .optional()
            .build(),
          reference:
            context.structure[otherSide.group][`${otherSide.name}Where`],
        };

        type.where.type.keys[`${relation.ownKey}NotExists`] = {
          ...new ReferenceType(otherSide.group, `${otherSide.name}Where`)
            .optional()
            .build(),
          reference:
            context.structure[otherSide.group][`${otherSide.name}Where`],
        };

        type.where.fields.push(
          {
            key: relation.ownKey,
            name: `${relation.ownKey}Exists`,
            variant: "exists",
            isRelation: true,
          },
          {
            key: relation.ownKey,
            name: `${relation.ownKey}NotExists`,
            variant: "notExists",
            isRelation: true,
          },
        );
      }
    }
  }

  // Add types to the system
  for (const type of getQueryEnabledObjects(context)) {
    type.where.type = getTypeNameForType(context, type.where.type, "", {
      useDefaults: false,
    });
  }
}

/**
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getWherePartial(context, type) {
  const partials = [];

  partials.push(`
    if (!isNil(where.$raw) && isQueryPart(where.$raw)) {
      strings.push(" AND ");
      values.push(where.$raw);
    }
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
    let str = "";

    if (field.isRelation) {
      const relation = type.relations.find((it) => it.ownKey === field.key);
      const primaryKey = getPrimaryKeyWithType(type);

      const exists = field.variant !== "exists" ? "NOT EXISTS" : "EXISTS";
      const shortName =
        relation.reference.reference.name === type.name
          ? `${relation.reference.reference.shortName}2`
          : `${relation.reference.reference.shortName}`;

      str += `
        if (where.${field.name}) {
          strings.push(\` AND ${exists} (SELECT FROM "${relation.reference.reference.name}" ${shortName} WHERE \`, \` AND ${shortName}."${relation.referencedKey}" = $\{tableName}"${primaryKey.key}")\`);
          values.push(${relation.reference.reference.name}Where(where.${field.name}, "${shortName}.", { skipValidator: true }), undefined);
        }
      `;
    } else {
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
            if (isQueryPart(where.${field.name})) {
              strings.push(\` AND $\{tableName}"${field.key}" = ANY(\`, ")");
              values.push(where.${field.name}, undefined);
            } else if (Array.isArray(where.${field.name})) {
              strings.push(\` AND $\{tableName}"${field.key}" = ANY(ARRAY[\`);
              for (let i = 0; i < where.${field.name}.length; ++i) {
                values.push(where.${field.name}[i]);
                if (i !== where.${field.name}.length - 1) {
                  strings.push(", ");
                }
              }
              strings.push("]::${fieldType}[])");
              if (where.${field.name}.length === 0) {
                values.push(undefined);
              }
              values.push(undefined);
            }
          `;
            break;
          case "notIn":
            str += `
            if (isQueryPart(where.${field.name})) {
              strings.push(\` AND $\{tableName}"${field.key}" != ANY(\`, ")");
              values.push(where.${field.name}, undefined);
            } else if (Array.isArray(where.${field.name})) {
              strings.push(\` AND NOT ($\{tableName}"${field.key}" = ANY(ARRAY[\`);
              for (let i = 0; i < where.${field.name}.length; ++i) {
                values.push(where.${field.name}[i]);
                if (i !== where.${field.name}.length - 1) {
                  strings.push(", ");
                }
              }
              strings.push("]::${fieldType}[]))");
              if (where.${field.name}.length === 0) {
                values.push(undefined);
              }
              values.push(undefined);
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
          case "iLike":
            str += `
            strings.push(\` AND $\{tableName}"${field.key}" ILIKE \`);
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
    }

    partials.push(str);
  }

  return js`
      /**
       * Build 'WHERE ' part for ${type.name}
       *
       * @param {${type.where.type}} [where={}]
       * @param {string} [tableName="${type.shortName}."]
       * @param {{ skipValidator?: boolean|undefined }} [options={}]
       * @returns {QueryPart}
       */
      export function ${type.name}Where(where = {},
                                        tableName = "${type.shortName}.",
                                        options = {}
      ) {
         if (tableName.length > 0 && !tableName.endsWith(".")) {
            tableName = \`$\{tableName}.\`;
         }

         if (!options.skipValidator) {
            where = validate${type.uniqueName}Where(where, "$.${type.name}Where");
         }

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
 *
 * @param {CodeGenObjectType} type
 * @returns {Object<string, CodeGenType>}
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
