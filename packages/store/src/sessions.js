import { queries } from "./generated/index.js";
import { storeQueries } from "./generated/queries.js";

const EIGHTEEN_HOURS = 18 * 60 * 60 * 1000;

/**
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
      return JSON.parse(data.data);
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

      await storeQueries.sessionUpsert(sql, {
        id: sid,
        expires,
        data: JSON.stringify(sess),
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
