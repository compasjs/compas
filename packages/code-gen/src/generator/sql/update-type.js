// @ts-nocheck

import { isNil } from "@compas/stdlib";
import {
  AnyOfType,
  AnyType,
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
  StringType,
} from "../../builders/index.js";
import { ReferenceType } from "../../builders/ReferenceType.js";
import { addToData } from "../../generate.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";

export const atomicUpdateFieldsTable = {
  boolean: ["$negate"],
  number: ["$add", "$subtract", "$multiply", "$divide"],
  string: ["$append"],
  date: ["$add", "$subtract"],
  jsonb: ["$set", "$remove"],
};

/**
 * Creates an update type and assigns in to the object type for all query enabled objects.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createUpdateTypes(context) {
  for (const type of getQueryEnabledObjects(context)) {
    const updateType = new ObjectType(type.group, `${type.name}Update`).build();
    updateType.uniqueName = `${upperCaseFirst(type.group)}${upperCaseFirst(
      type.name,
    )}Update`;

    const updatePartialType = new ObjectType(
      type.group,
      `${type.name}UpdatePartial`,
    ).build();
    updatePartialType.uniqueName = `${upperCaseFirst(
      type.group,
    )}${upperCaseFirst(type.name)}UpdatePartial`;

    for (const key of Object.keys(type.keys)) {
      let fieldType = type.keys[key];
      if (fieldType.reference) {
        fieldType = fieldType.reference;
      }

      if (fieldType.sql?.primary || type.keys[key].sql?.primary) {
        continue;
      }

      updatePartialType.keys[key] = {
        ...new AnyOfType().values(true).optional().build(),
        values: [
          {
            ...fieldType,
            isOptional: true,
            validator: {
              ...(fieldType?.validator ?? {}),
              allowNull:
                fieldType.isOptional &&
                isNil(fieldType.defaultValue) &&
                isNil(type.keys[key].defaultValue),
            },
          },
        ],
      };

      if (fieldType.type === "number") {
        for (const atomicKey of atomicUpdateFieldsTable.number) {
          const atomicType = new ObjectType()
            .keys({
              [atomicKey]: fieldType.validator.floatingPoint
                ? new NumberType().float()
                : new NumberType(),
            })
            .build();

          updatePartialType.keys[key].values.push(atomicType);
        }
      } else if (fieldType.type === "date" || fieldType.type === "string") {
        for (const atomicKey of atomicUpdateFieldsTable[fieldType.type]) {
          const atomicType = new ObjectType()
            .keys({
              [atomicKey]: new StringType(),
            })
            .build();

          updatePartialType.keys[key].values.push(atomicType);
        }
      } else if (fieldType.type === "boolean") {
        for (const atomicKey of atomicUpdateFieldsTable.boolean) {
          const atomicType = new ObjectType()
            .keys({
              [atomicKey]: new BooleanType(),
            })
            .build();

          updatePartialType.keys[key].values.push(atomicType);
        }
      } else if (
        ["any", "anyOf", "array", "generic", "object"].includes(fieldType.type)
      ) {
        const pathType = new AnyType()
          .validator(
            "((value) => Array.isArray(value) && !!value.find(it => typeof it !== 'string' && typeof it !== 'number'))",
          )
          .raw(`(string|number)[]`);

        updatePartialType.keys[key].values.push(
          new ObjectType()
            .keys({
              $set: new ObjectType().keys({
                path: pathType,
                value: new AnyType(),
              }),
            })
            .build(),
          new ObjectType()
            .keys({
              $remove: new ObjectType().keys({
                path: pathType,
              }),
            })
            .build(),
        );
      }
    }

    addToData(context.structure, updatePartialType);

    updateType.keys.update = new ReferenceType(
      type.group,
      `${type.name}UpdatePartial`,
    ).build();
    updateType.keys.update.reference =
      context.structure[type.group][`${type.name}UpdatePartial`];

    updateType.keys.where = new ReferenceType(
      type.group,
      `${type.name}Where`,
    ).build();
    updateType.keys.where.reference =
      context.structure[type.group][`${type.name}Where`];

    updateType.keys.returning = new AnyOfType()
      .values(
        new StringType().oneOf("*"),
        new ArrayType().values(
          new StringType().oneOf(...Object.keys(type.keys)),
        ),
      )
      .optional()
      .build();

    addToData(context.structure, updateType);
    type.partial = type.partial ?? {};
    type.partial.updateType = getTypeNameForType(context, updateType, "", {
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
