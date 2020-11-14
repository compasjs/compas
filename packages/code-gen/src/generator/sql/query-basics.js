import { js } from "../tag/index.js";
import { importCreator } from "../utils.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";

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

    if (!type.queryOptions.isView) {
      imports.destructureImport(
        `${type.name}InsertValues`,
        `./query-partials${context.importExtension}`,
      );
      imports.destructureImport(
        `${type.name}UpdateSet`,
        `./query-partials${context.importExtension}`,
      );
    }

    partials.push(selectQuery(context, imports, type));
    partials.push(countQuery(context, imports, type));
    if (!type.queryOptions.isView) {
      partials.push(deleteQuery(context, imports, type));
      partials.push(insertQuery(context, imports, type));
      partials.push(updateQuery(context, imports, type));
    }

    if (type.queryOptions.withSoftDeletes) {
      partials.push(softDeleteQuery(context, imports, type));
    }
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
        WHERE $\{${type.name}Where(where)}
        ORDER BY $\{${type.name}OrderBy()}
        \`.exec(sql);
    }
  `;
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function countQuery(context, imports, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.uniqueName}Where} [where]
     * @returns {Promise<number>}
     */
    export async function ${type.name}Count(sql, where) {
      const [ result ] = await query\`
        SELECT COUNT(${type.shortName}."${primaryKey}") as "countResult"
        FROM "${type.name}" ${type.shortName}
        WHERE $\{${type.name}Where(where)}
        \`.exec(sql);

      return Number(result?.countResult ?? "0")
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
        WHERE $\{${type.name}Where(where)}
        \`.exec(sql);
    }
  `;
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function softDeleteQuery(context, imports, type) {
  const affectedRelations = [];
  for (const relation of type.relations) {
    if (["oneToOneReverse", "oneToMany"].indexOf(relation.subType) === -1) {
      continue;
    }
    const referenceQueryOptions =
      relation.reference.reference.queryOptions ?? {};
    if (
      referenceQueryOptions.withSoftDeletes &&
      !referenceQueryOptions.isView
    ) {
      affectedRelations.push(relation);
    }
  }

  const { key: primaryKey } = getPrimaryKeyWithType(type);

  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.uniqueName}Where} [where={}]
     * @param {{ skipCascade: boolean }} [options={}]
     * @returns {Promise<void>}
     */
    export async function ${type.name}Delete(sql, where = {}, options = {}) {
      ${affectedRelations.length > 0 ? "const result =" : ""}
      await query\`
        UPDATE "${type.name}" ${type.shortName}
        SET "deletedAt" = now()
        WHERE $\{${type.name}Where(where)}
        RETURNING "${primaryKey}"
        \`.exec(sql);

      ${() => {
        if (affectedRelations.length > 0) {
          return js`
            if (options.skipCascade || result.length === 0) {
              return;
            }

            const ids = result.map(it => it.${primaryKey});
            await Promise.all([
                                ${affectedRelations
                                  .map(
                                    (it) =>
                                      `${it.reference.reference.name}Delete(sql, { ${it.referencedKey}In: ids })`,
                                  )
                                  .join(",\n  ")}
                              ]);
          `;
        }
      }}
    }
  `;
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function insertQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.partial.insertType}|(${type.partial.insertType}[])} insert
     * @param {{ withPrimaryKey: boolean }=} options
     * @returns {Promise<${type.uniqueName}[]>}
     */
    export function ${type.name}Insert(sql, insert, options = {}) {
      if (insert === undefined || insert.length === 0) {
        return []; 
      }
      options.withPrimaryKey = options.withPrimaryKey ?? false;

      return query\`
        INSERT INTO "${type.name}" ($\{${type.name}Fields(
        "", { excludePrimaryKey: !options.withPrimaryKey })})
        VALUES $\{${type.name}InsertValues(insert, { includePrimaryKey: options.withPrimaryKey })}
        RETURNING $\{${type.name}Fields("")}
      \`.exec(sql);
    }
  `;
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function updateQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.partial.updateType}} update
     * @param {${type.where.type}} [where={}]
     * @returns {Promise<${type.uniqueName}[]>}
     */
    export function ${type.name}Update(sql, update, where = {}) {
      return query\`
        UPDATE "${type.name}" ${type.shortName}
        SET $\{${type.name}UpdateSet(update)}
        WHERE $\{${type.name}Where(where)}
        RETURNING $\{${type.name}Fields()}
      \`.exec(sql);
    }
  `;
}
