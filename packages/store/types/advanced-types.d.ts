import type { Options, PendingQuery, Sql } from "postgres";

export type Postgres = Sql<{}> & {
  connectionOptions?: Options<{}> & { createIfNotExists?: true };
};

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

export type Returning<
  Type,
  Selector extends undefined | "*" | string[],
> = Selector extends "*"
  ? Type[]
  : Selector extends Array<infer T>
  ? // @ts-ignore
    Pick<Type, T>[]
  : undefined;
