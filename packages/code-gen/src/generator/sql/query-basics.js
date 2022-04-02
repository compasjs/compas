// @ts-nocheck

import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getUpdateQuery } from "./update-type.js";
import { getPrimaryKeyWithType } from "./utils.js";

/**
 * Generate the basic CRUD queries
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 * @param {string[]} src
 * @returns {void}
 */
export function generateBaseQueries(context, imports, type, src) {
  imports.destructureImport("query", `@compas/store`);
  imports.destructureImport("generatedUpdateHelper", "@compas/store");

  const names = [`${type.name}Count`];

  src.push(countQuery(context, imports, type));

  const primaryKey = getPrimaryKeyWithType(type);
  const upsertByPrimaryKey = `${type.name}UpsertOn${upperCaseFirst(
    primaryKey.key,
  )}`;

  if (!type.queryOptions.isView) {
    names.push(
      `${type.name}Delete`,
      `${type.name}Insert`,
      upsertByPrimaryKey,
      `${type.name}Update`,
    );
    src.push(deleteQuery(context, imports, type));
    src.push(insertQuery(context, imports, type));
    src.push(upsertQueryByPrimaryKey(context, imports, type));
    src.push(getUpdateQuery(context, imports, type));
  }

  src.push(`export const ${type.name}Queries = { ${names.join(", ")} };`);
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
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
        FROM ${type.queryOptions.schema}"${type.name}" ${type.shortName}
        WHERE $\{${type.name}Where(where)}
        \`.exec(sql);

      return Number(result?.countResult ?? "0")
    }
  `;
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function deleteQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.uniqueName}Where} [where={}]
     * @returns {Promise<void>}
     */
    async function ${type.name}Delete(sql,
                                                                                where = {}
    ) {
      ${
        type.queryOptions.withSoftDeletes
          ? "where.deletedAtIncludeNotNull = true;"
          : ""
      }
      return await query\`
        DELETE FROM ${type.queryOptions.schema}"${type.name}" ${type.shortName}
        WHERE $\{${type.name}Where(where)}
        \`.exec(sql);
    }
  `;
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function insertQuery(context, imports, type) {
  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.partial.insertType}|(${type.partial.insertType}[])} insert
     * @param {{ withPrimaryKey?: boolean }} [options={}]
     * @returns {Promise<${type.uniqueName}[]>}
     */
    async function ${type.name}Insert(sql, insert, options = {}) {
      if (insert === undefined || (Array.isArray(insert) && insert.length === 0)) {
        return [];
      }
      options.withPrimaryKey = options.withPrimaryKey ?? false;

      const result = await query\`
        INSERT INTO ${type.queryOptions.schema}"${type.name}" ($\{${
    type.name
  }Fields(
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
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../utils").ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function upsertQueryByPrimaryKey(context, imports, type) {
  const primaryKey = getPrimaryKeyWithType(type);
  const name = `${type.name}UpsertOn${upperCaseFirst(primaryKey.key)}`;

  return js`
    /**
     * @param {Postgres} sql
     * @param {${type.partial.insertType}|(${type.partial.insertType}[])} insert
     * @param {{}} [options={}]
     * @returns {Promise<${type.uniqueName}[]>}
     */
    async function ${name}(sql, insert, options = {}) {
      if (insert === undefined || (Array.isArray(insert) &&  insert.length === 0)) {
        return [];
      }
      
      const fieldString = [...${type.name}FieldSet]
        .filter(it => it !== "${primaryKey.key}" && it !== "createdAt")
        .map((column) => \`"$\{column}" = COALESCE(EXCLUDED."$\{column}", "${
          type.name
        }"."$\{column}")\`)
        .join(",");

      const result = await query\`
        INSERT INTO ${type.queryOptions.schema}"${type.name}" ($\{${
    type.name
  }Fields(
        "", { excludePrimaryKey: false })})
        VALUES $\{${type.name}InsertValues(
        insert, { includePrimaryKey: true })}
        ON CONFLICT ("${primaryKey.key}") DO UPDATE SET $\{query([fieldString])}
        RETURNING $\{${type.name}Fields("")}
      \`.exec(sql);

      transform${upperCaseFirst(type.name)}(result);

      return result;
    }
  `;
}
