/**
 * Returns a {@link QueueWorkerHandler} that cleans up jobs that are
 * completed longer than 'queueHistoryInDays' days old.
 *
 * Recommended interval: daily
 * Recommended cronExpression: 0 1 * * *
 *
 * @param {{
 *   queueHistoryInDays?: number
 *  }} [options]
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobQueueCleanup(
  options?:
    | {
        queueHistoryInDays?: number | undefined;
      }
    | undefined,
): import("./queue-worker.js").QueueWorkerHandler;
/**
 * Returns a {@link QueueWorkerHandler} that logs the amount of
 * pending and scheduled jobs. Can be used to keep track of the queue pressure.
 *
 * Recommended interval: hourly
 * Recommended cronExpression: 0 * * * *
 *
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobQueueInsights(): import("./queue-worker.js").QueueWorkerHandler;
//# sourceMappingURL=queue-worker-jobs.d.ts.map
