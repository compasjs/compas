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
export function jobSessionStoreCleanup(
  options?:
    | {
        maxRevokedAgeInDays?: number | undefined;
      }
    | undefined,
): import("./queue-worker.js").QueueWorkerHandler;
//# sourceMappingURL=session-store-jobs.d.ts.map
