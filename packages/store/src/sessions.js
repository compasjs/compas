import { queries } from "./generated.js";
import {
  querySession,
  sessionFields,
  sessionInsertValues,
  sessionUpdateSet,
} from "./generated/database/session.js";
import { query } from "./query.js";

const THIRTY_MINUTES = 30 * 60 * 1000;

/**
 * @typedef {object} SessionStore
 * @property {(id: string) => Promise<object|boolean>} get
 * @property {(id: string, session: object, age: number|"session") => Promise<void>} set
 * @property {(id: string) => Promise<void>} destroy
 * @property {() => Promise<void>} clean
 */

/**
 */
const sessionQueries = {
  /**
   * Upsert a query by id.
   * We can't reuse `sessionInsertValues` here since that won't account for the 'id' field
   *
   * @param {Postgres} sql
   * @param {StoreSessionInsertPartial & { id?: string }} value
   * @returns {import("postgres").PendingQuery<any>}
   */
  upsertById: (sql, value) =>
    query`
    INSERT INTO "session" (${sessionFields("")})
    VALUES
    ${sessionInsertValues(value, { includePrimaryKey: true })}
    ON CONFLICT ("id")
    DO UPDATE SET ${sessionUpdateSet({
      expires: value.expires,
      data: value.data,
    })}
    RETURNING ${sessionFields("")}
  `.exec(sql),
};

/**
 * Create a new session store, to be used in combination with the `session` as provided
 * in `@compas/server`.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @returns {SessionStore}
 */
export function newSessionStore(sql) {
  return {
    get: async (sid) => {
      const [data] = await querySession({
        where: {
          id: sid,
          expiresGreaterThan: new Date(),
        },
      }).exec(sql);
      if (!data) {
        return false;
      }

      return data.data;
    },
    set: async (sid, sess, maxAge) => {
      const expires = new Date();
      if (maxAge === "session") {
        expires.setMilliseconds(expires.getMilliseconds() + THIRTY_MINUTES);
      } else if (typeof maxAge === "number") {
        expires.setMilliseconds(expires.getMilliseconds() + maxAge);
      } else {
        // Unknown max age
        expires.setMilliseconds(expires.getMilliseconds() + THIRTY_MINUTES);
      }

      await sessionQueries.upsertById(sql, {
        id: sid,
        expires,
        data: sess,
      });
    },
    destroy: async (sid) => {
      await queries.sessionDelete(sql, { id: sid });
    },
    clean: () => {
      return queries.sessionDelete(sql, {
        expiresLowerThan: new Date(),
      });
    },
  };
}
