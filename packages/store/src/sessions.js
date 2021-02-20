import { queries } from "./generated.js";
import {
  sessionFields,
  sessionInsertValues,
  sessionUpdateSet,
} from "./generated/index.js";
import { query } from "./query.js";

const EIGHTEEN_HOURS = 18 * 60 * 60 * 1000;

const sessionQueries = {
  /**
   * Upsert a query by id.
   * We can't reuse `sessionInsertValues` here since that won't account for the 'id' field
   *
   * @param {Postgres} sql
   * @param {StoreSessionInsertPartial & { id?: string }} value
   * @returns {postgres.PendingQuery<any>}
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
 * Create a new session store, to be used in combination with the `session` as provided in `@compas/server`.
 *
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @returns {SessionStore}
 */
export function newSessionStore(sql) {
  return {
    get: async (sid) => {
      const [data] = await queries.sessionSelect(sql, {
        id: sid,
        expiresGreaterThan: new Date(),
      });
      if (!data) {
        return false;
      }

      return data.data;
    },
    set: async (sid, sess, maxAge) => {
      const expires = new Date();
      if (maxAge === "session") {
        expires.setMilliseconds(expires.getMilliseconds() + EIGHTEEN_HOURS);
      } else if (typeof maxAge === "number") {
        expires.setMilliseconds(expires.getMilliseconds() + maxAge);
      } else {
        // Unknown max age
        expires.setMilliseconds(expires.getMilliseconds() + EIGHTEEN_HOURS);
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
