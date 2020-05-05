const DELETE_INTERVAL = 45 * 60 * 1000; // 45 minutes

const queries = {
  get: (sql, id) =>
    sql`SELECT data FROM session_store WHERE id = ${id} AND expires > ${new Date()}`,
  set: (sql, id, expires, data) =>
    sql`INSERT INTO session_store ${sql(
      { id, data, expires },
      "id",
      "expires",
      "data",
    )} ON CONFLICT (id) DO UPDATE SET ${sql(
      { data, expires },
      "data",
      "expires",
    )}`,
  delete: (sql, id) => sql`DELETE FROM session_store WHERE id = ${id}`,
  deleteExpired: (sql, expires) =>
    sql`DELETE FROM session_store WHERE expires < ${expires}`,
};

/**
 * @name SessionStore
 * @typedef {object}
 * @property {function(string): Promise<object|boolean>} get
 * @property {function(string, object, number): Promise<void>} set
 * @property {function(string): Promise<void>} destroy
 */

/**
 *
 * @param sql
 * @param {object} [options]
 * @param {number} [options.cleanupInterval]
 * @param {boolean} [options.disableInterval]
 * @return {SessionStore}
 */
export function newSessionStore(sql, options) {
  options = options || {};
  options.cleanupInterval = options.cleanupInterval || DELETE_INTERVAL; // 45 minutes

  let interval;

  if (!options.disableInterval) {
    interval = setInterval(() => {
      queries.deleteExpired(sql, new Date());
    }, options.cleanupInterval);
  }

  return {
    get: async (sid) => {
      const [data] = await queries.get(sql, sid);
      if (!data) {
        return false;
      }
      return data.data;
    },
    set: async (sid, sess, maxAge) => {
      const d = new Date();
      d.setMilliseconds(d.getMilliseconds() + maxAge);
      await queries.set(sql, sid, d, JSON.stringify(sess));
    },
    destroy: async (sid) => {
      await queries.delete(sql, sid);
    },
    kill: () => {
      clearInterval(interval);
    },
  };
}
