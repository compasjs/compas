/**
 * Add an event to the job queue.
 * Use this if the default priority is important, like sending the user an email to
 *    verify their email. Runs with priority '2', the only higher priority values are
 *    priority '0' and '1'.
 *
 * Custom timeouts can't be described via this mechanism.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {string} eventName
 * @param {Record<string, any>} data
 * @returns {Promise<number>}
 */
export function addEventToQueue(
  sql: import("../types/advanced-types").Postgres,
  eventName: string,
  data: Record<string, any>,
): Promise<number>;
/**
 * Add a new job to the queue.
 * Use this for normal jobs or to customize the job priority.
 * The default priority is '5'.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {JobInput} job
 * @returns {Promise<number>}
 */
export function addJobToQueue(
  sql: import("../types/advanced-types").Postgres,
  job: JobInput,
): Promise<number>;
/**
 * Add a new job to the queue.
 * Use this for normal jobs or to customize the job priority.
 * The default priority is '5'.
 *
 * The timeout value must be an integer higher than 10. The timeout value represents the
 *    number of milliseconds the handler may run, before the 'InsightEvent' is aborted.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {JobInput} job
 * @param {number} timeout
 * @returns {Promise<number>}
 */
export function addJobWithCustomTimeoutToQueue(
  sql: import("../types/advanced-types").Postgres,
  job: JobInput,
  timeout: number,
): Promise<number>;
/**
 * Add a recurring job, if no existing job with the same name is scheduled.
 * Does not throw when a job is already pending with the same name.
 * If exists will update the interval.
 * The default priority is '4', which is a bit more important than other jobs.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {{ name: string, priority?: number|undefined, interval: StoreJobInterval }} job
 * @returns {Promise<void>}
 */
export function addRecurringJobToQueue(
  sql: import("../types/advanced-types").Postgres,
  {
    name,
    priority,
    interval,
  }: {
    name: string;
    priority?: number | undefined;
    interval: StoreJobInterval;
  },
): Promise<void>;
/**
 * Handles recurring jobs, by scheduling the 'child' and the current job again.
 * If the next scheduled item is not in the future, the interval is added to the current
 * Date.
 *
 * @param {InsightEvent} event
 * @param {import("../types/advanced-types").Postgres} sql
 * @param {StoreJob} job
 */
export function handleCompasRecurring(
  event: InsightEvent,
  sql: import("../types/advanced-types").Postgres,
  job: StoreJob,
): Promise<void>;
/**
 * Adds the interval to the provided scheduledAt date
 *
 * @param {Date} scheduledAt
 * @param {StoreJobInterval} interval
 * @returns {Date}
 */
export function getNextScheduledAt(
  scheduledAt: Date,
  interval: StoreJobInterval,
): Date;
/**
 * Get all uncompleted jobs from the queue.
 * Useful for testing if jobs are created.
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @returns {Promise<Record<string, QueryResultStoreJob[]>>}
 */
export function getUncompletedJobsByName(
  sql: import("../types/advanced-types").Postgres,
): Promise<Record<string, QueryResultStoreJob[]>>;
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
 * - addEventToQueue: use the queue as an 'external' message bus to do things based on
 *    user flows, like sending an verification email on when registering.
 *    Jobs created will have a priority of '2'.
 *
 * - addJobToQueue: use the queue as background processing of defined units. Like
 *    converting a file to different formats, sending async or scheduled notifications.
 *    Jobs created will have a priority of '5'.
 *
 * - addRecurringJobToQueue: use the queue for recurring background processing, like
 *    cleaning up sessions, generating daily reports. The interval can be as low as a
 *    second.
 *    Jobs created will have a priority of '4'. This means the recurring jobs are by
 *    default more important than normal jobs. However there are no guarantees that jobs
 *    are running exactly on the time they are scheduled.
 *
 * - addJobWithCustomTimeoutToQueue: when the unit of work is hard to define statically
 *    for the job. For example an external api that needs all information in a single
 *    call, but the amount of information is of value N. And N doesn't have any bounds
 *    and is only known when the job is created. However, this sort of still enforces
 *    that the unit of work is related to some other property to consistently calculate a
 *    custom timeout.
 *    These jobs have a priority of '5' by default.
 *
 * The handler can be passed in in 2 ways;
 *  - A single handler dispatching over the different jobs in application code
 *  - A plain JS object containing job names as strings, and handler with optional
 *    timeout as value.
 *
 *  The timeout of a created job overwrites the specific job timeout which overwrites the
 *    'handlerTimeout' option.
 *  Note that a lower priority value means a higher priority.
 *
 * @see addEventToQueue
 * @see addJobToQueue
 * @see addRecurringJobToQueue
 * @see addJobWithCustomTimeoutToQueue
 */
