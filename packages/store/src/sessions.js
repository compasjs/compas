import { storeQueries } from "./generated/queries.js";

const DELETE_INTERVAL = 45 * 60 * 1000; // 45 minutes

/**
 *
 * @param sql
 * @param {object} [options]
 * @param {number} [options.cleanupInterval]
 * @param {boolean} [options.disableInterval]
 * @returns {SessionStore}
 */
export function newSessionStore(sql, options) {
  options = options || {};
  options.cleanupInterval = options.cleanupInterval || DELETE_INTERVAL; // 45 minutes

  let interval;

  if (!options.disableInterval) {
    interval = setInterval(() => {
      storeQueries.sessionStoreDelete(sql, { expiresLowerThan: new Date() });
    }, options.cleanupInterval);
  }

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
    kill: () => {
      clearInterval(interval);
    },
  };
}
