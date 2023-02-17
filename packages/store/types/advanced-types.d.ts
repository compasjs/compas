import { Postgres } from "packages/store/index";
import type { PendingQuery } from "postgres";

export type QueryPartArg =
  | string
  | boolean
  | number
  | null
  | undefined
  | Date
  | QueryPart
  | QueryPartArg[];

export interface QueryPart<T = any> {
  get strings(): string[];

  get values(): QueryPartArg[];

  append(query: QueryPart): QueryPart<T>;

  exec(sql: Postgres): PendingQuery<T>;
}

/**
 * Wrap query builder results
 */
export type WrappedQueryPart<Type> = {
  /**
   * Get the underlying queryPart, representing the build query
   */
  queryPart: QueryPart;

  /**
   * @deprecated Use `.exec` or `.execRaw`
   */
  then(): never;

  /**
   * Exec the query and return validated query results.
   */
  exec(sql: Postgres): Promise<Type[]>;

  /**
   * Exec the query and return raw query results. This should be used when a custom 'select' or 'returning' is used.
   */
  execRaw(sql: Postgres): Promise<Partial<Type>[]>;
};

/**
 * @template Type

 * @typedef {object} WrappedQueryPart
 * @property {import("@compas/store").QueryPart<any>} queryPart
 * @property {function(): void} then
 * @property {(sql: import("@compas/store").Postgres) => Promise<Type[]>} exec
 * @property {(sql: import("@compas/store").Postgres) => Promise<(Type|any)[]>} execRaw
 */

export type Returning<
  Type,
  Selector extends undefined | "*" | string[],
> = Selector extends "*"
  ? Type[]
  : Selector extends Array<infer T>
  ? // @ts-ignore
    Pick<Type, T>[]
  : undefined;
