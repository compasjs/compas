import { js } from "../tag/index.js";
import { getInsertPartial, getUpdatePartial } from "./partial-type.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";
import { getWherePartial } from "./where-type.js";

/**
 * Generate all usefull query partials
 *
 * @param {CodeGenContext} context
 */
export function generateQueryPartials(context) {
  const partials = [];

  for (const type of getQueryEnabledObjects(context)) {
    partials.push(getFieldsPartial(context, type));
    partials.push(getWherePartial(context, type));
    partials.push(getOrderPartial(context, type));
    partials.push(getInsertPartial(context, type));
    partials.push(getUpdatePartial(context, type));
  }

  const file = js`
    import { query } from "@lbu/store";

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
                       \`${Object.keys(type.keys)
                         .filter((it) => it !== primaryKey)
                         .map((it) => `$\{tableName}"${it}"`)
                         .join(", ")}\`
                     ]);
      }

      return query([
                     \`${Object.keys(type.keys)
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
