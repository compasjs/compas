// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { AnyType } from "../../builders/AnyType.js";
import {
  AnyOfType,
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
} from "../../builders/index.js";
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
  uuid: ["equal", "notEqual", "in", "notIn"],
  string: ["equal", "notEqual", "in", "notIn", "like", "iLike", "notLike"],
  boolean: ["equal"],
};

/**
 * Creates a where type and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
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
      rawValue: "QueryPart<any>",
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
                rawValue: "QueryPart<any>",
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
      type: "",
      rawType: whereType,
      fields: fieldsArray,
    };
  }

  // Add where, based on relations
  for (const type of getQueryEnabledObjects(context)) {
    for (const relation of type.relations) {
      const otherSide = relation.reference.reference;

      // Add via support via the where builder.
      type.where.rawType.keys[`via${upperCaseFirst(relation.ownKey)}`] =
        new ObjectType()
          .keys({
            where: new ReferenceType(
              otherSide.group,
              `${otherSide.name}Where`,
            ).optional(),
            limit: new NumberType().optional(),
            offset: new NumberType().optional(),
          })
          .optional()
          .build();

      type.where.rawType.keys[
        `via${upperCaseFirst(relation.ownKey)}`
      ].keys.where.reference =
        context.structure[otherSide.group][`${otherSide.name}Where`];

      type.where.fields.push({
        key: relation.ownKey,
        name: `via${upperCaseFirst(relation.ownKey)}`,
        variant: "via",
        isRelation: true,
      });

      if (
        relation.subType === "oneToMany" ||
        relation.subType === "oneToOneReverse"
      ) {
        type.where.rawType.keys[`${relation.ownKey}NotExists`] = {
          ...new ReferenceType(otherSide.group, `${otherSide.name}Where`)
            .optional()
            .build(),
          reference:
            context.structure[otherSide.group][`${otherSide.name}Where`],
        };

        type.where.fields.push({
          key: relation.ownKey,
          name: `${relation.ownKey}NotExists`,
          variant: "notExists",
          isRelation: true,
        });
      }
    }
  }

  // Add types to the system
  for (const type of getQueryEnabledObjects(context)) {
    type.where.type = getTypeNameForType(context, type.where.rawType, "", {
      useDefaults: false,
    });
  }
}

/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
export function getWherePartial(context, imports, type) {
  let entityWhereString = `export const ${type.name}WhereSpec ={ "fieldSpecification": [`;

  const fieldsByKey = {};
  for (const field of type.where.fields) {
    if (isNil(fieldsByKey[field.key])) {
      fieldsByKey[field.key] = [];
    }

    fieldsByKey[field.key].push(field);
  }

  for (const key of Object.keys(fieldsByKey)) {
    let matchers = `[`;
    let keyType = undefined;

    for (const field of fieldsByKey[key]) {
      if (isNil(keyType) && !field.isRelation) {
        const realField =
          type.keys[field.key].reference ?? type.keys[field.key];
        // Type to cast arrays to, use for in & notIn
        keyType =
          realField.type === "number" && !realField.floatingPoint
            ? "int"
            : realField.type === "number" && realField.floatingPoint
            ? "float"
            : realField.type === "string"
            ? "varchar"
            : realField.type === "date"
            ? "timestamptz"
            : "uuid";
      }

      matchers += `{ matcherKey: "${field.name}", matcherType: "${field.variant}", `;

      if (field.isRelation) {
        const relation = type.relations.find((it) => it.ownKey === field.key);
        const otherSide = relation.reference.reference;
        const isSelfReference = otherSide.name === type.name;

        const shortName = isSelfReference
          ? `${otherSide.shortName}2`
          : `${otherSide.shortName}`;

        if (!isSelfReference) {
          imports.destructureImport(
            `${otherSide.name}WhereSpec`,
            `./${otherSide.name}.js`,
          );
        }

        const { key: primaryKey } = getPrimaryKeyWithType(type);

        const referencedKey =
          ["oneToMany", "oneToOneReverse"].indexOf(relation.subType) !== -1
            ? relation.referencedKey
            : getPrimaryKeyWithType(otherSide).key;

        const ownKey =
          ["manyToOne", "oneToOne"].indexOf(relation.subType) !== -1
            ? relation.ownKey
            : primaryKey;

        matchers += `relation: {
           entityName: "${otherSide.name}",
           shortName: "${shortName}",
           entityKey: "${referencedKey}",
           referencedKey: "${ownKey}",
           where: () => ${otherSide.name}WhereSpec,
         },`;
      }

      matchers += "},";
    }

    matchers += "]";
    entityWhereString += `{ tableKey: "${key}", keyType: "${keyType}", matchers: ${matchers} },`;
  }

  entityWhereString += " ]};";

  return js`
    /** @type {any} */
    ${entityWhereString}

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
        const whereValidated = validate${type.uniqueName}Where(
          where, "$.${type.name}Where");
        if (whereValidated.error) {
          throw whereValidated.error;
        }
        where = whereValidated.value;
      }

      return generatedWhereBuilderHelper(${type.name}WhereSpec, where, tableName)
    }
  `;
}

/**
 * Returns an object with only the searchable fields
 *
 * @param {CodeGenObjectType} type
 * @returns {Record<string, CodeGenType>}
 */
export function getSearchableFields(type) {
  return /** @type {Record<string, CodeGenType>} */ getSortedKeysForType(type)
    .map((it) => [it, type.keys[it]])
    .filter((it) => it[1].sql?.searchable || it[1].reference?.sql?.searchable)
    .reduce((acc, [key, value]) => {
      // @ts-ignore
      acc[key] = value.reference ?? value;
      return acc;
    }, {});
}
