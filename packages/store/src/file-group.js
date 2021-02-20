import { isNil } from "@compas/stdlib";
import { queries } from "./generated.js";
import { query } from "./query.js";

/**
 * @typedef {StoreFileGroupView & {
 *   file?: StoreFile|undefined,
 *   children?: NestedFileGroupWithFiles[]
 * }} NestedFileGroupWithFiles
 */

const fileGroupQueries = {
  updateOrderByIds: (sql, ids) => {
    const q = query`
        UPDATE "fileGroup" fg
        SET
          "order" = cast(temp.position AS integer)
        FROM (values
      `;

    for (let i = 0; i < ids.length; ++i) {
      q.append(query`(${ids[i]}, ${i + 1})`);

      if (i !== ids.length - 1) {
        q.append(query`, `);
      }
    }

    q.append(query`) AS temp(id, position) WHERE fg."id" = temp.id::uuid`);

    return q.exec(sql);
  },

  /**
   * Returns a list of all files under the rootId
   * If rootId is not defined, all roots are followed
   *
   * @param {Postgres} sql
   * @param {{
   *   deletedAtIncludeNotNull?: boolean,
   *   rootId?: string,
   *   excludeFiles?: boolean
   * }} where
   * @returns {Promise<StoreFileGroupView[]>}
   */
  getNestedFiles: (sql, where) => sql`
     WITH
       RECURSIVE
       cte AS (
         SELECT fgv."id",
                fgv."name",
                jsonb_build_object('id', fgv."file") AS "file",
                fgv."parent",
                fgv."order",
                fgv."createdAt",
                fgv."updatedAt",
                fgv."deletedAt",
                fgv."isDirectory",
                lpad(fgv."order"::text, 8) AS "sortKey"
         FROM "fileGroupView" fgv
         WHERE
             ((coalesce(${
               where?.rootId ?? null
             }, NULL) IS NULL AND fgv."parent" IS NULL) OR
              fgv."id" = ${where?.rootId ?? null})
         AND (${
           where?.deletedAtIncludeNotNull ?? false
         } IS TRUE OR fgv."deletedAt" IS NULL)

         UNION ALL

         SELECT fgv."id",
                fgv."name",
                to_jsonb(file.*) AS "file",
                fgv."parent",
                fgv."order",
                fgv."createdAt",
                fgv."updatedAt",
                fgv."deletedAt",
                fgv."isDirectory",
                concat(cte."sortKey", ':', lpad(fgv."order"::text, 8)) AS "sortKey"
         FROM "fileGroupView" fgv
                INNER JOIN cte ON fgv."parent" = cte.id
                LEFT JOIN  file ON fgv.file = file.id
         WHERE
             (${
               where?.deletedAtIncludeNotNull ?? false
             } IS TRUE OR fgv."deletedAt" IS NULL)
         AND (${
           where?.excludeFiles ?? false
         } IS FALSE OR fgv."isDirectory" IS TRUE)
       )
     SELECT "id",
            "name",
            "file",
            "parent",
            "order",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "isDirectory"
     FROM cte
     ORDER BY "sortKey";
   `,
};

/**
 * Assigns children of the provided fileGroup to the parent.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {StoreFileGroup} fileGroup
 * @returns {Promise<StoreFileGroup[]>}
 */
export async function hoistChildrenToParent(sql, fileGroup) {
  return queries.fileGroupUpdate(
    sql,
    { parent: fileGroup.parent ?? null },
    { parent: fileGroup.id },
  );
}

/**
 * Update the order of the provided id's in relation to each other.
 * This function does not check if all files are in the same group, please use
 * getFileGroupParents for that.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {string[]} ids
 * @returns {Promise<undefined>}
 */
export async function updateFileGroupOrder(sql, ids) {
  await fileGroupQueries.updateOrderByIds(sql, ids);
}

/**
 * Return a result with nested file groups and files, sorted completely by the order id.
 * Note that this will be removed when the query builder is able to use `order by` clauses.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {{
 *   deletedAtIncludeNotNull?: boolean,
 *   rootId?: string,
 *   excludeFiles?: boolean
 * }} [where]
 * @returns {Promise<NestedFileGroupWithFiles[]>}
 */
export async function getNestedFileGroups(sql, where = {}) {
  const files = await fileGroupQueries.getNestedFiles(sql, where);

  const idMap = {};
  const result = [];
  for (let i = 0; i < files.length; ++i) {
    const thisFile = files[i];
    if (isNil(idMap[thisFile.id]) && thisFile.isDirectory) {
      idMap[thisFile.id] = thisFile;
      thisFile.children = [];
    }

    if (isNil(thisFile.parent)) {
      delete thisFile.parent;

      result.push(thisFile);
    } else {
      idMap[thisFile.parent].children.push(thisFile);
    }

    if (isNil(thisFile.file?.id)) {
      delete thisFile.file;
    }
  }

  return result;
}
