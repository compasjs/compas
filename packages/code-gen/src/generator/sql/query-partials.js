import { js } from "../tag/index.js";
import { getInsertPartial, getUpdatePartial } from "./partial-type.js";
import {
  getPrimaryKeyWithType,
  getQueryEnabledObjects,
  getSortedKeysForType,
} from "./utils.js";
import { getWhereFieldSet, getWherePartial } from "./where-type.js";

/**
 * Generate all usefull query partials
 *
 * @param {CodeGenContext} context
 */
export function generateQueryPartials(context) {
  const partials = [];

  // Generate field sets and the check function
  partials.push(knownFieldsCheckFunction());
  for (const type of getQueryEnabledObjects(context)) {
    partials.push(getWhereFieldSet(context, type));
    if (!type.queryOptions.isView) {
      partials.push(getFieldSet(context, type));
    }
  }

  // Generate the query partials
  for (const type of getQueryEnabledObjects(context)) {
    partials.push(getFieldsPartial(context, type));
    partials.push(getWherePartial(context, type));
    partials.push(getOrderPartial(context, type));
    if (!type.queryOptions.isView) {
      partials.push(getInsertPartial(context, type));
      partials.push(getUpdatePartial(context, type));
    }
  }

  const file = js`
    import { AppError, isStaging } from "@lbu/stdlib";
    import { query, isQueryObject } from "@lbu/store";

    ${partials}
  `;

  context.outputFiles.push({
    contents: file,
    relativePath: `./query-partials${context.extension}`,
  });
  context.rootExports.push(
    `export * from "./query-partials${context.importExtension}";`,
  );
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
              unknownKey: key, knownKeys: [ ...set ],
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
 * @property {CodeGenContext} context
 * @property {CodeGenObjectType} type
 * @return {string}
 */
export function getFieldsPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);
  return js`
    /**
     * Get all fields for ${type.name}
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
 * @return {string}
 */
export function getOrderPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);
  if (type.queryOptions.withSoftDeletes || type.queryOptions.withDates) {
    return js`
      /**
       * Get 'ORDER BY ' for ${type.name}
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
