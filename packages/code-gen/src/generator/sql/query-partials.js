// @ts-nocheck

import { js } from "../tag/index.js";
import { getOrderByPartial } from "./order-by-type.js";
import { getInsertPartial } from "./partial-type.js";
import { getPrimaryKeyWithType, getSortedKeysForType } from "./utils.js";
import { getWherePartial } from "./where-type.js";

/**
 * Generate all useful query partials
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryPartials(context, imports, type, src) {
  imports.destructureImport("AppError", "@compas/stdlib");
  imports.destructureImport("isStaging", "@compas/stdlib");
  imports.destructureImport("query", "@compas/store");
  imports.destructureImport("isQueryPart", "@compas/store");
  imports.destructureImport("generatedWhereBuilderHelper", "@compas/store");

  if (!type.queryOptions?.isView) {
    src.push(getFieldSet(context, type));
  }

  src.push(getFieldsPartial(context, type));

  imports.destructureImport(
    `validate${type.uniqueName}Where`,
    `../${type.group}/validators${context.importExtension}`,
  );
  imports.destructureImport(
    `validate${type.uniqueName}OrderBy`,
    `../${type.group}/validators${context.importExtension}`,
  );
  imports.destructureImport(
    `validate${type.uniqueName}OrderBySpec`,
    `../${type.group}/validators${context.importExtension}`,
  );

  for (const relation of type.relations) {
    if (relation.reference.reference.name !== type.name) {
      // Add 'where' imports
      imports.destructureImport(
        `${relation.reference.reference.name}Where`,
        `./${relation.reference.reference.name}${context.importExtension}`,
      );
    }
  }

  src.push(getWherePartial(context, imports, type));
  src.push(getOrderByPartial(context, type));

  if (!type.queryOptions?.isView) {
    src.push(getInsertPartial(context, type));
  }

  src.push(knownFieldsCheckFunction());
}

/**
 * Static field in set check function
 *
 * @returns {string}
 */
export function knownFieldsCheckFunction() {
  // We create a copy of the Set & convert to array before throwing, in case someone
  // tries to mutate it. We can also safely skip 'undefined' values, since they will
  // never be used in queries.
  return js`
    /**
     *
     * @param {string} entity
     * @param {string} subType
     * @param {Set} set
     * @param {*} value
     */
    function checkFieldsInSet(entity, subType, set, value) {
      if (isStaging()) {
        for (const key of Object.keys(value)) {
          if (!set.has(key) && value[key] !== undefined) {
            throw new AppError(\`query.$\{entity}.$\{subType}Fields\`, 500, {
              extraKey: key, knownKeys: [ ...set ],
            });
          }
        }
      }
    }
  `;
}

/**
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getFieldSet(context, type) {
  return `const ${type.name}FieldSet = new Set(["${Object.keys(type.keys).join(
    `", "`,
  )}"]);`;
}

/**
 * A list of fields for the provided type, with dynamic tableName
 *
 * @property {import("../../generated/common/types").CodeGenContext} context
 * @property {CodeGenObjectType} type
 * @returns {string}
 */
export function getFieldsPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);
  return js`
    /**
     * Get all fields for ${type.name}
     * 
     * @param {string} [tableName="${type.shortName}."]
     * @param {{ excludePrimaryKey?: boolean }} [options={}]
     * @returns {QueryPart}
     */
    export function ${type.name}Fields(tableName = "${
    type.shortName
  }.", options = {}) {
      if (tableName.length > 0 && !tableName.endsWith(".")) {
        tableName = \`$\{tableName}.\`;
      }

      if (options.excludePrimaryKey) {
        return query([
                       \`${getSortedKeysForType(type)
                         .filter((it) => it !== primaryKey)
                         .map((it) => `$\{tableName}"${it}"`)
                         .join(", ")}\`
                     ]);
      }

      return query([
                     \`${getSortedKeysForType(type)
                       .map((it) => `$\{tableName}"${it}"`)
                       .join(", ")}\`
                   ]);
    }
  `;
}
