import { js } from "../tag/index.js";
import { getInsertPartial, getUpdatePartial } from "./partial-type.js";
import { getPrimaryKeyWithType, getSortedKeysForType } from "./utils.js";
import { getWherePartial } from "./where-type.js";

/**
 * Generate all useful query partials
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 */
export function generateQueryPartials(context, imports, type, src) {
  imports.destructureImport("AppError", "@compas/stdlib");
  imports.destructureImport("isStaging", "@compas/stdlib");
  imports.destructureImport("query", "@compas/store");
  imports.destructureImport("isQueryPart", "@compas/store");

  if (!type.queryOptions.isView) {
    src.push(getFieldSet(context, type));
  }

  src.push(getFieldsPartial(context, type));
  src.push(getOrderPartial(context, type));

  imports.destructureImport(
    `validate${type.uniqueName}Where`,
    `../validators${context.importExtension}`,
  );
  src.push(getWherePartial(context, type));

  if (!type.queryOptions.isView) {
    src.push(getInsertPartial(context, type));
    src.push(getUpdatePartial(context, type));
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
 * @param {CodeGenContext} context
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
 * @property {CodeGenContext} context
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
     * @param {{ excludePrimaryKey: boolean }} [options={}]
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

/**
 * A default ordering partial
 * Working correctly, with or without dates
 *
 * @property {CodeGenContext} context
 * @property {CodeGenObjectType} type
 * @returns {string}
 */
export function getOrderPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);
  if (type.queryOptions.withSoftDeletes || type.queryOptions.withDates) {
    return js`
      /**
       * Get 'ORDER BY ' for ${type.name}
       * 
       * @param {string} [tableName="${type.shortName}."]
       * @returns {QueryPart}
       */
      export function ${type.name}OrderBy(tableName = "${type.shortName}.") {
        if (tableName.length > 0 && !tableName.endsWith(".")) {
          tableName = \`$\{tableName}.\`;
        }

        const strings = [ \`$\{tableName}"createdAt", $\{tableName}"updatedAt", $\{tableName}"${primaryKey}" \` ];

        return query(strings);
      }
    `;
  }

  return js`
    /**
     * Get 'ORDER BY ' for ${type.name}
     * 
     * @param {string} [tableName="${type.shortName}."]
     * @returns {QueryPart}
     */
    export function ${type.name}OrderBy(tableName = "${type.shortName}.") {
      if (tableName.length > 0 && !tableName.endsWith(".")) {
        tableName = \`$\{tableName}.\`;
      }

      const strings = [ \`$\{tableName}"id" \` ];

      return query(strings);
    }
  `;
}
