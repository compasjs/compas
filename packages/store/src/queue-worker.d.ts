/**
 * Add a new job to the queue. Use {@link queueWorkerCreate} for more information about
 * the behavior of the queue. Use {@link queueWorkerRegisterCronJobs} to specify
 * recurring jobs.
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {{
 *   name: string,
 *   priority?: number,
 *   scheduledAt?: Date,
 *   handlerTimeout?: number,
 *   data?: Record<string, any>,
 * }} options
 * @returns {Promise<number>}
 */
export function queueWorkerAddJob(
  sql: import("postgres").Sql<{}>,
  {
    name,
    priority,
    scheduledAt,
    handlerTimeout,
    data,
  }: {
    name: string;
    priority?: number;
    scheduledAt?: Date;
    handlerTimeout?: number;
    data?: Record<string, any>;
  },
): Promise<number>;
/**
 * Register cron jobs to the queue. Any existing cron job not in this definition will be
 * removed from the queue, even if pending jobs exist. When the cron expression of a job
 * is changed, it takes effect immediately. The system won't ever upgrade an existing
 * normal job to a cron job. Note that your job may not be executed on time. Use
 * `job.data.cronLastCompletedAt` and `job.data.cronExpression` to decide if you still
 * need to execute your logic. The provided `cronExpression` is evaluated in 'utc' mode.
 *
 * The default priority for these jobs is '4'.
 *
 * [cron-parser]{@link https://www.npmjs.com/package/cron-parser} is used for parsing the
 * `cronExpression`. If you need a different type of scheduler, use
 * {@link queueWorkerAddJob} manually in your job handler.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerCronOptions} options
 * @returns {Promise<void>}
 */
export function queueWorkerRegisterCronJobs(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  { jobs }: QueueWorkerCronOptions,
): Promise<void>;
/**
 * The queue system is based on 'static' units of work to be done in the background.
 * It supports the following:
 * - Job priority's. Lower value means higher priority.
 * - Scheduling jobs at a set time
 * - Customizable handler timeouts
 * - Recurring job handling
 * - Concurrent workers pulling from the same queue
 * - Specific workers for a specific job
 *
 * When to use which function of adding a job:
 * - {@link queueWorkerAddJob}: use the queue as background processing of defined units.
 * Like converting a file to different formats, sending async or scheduled notifications.
 * Jobs created will have a priority of '5'.
 * - {@link queueWorkerRegisterCronJobs}: use the queue for scheduled recurring jobs
 * based on the specific `cronExpression`. Jos created will have a default priority of
 * '4'.
 *
 * Every job runs with a timeout. It is determined in the following order:
 * - Timeout of the specific job, via `handlerTimeout` property. Should be used
 * sporadically
 * - Timeout of a specific handler as provided by the `handler` property.
 * - The `handlerTimeout` property of the QueueWorker
 *
 * Jobs are picked up if the following criteria are met:
 * - The job is not complete yet
 * - The job's 'scheduledAt' property is in the past
 * - The job's 'retryCount' value is lower than the `maxRetryCount` option.
 *
 * Eligible jobs are sorted in the following order:
 * - By priority ascending, so a lower priority value job will run first
 * - By scheduledAt ascending, so an earlier scheduled job will be picked before a later
 * scheduled job.
 *
 * If a job fails, by throwing an error, other jobs may run first before
 * any retries happen, based on the above ordering.
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerOptions} options
 */
export function queueWorkerCreate(
  sql: import("postgres").Sql<{}>,
  options: QueueWorkerOptions,
): {
  start(): void;
  stop(): Promise<void>;
};
export type QueueWorkerHandler = (
  event: InsightEvent,
  sql: import("postgres").Sql<{}>,
  job: import("./generated/common/types").StoreJob,
) => void | Promise<void>;
export type QueueWorkerOptions = {
  /**
   *   Specify handler based on job name, optionally adding a timeout. If no timeout for a
   *   specific handler is provided, the handlerTimeout value is used. The timeout should
   *   be in milliseconds.
   */
  handler: Record<
    string,
    | QueueWorkerHandler
    | {
        handler: QueueWorkerHandler;
        timeout: number;
      }
  >;
  /**
   * Determine the poll interval in
   * milliseconds if the queue did not have available jobs. Defaults to 1500 ms.
   */
  pollInterval?: number | undefined;
  /**
   * Set the amount of parallel jobs to
   * process. Defaults to 1. Make sure it is not higher than the number of Postgres
   * connections in the pool. Note that if you set a higher number than 1 that some jobs
   * may run in parallel, so make sure your code expects that.
   */
  parallelCount?: number | undefined;
  /**
   * The worker will automatically catch any
   * errors thrown by the handler, and retry the job at a later stage. This property
   * defines the max number of retries before forcing the job to be completed. Defaults
   * to 2 retries.
   */
  maxRetryCount?: number | undefined;
  /**
   * Maximum time the handler could take to
   * fulfill a job in milliseconds. Defaults to 30 seconds.
   */
  handlerTimeout?: number | undefined;
  /**
   * Included job names for this job worker,
   * ignores all other jobs.
   */
  includedNames?: string[] | undefined;
  /**
   * Excluded job names for this job worker,
   * picks up all other jobs.
   */
  excludedNames?: string[] | undefined;
  /**
   * Improve job throughput by ignoring
   * the 'priority' and 'scheduledAt' sort when picking up jobs.  Reducing query times if
   * a lot of jobs are in the queue. This still only picks up jobs that are eligible to
   * be picked up. However, it doesn't guarantee any order. This property is also not
   * bound to any SemVer versioning of this package.
   */
  unsafeIgnoreSorting?: boolean | undefined;
};
export type QueueWorkerInternalOptions = Required<QueueWorkerOptions> & {
  isQueueEnabled: boolean;
  timeout?: number;
};
export type QueueWorkerCronOptions = {
  /**
   * Specify all needed cron jobs. You can still use the 'includedNames' and
   * 'excludedNames' of the {@link QueueWorkerOptions } so your jobs are handled by a
   * specific worker. The default priority is '4'.
   */
  jobs: {
    name: string;
    priority?: number;
    cronExpression: string;
  }[];
};
//# sourceMappingURL=queue-worker.d.ts.map
