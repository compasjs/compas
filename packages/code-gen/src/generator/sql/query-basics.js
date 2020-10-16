import { js } from "../tag/index.js";
import { importCreator } from "../utils.js";
import { getQueryEnabledObjects } from "./utils.js";

/**
 * Generate the basic CRUD queries
 *
 * @param {CodeGenContext} context
 */
export function generateBaseQueries(context) {
  const partials = [];

  const imports = importCreator();
  imports.destructureImport("query", `@lbu/store`);

  for (const type of getQueryEnabledObjects(context)) {
    imports.destructureImport(
      `${type.name}Fields`,
      `./query-partials${context.importExtension}`,
    );
    imports.destructureImport(
      `${type.name}Where`,
      `./query-partials${context.importExtension}`,
    );
    imports.destructureImport(
      `${type.name}OrderBy`,
      `./query-partials${context.importExtension}`,
    );

    partials.push(selectQuery(context, imports, type));
    partials.push(deleteQuery(context, imports, type));
  }

  const contents = js`
    ${imports.print()}

    ${partials}
  `;

  context.rootExports.push(
    `import * as queries from "./query-basics${context.importExtension}";`,
    `export { queries };`,
  );

  context.outputFiles.push({
    contents: contents,
    relativePath: `./query-basics${context.extension}`,
  });
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function selectQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.uniqueName}Where} [where]
     * @returns {Promise<${type.uniqueName}[]>}
     */
    export function ${type.name}Select(sql, where) {
      return query\`
        SELECT $\{${type.name}Fields()}
        FROM "${type.name}" ${type.shortName}
        $\{${type.name}Where(where)}
        $\{${type.name}OrderBy()}
        \`.exec(sql);
    }
  `;
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function deleteQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.uniqueName}Where} [where={}]
     * @returns {Promise<void>}
     */
    export function ${type.name}Delete${
    type.queryOptions.withSoftDeletes ? "Permanent" : ""
  }(sql,
                                                                                where = {}
    ) {
      ${
        type.queryOptions.withSoftDeletes
          ? "where.deletedAtIncludeNotNull = true;"
          : ""
      }
      return query\`
        DELETE FROM "${type.name}" ${type.shortName}
        $\{${type.name}Where(where)}
        \`.exec(sql);
    }
  `;
}
