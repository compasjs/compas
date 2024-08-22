import { eventStart, eventStop, newEventFromEvent } from "@compas/stdlib";
import { sessionStoreCleanupExpiredSessions } from "./session-store.js";

/**
 * Returns a {@link QueueWorkerHandler} that removes expired and revoked sessions via
 * {@link sessionStoreCleanupExpiredSessions}. By default, removes expired and revoked
 * sessions after 14 days.
 *
 * If 'maxSessionLifetimeInDays' is provided, even active sessions will be removed if
 * they are created 'maxSessionLifetimeInDays'-days ago.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 2 * * *
 *
 * @param {{
 *   maxRevokedAgeInDays?: number,
 *   maxSessionLifetimeInDays?: number,
 * }} [options]
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobSessionStoreCleanup(options) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @returns {Promise<void>}
   */
  return async function jobSessionStoreCleanup(event, sql) {
    eventStart(event, "job.sessionStoreCleanup");

    await sessionStoreCleanupExpiredSessions(
      newEventFromEvent(event),
      sql,
      options?.maxRevokedAgeInDays ?? 14,
      options?.maxSessionLifetimeInDays,
    );

    eventStop(event);
  };
}

/**
 * A {@link QueueWorkerHandler} to process reported leaked sessions. These jobs occur
 * when the session store finds that refresh token is used multiple times. The job is
 * able to either process the leaked session in to a report and log it via `type:
 * "sessionStore.leakedSession.report"` or is able to dump the raw session information
 * via `type: "sessionStore.leakedSession.dump"`
 *
 * @param {{
 *   useDump?: boolean,
 * }} [options]
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobSessionStoreProcessLeakedSession(options) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @param {import("./generated/common/types.d.ts").StoreJob} job
   * @returns {void}
   */
  return function jobSessionStoreProcessLeakedSession(event, sql, job) {
    eventStart(event, "job.sessionStoreProcessLeakedSession");

    if (options?.useDump) {
      event.log.info({
        type: "sessionStore.leakedSession.dump",
        session: job.data.report.session,
      });

      eventStop(event);

      return;
    }

    const session = job.data.report.session;
    const sessionCreated = new Date(session.createdAt);
    const sessionRevoked = new Date(session.revokedAt);
    const lastRefreshTimes = session.tokens
      .slice(session.tokens.length - 4)
      .map((it) => ({
        createdAt: new Date(it.createdAt),
        revokedAt: new Date(it.revokedAt),
      }));

    event.log.info({
      type: "sessionStore.leakedSession.report",
      session: {
        sessionCreated,
        sessionRevoked,
        lastRefreshTimes,
      },
    });

    eventStop(event);
  };
}
