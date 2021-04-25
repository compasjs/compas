import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getPrimaryKeyWithType } from "./utils.js";

/**
 * Generate the basic CRUD queries
 *
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 * @returns {void}
 */
export function generateBaseQueries(context, imports, type, src) {
  imports.destructureImport("query", `@compas/store`);

  const names = [`${type.name}Select`, `${type.name}Count`];

  src.push(selectQuery(context, imports, type));
  src.push(countQuery(context, imports, type));

  if (!type.queryOptions.isView) {
    names.push(
      `${type.name}Delete`,
      `${type.name}Insert`,
      `${type.name}Update`,
    );
    src.push(deleteQuery(context, imports, type));
    src.push(insertQuery(context, imports, type));
    src.push(updateQuery(context, imports, type));

    if (type.queryOptions.withSoftDeletes) {
      names.push(`${type.name}DeletePermanent`);
      src.push(softDeleteQuery(context, imports, type));
    }
  }

  src.push(`export const ${type.name}Queries = { ${names.join(", ")} };`);
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
    async function ${type.name}Select(sql, where) {
      return await query${upperCaseFirst(type.name)}({ where }).exec(sql);
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
    async function ${type.name}Count(sql, where) {
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
    async function ${type.name}Delete${
    type.queryOptions.withSoftDeletes ? "Permanent" : ""
  }(sql,
                                                                                where = {}
    ) {
      ${
        type.queryOptions.withSoftDeletes
          ? "where.deletedAtIncludeNotNull = true;"
          : ""
      }
      return await query\`
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
    async function ${type.name}Delete(sql, where = {}, options = {}) {
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
                                  .filter(
                                    (it) =>
                                      !it.reference.reference.queryOptions
                                        .isView,
                                  )
                                  .map((it) => {
                                    if (it.reference.reference !== type) {
                                      imports.destructureImport(
                                        `${it.reference.reference.name}Queries`,
                                        `./${it.reference.reference.name}.js`,
                                      );
                                    }
                                    return `${it.reference.reference.name}Queries.${it.reference.reference.name}Delete(sql, { ${it.referencedKey}In: ids })`;
                                  })
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
     * @param {{ withPrimaryKey: boolean }} [options={}]
     * @returns {Promise<${type.uniqueName}[]>}
     */
    async function ${type.name}Insert(sql, insert, options = {}) {
      if (insert === undefined || insert.length === 0) {
        return [];
      }
      options.withPrimaryKey = options.withPrimaryKey ?? false;

      const result = await query\`
        INSERT INTO "${type.name}" ($\{${type.name}Fields(
        "", { excludePrimaryKey: !options.withPrimaryKey })})
        VALUES $\{${type.name}InsertValues(
        insert, { includePrimaryKey: options.withPrimaryKey })}
        RETURNING $\{${type.name}Fields("")}
      \`.exec(sql);

      transform${upperCaseFirst(type.name)}(result);

      return result;
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
    async function ${type.name}Update(sql, update, where = {}) {
      const result = await query\`
        UPDATE "${type.name}" ${type.shortName}
        SET $\{${type.name}UpdateSet(update)}
        WHERE $\{${type.name}Where(where)}
        RETURNING $\{${type.name}Fields()}
      \`.exec(sql);

      transform${upperCaseFirst(type.name)}(result);

      return result;
    }
  `;
}