export class JobQueueWorker {
  /**
   * @param {import("../types/advanced-types").Postgres} sql
   * @param {JobQueueWorkerOptions} options
   */
  constructor(
    sql: import("../types/advanced-types").Postgres,
    options: JobQueueWorkerOptions,
  );
  sql: import("../types/advanced-types").Postgres;
  pollInterval: number;
  maxRetryCount: number;
  handlerTimeout: number;
  unsafeIgnoreSorting: boolean;
  /** @type {StoreJobWhere} */
  where: StoreJobWhere;
  workers: any[];
  /** @type {any} */
  timeout: any;
  isStarted: boolean;
  jobHandler:
    | JobQueueHandlerFunction
    | Record<
        string,
        | JobQueueHandlerFunction
        | {
            handler: JobQueueHandlerFunction;
            timeout: number;
          }
      >;
  logger: import("@compas/stdlib/types/advanced-types").Logger;
  start(): void;
  stop(): void;
  /**
   * @returns {Promise<{pendingCount: number, scheduledCount: number}|undefined>}
   */
  pendingQueueSize(): Promise<
    | {
        pendingCount: number;
        scheduledCount: number;
      }
    | undefined
  >;
  /**
   * Cleanup jobs that finished longer 'maxAgeInDays' ago.
   * Respects 'includedNames' and 'excludedNames' properties.
   * Returns the number of removed rows
   *
   * @param {number} maxAgeInDays
   * @returns {Promise<number>}
   */
  clean(maxAgeInDays: number): Promise<number>;
  /**
   * @private
   */
  private run;
  /**
   * @private
   * @param {number} idx
   */
  private handleJob;
}
export type JobInput = {
  /**
   * Defaults to 0
   */
  priority?: number | undefined;
  /**
   * Defaults to an empty object
   */
  data?: Record<string, any> | undefined;
  /**
   * By default executes as soon as possible
   */
  scheduledAt?: Date | undefined;
  name: string;
};
export type JobQueueHandlerFunction = (
  event: InsightEvent,
  sql: import("../types/advanced-types").Postgres,
  data: StoreJob,
) => void | Promise<void>;
export type JobQueueWorkerOptions = {
  /**
   *   Set a global handler, a handler based on job name, or also specify a different
   *    timeout for the specific job handler. If no timeout for a specific handler is
   *    provided, the handlerTimeout value is used. The timeout should be in milliseconds.
   */
  handler:
    | JobQueueHandlerFunction
    | Record<
        string,
        | JobQueueHandlerFunction
        | {
            handler: JobQueueHandlerFunction;
            timeout: number;
          }
      >;
  /**
   * Determine the poll interval in
   * milliseconds if the queue was empty. Defaults to 1500 ms.
   */
  pollInterval?: number | undefined;
  /**
   * Set the amount of parallel jobs to
   * process. Defaults to 1. Make sure it is not higher than the amount of Postgres
   * connections in the pool
   */
  parallelCount?: number | undefined;
  /**
   * The worker will automatically catch any
   * errors thrown by the handler, and retry the job at a later stage. This property
   * defines the max amount of retries before forcing the job to be completed. Defaults
   * to 5 retries.
   */
  maxRetryCount?: number | undefined;
  /**
   * Maximum time the handler could take to
   * fulfill a job in milliseconds Defaults to 30 seconds.
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
   * the 'priority' and 'scheduledAt' sort when picking up jobs. This still only picks up
   * jobs that are eligible to be picked up, however it doesn't guarantee any order. This
   * property is also not bound to any SemVer versioning of this package.
   */
  unsafeIgnoreSorting?: boolean | undefined;
};
//# sourceMappingURL=queue.d.ts.map
