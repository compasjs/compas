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
import { getQueryEnabledObjects } from "./utils.js";

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
    if (type.queryOptions.isView) {
      continue;
    }

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

    const updateFnType = new AnyType(type.group, `${type.name}UpdateFn`)
      .raw(
        `<I extends ${type.uniqueName}Update>(
    sql: import("@compas/store").Postgres,
    input: I,
  ) => Promise<
    import("@compas/store").Returning<${type.uniqueName}, I["returning"]>
  >`,
      )
      .build();
    updateFnType.uniqueName = `${type.uniqueName}UpdateFn`;
    addToData(context.structure, updateFnType);
  }
}

/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
export function getUpdateQuery(context, imports, type) {
  let entityUpdateSpec = `export const ${type.name}UpdateSpec = {
   "schemaName": \`${type.queryOptions.schema}\`,
   "name": "${type.name}",
   "shortName": "${type.shortName}",
   "columns": [${Object.keys(type.keys)
     .map((it) => `"${it}"`)
     .join(", ")}],
   "where": ${type.name}WhereSpec,
   "injectUpdatedAt": ${
     type.queryOptions?.withDates || type.queryOptions?.withSoftDeletes
   },
    "fields": {`;

  for (const key of Object.keys(type.keys)) {
    let fieldType = type.keys[key];
    if (fieldType.reference) {
      fieldType = fieldType.reference;
    }

    const subType = ["number", "boolean", "string", "date", "uuid"].includes(
      fieldType.type,
    )
      ? fieldType.type
      : "jsonb";

    entityUpdateSpec += `"${key}": { "type": "${subType}", "atomicUpdates": [${(
      atomicUpdateFieldsTable[subType] ?? []
    )
      .map((it) => `"${it}"`)
      .join(", ")}], },`;
  }

  entityUpdateSpec += " }};";

  imports.destructureImport(
    `validate${type.uniqueName}Update`,
    `../${type.group}/validators.js`,
  );

  return js`
    /** @type {any} */
    ${entityUpdateSpec}

    /**
     * (Atomic) update queries for ${type.name}
     * 
     * @type {${type.uniqueName}UpdateFn}
     */
    const ${type.name}Update = async (sql, input) => {
      const updateValidated = validate${type.uniqueName}Update(
        input, "$.${type.uniqueName}Update");
      if (updateValidated.error) {
        throw updateValidated.error;
      }

      const result = await generatedUpdateHelper(${
        type.name
      }UpdateSpec, input).exec(
        sql);
      if (!isNil(input.returning)) {
        transform${upperCaseFirst(type.name)}(result);
        
        // @ts-ignore
        return result;
      }

      // @ts-ignore
       return undefined;
    }
  `;
}
