import { storeQueries } from "./generated/queries.js";

const EIGHTEEN_HOURS = 18 * 60 * 60 * 1000;

/**
 * @param {Postgres} sql
 * @returns {SessionStore}
 */
export function newSessionStore(sql) {
  return {
    get: async (sid) => {
      const [data] = await storeQueries.sessionStoreSelect(sql, {
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

      await storeQueries.sessionStoreUpsert(sql, {
        id: sid,
        expires,
        data: JSON.stringify(sess),
      });
    },
    destroy: async (sid) => {
      await storeQueries.sessionStoreDelete(sql, { id: sid });
    },
    clean: () => {
      return storeQueries.sessionStoreDelete(sql, {
        expiresLowerThan: new Date(),
      });
    },
  };
}
