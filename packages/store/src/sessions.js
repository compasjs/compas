import { storeQueries } from "./generated/queries.js";

/**
 * @param {Postgres} sql
 * @returns {SessionStore}
 */
export function newSessionStore(sql) {
  return {
    get: async (sid) => {
      const [data] = await storeQueries.sessionStoreSelect(sql, { id: sid });
      if (!data) {
        return false;
      }
      return JSON.parse(data.data);
    },
    set: async (sid, sess, maxAge) => {
      const expires = new Date();
      expires.setMilliseconds(expires.getMilliseconds() + maxAge);

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
