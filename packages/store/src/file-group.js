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
