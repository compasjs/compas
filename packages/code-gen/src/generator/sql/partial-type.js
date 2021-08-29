// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { ObjectType } from "../../builders/ObjectType.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import {
  getPrimaryKeyWithType,
  getQueryEnabledObjects,
  getSortedKeysForType,
} from "./utils.js";

/**
 * Creates the partial types for inserts and updates and assigns in to the object type
 *
 * @param {CodeGenContext} context
 */
export function createPartialTypes(context) {
  for (const type of getQueryEnabledObjects(context)) {
    if (type.queryOptions?.isView) {
      continue;
    }

    const fieldsArray = [];

    const insertPartial = new ObjectType(
      type.group,
      `${type.name}InsertPartial`,
    ).build();
    insertPartial.uniqueName = `${upperCaseFirst(
      insertPartial.group,
    )}${upperCaseFirst(insertPartial.name)}`;

    const updatePartial = new ObjectType(
      type.group,
      `${type.name}UpdatePartial`,
    ).build();
    updatePartial.uniqueName = `${upperCaseFirst(
      updatePartial.group,
    )}${upperCaseFirst(updatePartial.name)}`;

    for (const key of getSortedKeysForType(type)) {
      let fieldType = type.keys[key];
      if (fieldType.reference) {
        fieldType = fieldType.reference;
      }

      if (fieldType?.sql?.primary) {
        // Primary keys have some special handling in insertValues, but are completely skipped in updateSet.
        // However, it is handled inline and thus not put in to the fieldsArray
        insertPartial.keys[key] = {
          ...fieldType,
          isOptional: true,
        };
        continue;
      }

      // Default value is the edge case here.
      // We also support setting a default value for the reference, so fields can be
      // reused but only have a default value on the reference.
      fieldsArray.push({
        key,
        isJsonb:
          ["number", "boolean", "string", "date", "uuid"].indexOf(
            fieldType.type,
          ) === -1,
        defaultValue: fieldType.defaultValue ?? type.keys[key].defaultValue,
      });

      insertPartial.keys[key] = {
        ...fieldType,
      };

      updatePartial.keys[key] = {
        ...fieldType,
        isOptional: true,
      };

      // Create correct types by setting allowNull, since the value will be used in the update statement
      if (fieldType.isOptional && isNil(fieldType.defaultValue)) {
        updatePartial.keys[key].validator = Object.assign(
          {},
          updatePartial.keys[key].validator,
          { allowNull: true },
        );
      }
    }

    type.partial = {
      insertType: getTypeNameForType(context, insertPartial, "", {
        useDefaults: false,
      }),
      updateType: getTypeNameForType(context, updatePartial, "", {
        useDefaults: false,
      }),
      fields: fieldsArray,
    };
  }
}

/**
 * Adds builder to reuse inserts
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getInsertPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);

  return js`
    /**
     * Build 'VALUES ' part for ${type.name}
     * 
     * @param {${type.partial.insertType}|${type.partial.insertType}[]} insert
     * @param {{ includePrimaryKey?: boolean }} [options={}]
     * @returns {QueryPart}
     */
    export function ${type.name}InsertValues(insert, options = {}) {
      if (!Array.isArray(insert)) {
        insert = [ insert ];
      }

      const q = query\`\`;

      for (let i = 0; i < insert.length; ++i) {
        const it = insert[i];
        checkFieldsInSet("${type.name}", "insert", ${type.name}FieldSet, it);

        q.append(query\`(
          $\{options?.includePrimaryKey ? query\`$\{it.${primaryKey}}, \` : undefined}
          $\{${type.partial.fields
            .map((it) => {
              if (it.isJsonb) {
                return `JSON.stringify(it.${it.key} ?? ${
                  it.defaultValue ?? "null"
                })`;
              }
              return `it.${it.key} ?? ${it.defaultValue ?? "null"}`;
            })
            .join("}, ${")}}
        )\`);

        if (i !== insert.length - 1) {
          q.append(query\`, \`);
        }
      }


      return q;
    }
  `;
}

/**
 * Adds builder to reuse updates
 *
 * @param {CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getUpdatePartial(context, type) {
  const partials = [];

  for (const field of type.partial.fields) {
    if (type.queryOptions?.withDates || type.queryOptions?.withSoftDeletes) {
      if (field.key === "updatedAt") {
        partials.push(`
          strings.push(\`, "${field.key}" = \`);
          values.push(new Date());
        `);
        continue;
      }
    }

    partials.push(js`
      if (update.${field.key} !== undefined) {
        strings.push(\`, "${field.key}" = \`);
        ${() => {
          if (field.isJsonb) {
            return `values.push(JSON.stringify(update.${field.key} ?? ${
              field.defaultValue ?? "null"
            }));`;
          }
          return `values.push(update.${field.key} ?? ${
            field.defaultValue ?? "null"
          });`;
        }}
      }
    `);
  }

  return js`
    /**
     * Build 'SET ' part for ${type.name}
     *
     * @param {${type.partial.updateType}} update
     * @returns {QueryPart}
     */
    export function ${type.name}UpdateSet(update) {
      const strings = [];
      const values = [];

      checkFieldsInSet("${type.name}", "update", ${type.name}FieldSet, update);

      ${partials}
      // Remove the comma suffix
      strings[0] = strings[0].substring(2);
      strings.push("");

      return query(strings, ...values);
    }
  `;
}
