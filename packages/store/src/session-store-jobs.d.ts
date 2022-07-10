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
export function jobSessionStoreProcessLeakedSession(
  options?:
    | {
        useDump?: boolean | undefined;
      }
    | undefined,
): import("./queue-worker.js").QueueWorkerHandler;
//# sourceMappingURL=session-store-jobs.d.ts.map
