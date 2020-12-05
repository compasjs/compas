import { isNil } from "@compas/stdlib";
import { queries } from "./generated.js";
import { query } from "./query.js";

/**
 * @name NestedFileGroupWithFiles
 * @typedef {StoreFileGroupView & {
 *   file?: StoreFile|undefined,
 *   children?: NestedFileGroupWithFiles[]
 * }}
 */

const fileGroupQueries = {
  updateOrderByIds: (sql, ids) => {
    const q = query`
      UPDATE "fileGroup" fg
      SET
        "order" = CAST(temp.position AS INTEGER)
      FROM
        (values
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
        SELECT
          fgv."id",
          fgv."name",
          jsonb_build_object('id', fgv."file") as "file",
          fgv."parent",
          fgv."order",
          fgv."createdAt",
          fgv."updatedAt",
          fgv."deletedAt",
          fgv."isDirectory",
          lpad(fgv."order"::text, 8)           as "sortKey"
        FROM
          "fileGroupView" fgv
        WHERE
          ((COALESCE(${
            where?.rootId ?? null
          }, NULL) IS NULL AND fgv."parent" IS NULL) OR
           fgv."id" = ${where?.rootId ?? null})
          AND (${
            where?.deletedAtIncludeNotNull ?? false
          } IS TRUE OR fgv."deletedAt" IS NULL)

        UNION ALL

        SELECT
          fgv."id",
          fgv."name",
          to_jsonb(file.*) AS                                       "file",
          fgv."parent",
          fgv."order",
          fgv."createdAt",
          fgv."updatedAt",
          fgv."deletedAt",
          fgv."isDirectory",
          concat(cte."sortKey", ':', lpad(fgv."order"::text, 8)) as "sortKey"
        FROM
          "fileGroupView" fgv
            INNER JOIN cte
                       ON fgv."parent" = cte.id
            LEFT JOIN  file
                       ON fgv.file = file.id
        WHERE
          (${
            where?.deletedAtIncludeNotNull ?? false
          } IS TRUE OR fgv."deletedAt" IS NULL)
          AND (${
            where?.excludeFiles ?? false
          } IS FALSE OR fgv."isDirectory" IS TRUE)
      )
    SELECT
      "id",
      "name",
      "file",
      "parent",
      "order",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "isDirectory"
    FROM
      cte
    ORDER BY
      "sortKey";
  `,
};

/**
 * Assigns children of the provided fileGroup to the parent
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
 * Update the order of the provided id's in relation to each other
 * This function does not check if all files are in the same group, please use
 * getFileGroupParents for that
 * @param {Postgres} sql
 * @param {string[]} ids
 */
export function updateFileGroupOrder(sql, ids) {
  return fileGroupQueries.updateOrderByIds(sql, ids);
}

/**
 * Return a result with nested file groups and files, sorted completely by the order id
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
