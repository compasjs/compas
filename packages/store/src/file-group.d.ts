/**
 * Assigns children of the provided fileGroup to the parent.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {StoreFileGroup} fileGroup
 * @returns {Promise<StoreFileGroup[]>}
 */
export function hoistChildrenToParent(sql: Postgres, fileGroup: StoreFileGroup): Promise<StoreFileGroup[]>;
/**
 * Update the order of the provided id's in relation to each other.
 * This function does not check if all files are in the same group, please use
 * getFileGroupParents for that.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {string[]} ids
 * @returns {Promise<void>}
 */
export function updateFileGroupOrder(sql: Postgres, ids: string[]): Promise<void>;
export type Postgres = import("../types/advanced-types").Postgres;
//# sourceMappingURL=file-group.d.ts.map