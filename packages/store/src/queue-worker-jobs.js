import { eventStart, eventStop } from "@compas/stdlib";
import { queries } from "./generated.js";
import { jobWhere } from "./generated/database/job.js";
import { query } from "./query.js";

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
export function jobQueueCleanup(options) {
  const queueHistoryInDays = options?.queueHistoryInDays ?? 5;

  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @returns {Promise<void>}
   */
  return async function jobQueueCleanup(event, sql) {
    eventStart(event, "job.queueCleanup");

    const d = new Date();
    d.setDate(d.getDate() - queueHistoryInDays);

    const result = await queries.jobDelete(sql, {
      isComplete: true,
      updatedAtLowerThan: d,
    });

    event.log.info({
      type: "queue_cleanup",

      // @ts-ignore
      removedCompletedJobs: result.count,
    });

    eventStop(event);
  };
}

/**
 * Returns a {@link QueueWorkerHandler} that logs the amount of
 * pending and scheduled jobs. Can be used to keep track of the queue pressure.
 *
 * Recommended interval: hourly
 * Recommended cronExpression: 0 * * * *
 *
 * @returns {import("./queue-worker.js").QueueWorkerHandler}
 */
export function jobQueueInsights() {
  /**
   * @param {import("@compas/stdlib").InsightEvent} event
   * @param {import("postgres").Sql<{}>} sql
   * @returns {Promise<void>}
   */
  return async function jobQueueInsights(event, sql) {
    eventStart(event, "job.queueInsights");

    const [result] = await query`
      SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END) AS "pendingCount",
             sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
      FROM "job" j
      WHERE
        ${jobWhere(
          {
            isComplete: false,
          },
          {
            skipValidator: true,
            shortName: "j.",
          },
        )}
    `.exec(sql);

    event.log.info({
      type: "queue_insights",
      pendingCount: parseInt(result?.pendingCount ?? 0, 10),
      scheduledCount: parseInt(result?.scheduledCount ?? 0, 10),
    });

    eventStop(event);
  };
}
