/**
 * Get all fields for job
 *
 * @param {string} [tableName="j."]
 * @param {{ excludePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function jobFields(
  tableName?: string | undefined,
  options?:
    | {
        excludePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'WHERE ' part for job
 *
 * @param {StoreJobWhere} [where={}]
 * @param {string} [tableName="j."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function jobWhere(
  where?: StoreJobWhere | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'ORDER BY ' part for job
 *
 * @param {StoreJobOrderBy} [orderBy=["createdAt", "updatedAt", "id"]]
 * @param {StoreJobOrderBySpec} [orderBySpec={}]
 * @param {string} [tableName="j."]
 * @param {{ skipValidator?: boolean|undefined }} [options={}]
 * @returns {QueryPart}
 */
export function jobOrderBy(
  orderBy?: StoreJobOrderBy | undefined,
  orderBySpec?: StoreJobOrderBySpec | undefined,
  tableName?: string | undefined,
  options?:
    | {
        skipValidator?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'VALUES ' part for job
 *
 * @param {StoreJobInsertPartial|StoreJobInsertPartial[]} insert
 * @param {{ includePrimaryKey?: boolean }} [options={}]
 * @returns {QueryPart}
 */
export function jobInsertValues(
  insert: StoreJobInsertPartial | StoreJobInsertPartial[],
  options?:
    | {
        includePrimaryKey?: boolean | undefined;
      }
    | undefined,
): QueryPart;
/**
 * Build 'SET ' part for job
 *
 * @param {StoreJobUpdatePartial} update
 * @returns {QueryPart}
 */
export function jobUpdateSet(update: StoreJobUpdatePartial): QueryPart;
/**
 * Query Builder for job
 *
 * @param {StoreJobQueryBuilder} [builder={}]
 * @returns {{
 *  then: () => void,
 *  exec: (sql: Postgres) => Promise<QueryResultStoreJob[]>,
 *  execRaw: (sql: Postgres) => Promise<any[]>,
 *  queryPart: QueryPart<any>,
 * }}
 */
export function queryJob(builder?: StoreJobQueryBuilder | undefined): {
  then: () => void;
  exec: (sql: Postgres) => Promise<QueryResultStoreJob[]>;
  execRaw: (sql: Postgres) => Promise<any[]>;
  queryPart: QueryPart<any>;
};
/**
 * NOTE: At the moment only intended for internal use by the generated queries!
 *
 * Transform results from the query builder that adhere to the known structure
 * of 'job' and its relations.
 *
 * @param {any[]} values
 * @param {StoreJobQueryBuilder} [builder={}]
 */
export function transformJob(
  values: any[],
  builder?: StoreJobQueryBuilder | undefined,
): void;
/** @type {any} */
export const jobWhereSpec: any;
export namespace jobQueries {
  export { jobCount };
  export { jobDelete };
  export { jobInsert };
  export { jobUpsertOnId };
  export { jobUpdate };
}
export namespace jobQueryBuilderSpec {
  export const name: string;
  export const shortName: string;
  export { jobOrderBy as orderBy };
  export { jobWhereSpec as where };
  export const columns: string[];
  export const relations: never[];
}
/**
 * @param {Postgres} sql
 * @param {StoreJobWhere} [where]
 * @returns {Promise<number>}
 */
declare function jobCount(
  sql: Postgres,
  where?: StoreJobWhere | undefined,
): Promise<number>;
/**
 * @param {Postgres} sql
 * @param {StoreJobWhere} [where={}]
 * @returns {Promise<void>}
 */
declare function jobDelete(
  sql: Postgres,
  where?: StoreJobWhere | undefined,
): Promise<void>;
/**
 * @param {Postgres} sql
 * @param {StoreJobInsertPartial|(StoreJobInsertPartial[])} insert
 * @param {{ withPrimaryKey?: boolean }} [options={}]
 * @returns {Promise<StoreJob[]>}
 */
declare function jobInsert(
  sql: Postgres,
  insert: StoreJobInsertPartial | StoreJobInsertPartial[],
  options?:
    | {
        withPrimaryKey?: boolean | undefined;
      }
    | undefined,
): Promise<StoreJob[]>;
/**
 * @param {Postgres} sql
 * @param {StoreJobInsertPartial|(StoreJobInsertPartial[])} insert
 * @param {{}} [options={}]
 * @returns {Promise<StoreJob[]>}
 */
declare function jobUpsertOnId(
  sql: Postgres,
  insert: StoreJobInsertPartial | StoreJobInsertPartial[],
  options?: {} | undefined,
): Promise<StoreJob[]>;
/**
 * @param {Postgres} sql
 * @param {StoreJobUpdatePartial} update
 * @param {StoreJobWhere} [where={}]
 * @returns {Promise<StoreJob[]>}
 */
declare function jobUpdate(
  sql: Postgres,
  update: StoreJobUpdatePartial,
  where?: StoreJobWhere | undefined,
): Promise<StoreJob[]>;
export {};
//# sourceMappingURL=job.d.ts.map
