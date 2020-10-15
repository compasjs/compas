import { js } from "../tag/index.js";
import { getQueryEnabledObjects } from "./utils.js";
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
  }

  const file = js`
    import { query } from "./query-helper${context.importExtension}";

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

export function getFieldsPartial(context, type) {
  return js`
    /**
     * Get all fields for ${type.name}
     * @param {string} [tableName="${type.shortName}"]
     * @returns {QueryPart}
     */
    export function ${type.name}Fields(tableName = "${type.shortName}") {
      const strings = [ \`${Object.keys(type.keys)
        .map((it) => `$\{tableName}."${it}"`)
        .join(", ")}\` ];

      return query(strings);
    }
  `;
}
