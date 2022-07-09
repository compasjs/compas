import { eventStart, eventStop, newEventFromEvent } from "@compas/stdlib";
import { sessionStoreCleanupExpiredSessions } from "./session-store.js";

/**
 * Returns a {@link QueueWorkerHandler} that removes expired and revoked sessions via
 * {@link sessionStoreCleanupExpiredSessions}. By default, removes expired and revoked
 * sessions after 14 days.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 2 * * *
 *
 * @param {{
 *   maxRevokedAgeInDays?: number,
 * }} [options]
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobSessionStoreCleanup(options) {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("../types/advanced-types").Postgres} sql
   * @returns {Promise<void>}
   */
  return async function jobSessionStoreCleanup(event, sql) {
    eventStart(event, "job.sessionStoreCleanup");

    await sessionStoreCleanupExpiredSessions(
      newEventFromEvent(event),
      sql,
      options?.maxRevokedAgeInDays ?? 14,
    );

    eventStop(event);
  };
}
