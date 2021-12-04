import {
  AppError,
  environment,
  eventStart,
  eventStop,
  isNil,
  isPlainObject,
  newEvent,
  newLogger,
  uuid,
} from "@compas/stdlib";
import { queries } from "./generated.js";
import { jobWhere, queryJob } from "./generated/database/job.js";
import { query } from "./query.js";

const COMPAS_RECURRING_JOB = "compas.job.recurring";

/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */

/**
 * @typedef {object} JobInput
 * @property {number|undefined} [priority] Defaults to 0
 * @property {Record<string, any>|undefined} [data] Defaults to an empty object
 * @property {Date|undefined} [scheduledAt] By default executes as soon as possible
 * @property {string} name
 */

/**
 * @typedef {(
 *   event: InsightEvent,
 *   sql: Postgres,
 *   data: StoreJob,
 * ) => (void | Promise<void>)} JobQueueHandlerFunction
 */

/**
 * @typedef {object} JobQueueWorkerOptions
 * @property {JobQueueHandlerFunction|Record<
 *   string,
 *   JobQueueHandlerFunction | {
 *      handler: JobQueueHandlerFunction,
 *      timeout: number
 *   }
 * >} handler
 *   Set a global handler, a handler based on job name, or also specify a different
 *    timeout for the specific job handler. If no timeout for a specific handler is
 *    provided, the handlerTimeout value is used. The timeout should be in milliseconds.
 * @property {number|undefined} [pollInterval] Determine the poll interval in
 *    milliseconds if the queue was empty. Defaults to 1500 ms.
 * @property {number|undefined} [parallelCount] Set the amount of parallel jobs to
 *    process. Defaults to 1. Make sure it is not higher than the amount of Postgres
 *    connections in the pool
 * @property {number|undefined} [maxRetryCount] The worker will automatically catch any
 *    errors thrown by the handler, and retry the job at a later stage. This property
 *    defines the max amount of retries before forcing the job to be completed. Defaults
 *    to 5 retries.
 * @property {number|undefined} [handlerTimeout] Maximum time the handler could take to
 *    fulfill a job in milliseconds Defaults to 30 seconds.
 * @property {string[]|undefined} [includedNames] Included job names for this job worker,
 *   ignores all other jobs.
 * @property {string[]|undefined} [excludedNames] Excluded job names for this job worker,
 *   picks up all other jobs.
 * @property {boolean|undefined} [unsafeIgnoreSorting] Improve job throughput by ignoring
 *   the 'priority' and 'scheduledAt' sort when picking up jobs. This still only picks up
 *   jobs that are eligible to be picked up, however it doesn't guarantee any order. This
 *   property is also not bound to any SemVer versioning of this package.
 */

/**
 */
const queueQueries = {
  // Should only run in a transaction

  /**
   * @param {StoreJobWhere} where
   * @returns {QueryPart}
   */
  getAnyJob: (where) => query`
    UPDATE "job"
    SET
      "isComplete" = TRUE,
      "updatedAt" = now()
    WHERE
        id = (
        SELECT "id"
        FROM "job" j
        WHERE
            ${jobWhere(where, "j.", { skipValidator: true })}
        AND NOT "isComplete"
        AND "scheduledAt" < now()
        ORDER BY "priority", "scheduledAt" FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
    RETURNING id
  `,

  /**
   * @param {StoreJobWhere} where
   * @returns {QueryPart}
   */
  getUnsortedJob: (where) => query`
    UPDATE "job"
    SET
      "isComplete" = TRUE,
      "updatedAt" = now()
    WHERE
        id = (
        SELECT "id"
        FROM "job" j
        WHERE
            ${jobWhere(where, "j.", { skipValidator: true })}
        AND NOT "isComplete"
        AND "scheduledAt" < now() FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
    RETURNING id
  `,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSize: (sql, where) =>
    query`
    SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END) AS "pendingCount",
           sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
    FROM "job" j
    WHERE
        ${jobWhere(where, "j.", { skipValidator: true })}
    AND NOT "isComplete"
  `.exec(sql),

  /**
   * @param {Postgres} sql
   * @param {string} name
   * @returns Promise<{ id: number }[]>
   */
  getRecurringJobForName: (sql, name) => sql`
    SELECT id
    FROM "job"
    WHERE
        name = ${COMPAS_RECURRING_JOB}
    AND "isComplete" IS FALSE
    AND data ->> 'name' = ${name}
    ORDER BY "scheduledAt"
  `,

  /**
   * @param {Postgres} sql
   * @param {number} id
   * @param {number} priority
   * @param {StoreJobInterval} interval
   */
  updateRecurringJob: (sql, id, priority, interval) => sql`
    UPDATE "job"
    SET
      "priority" = ${priority},
      "data" = jsonb_set("data", ${sql.array(["interval"])}, ${sql.json(
    interval,
  )})
    WHERE
      id = ${id}
  `,
};

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
   * @param {Postgres} sql
   * @param {JobQueueWorkerOptions} options
   */
  constructor(sql, options) {
    this.sql = sql;

    this.pollInterval = options?.pollInterval ?? 1500;
    this.maxRetryCount = options?.maxRetryCount ?? 5;
    this.handlerTimeout = options?.handlerTimeout ?? 30000;
    this.unsafeIgnoreSorting = options?.unsafeIgnoreSorting ?? false;

    /** @type {StoreJobWhere} */
    this.where = {};

    if (options.includedNames) {
      this.where.nameIn = options.includedNames;
    } else if (options.excludedNames) {
      this.where.nameNotIn = options.excludedNames;
    }

    // Setup the worker array, each value is either undefined or a running Promise
    this.workers = Array(options?.parallelCount ?? 1).fill(undefined);

    /** @type {any} */
    this.timeout = undefined;
    this.isStarted = false;

    this.jobHandler = options?.handler;
    this.logger = newLogger({ ctx: { type: "queue" } });
  }

  start() {
    if (this.isStarted) {
      return;
    }

    if (this.jobHandler === undefined) {
      throw new Error(
        "Can't start JobQueueWorker. Please specify a handler in the constructor options",
      );
    }

    this.isStarted = true;
    this.run();
  }

  stop() {
    if (!this.isStarted) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.isStarted = false;
  }

  /**
   * @returns {Promise<{pendingCount: number, scheduledCount: number}|undefined>}
   */
  async pendingQueueSize() {
    const [result] = await queueQueries.getPendingQueueSize(
      this.sql,
      this.where,
    );

    // sql returns 'null' if no rows match, so coalesce in to '0'
    return {
      pendingCount: parseInt(result?.pendingCount ?? 0, 10),
      scheduledCount: parseInt(result?.scheduledCount ?? 0, 10),
    };
  }

  /**
   * Cleanup jobs that finished longer 'maxAgeInDays' ago.
   * Respects 'includedNames' and 'excludedNames' properties.
   * Returns the number of removed rows
   *
   * @param {number} maxAgeInDays
   * @returns {Promise<number>}
   */
  async clean(maxAgeInDays) {
    const d = new Date();
    d.setDate(d.getDate() - maxAgeInDays);

    const result = await queries.jobDelete(this.sql, {
      ...this.where,
      isComplete: true,
      updatedAtLowerThan: d,
    });

    // @ts-ignore
    return result.count;
  }

  /**
   * @private
   */
  run() {
    if (!this.isStarted) {
      // Ignore this call since we should stop;
      return;
    }

    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    for (let i = 0; i < this.workers.length; ++i) {
      if (this.workers[i] !== undefined) {
        // worker has a pending promise
        continue;
      }

      this.handleJob(i);
    }

    this.timeout = setTimeout(() => this.run(), this.pollInterval);
  }

  /**
   * @private
   * @param {number} idx
   */
  handleJob(idx) {
    this.workers[idx] = this.sql.begin(async (sql) => {
      // run in transaction

      const [job] = this.unsafeIgnoreSorting
        ? await queueQueries.getUnsortedJob(this.where).exec(sql)
        : await queueQueries.getAnyJob(this.where).exec(sql);
      if (job === undefined || job.id === undefined) {
        // reset this 'worker'
        this.workers[idx] = undefined;
        return;
      }

      const [jobData] = await queryJob({
        where: {
          id: job.id,
        },
      }).exec(sql);

      const abortController = new AbortController();
      const event = newEvent(
        newLogger({
          ctx: {
            type: "queue_handler",
            id: jobData.id,
            name: jobData.name,
            priority: jobData.priority,
          },
        }),
        abortController.signal,
      );

      // We start a unique save point so we can still increase the retryCount safely,
      // while the job is still row locked.
      const savepointId = uuid().replace(/-/g, "_");
      await sql`SAVEPOINT ${sql(savepointId)}`;

      eventStart(event, `job.handler.${jobData.name}`);

      try {
        /** @type {any} */
        let handlerFn = this.jobHandler;
        let handlerTimeout = jobData.handlerTimeout ?? this.handlerTimeout;

        if (jobData.name === COMPAS_RECURRING_JOB) {
          handlerFn = handleCompasRecurring;
        } else if (
          isPlainObject(handlerFn) &&
          typeof handlerFn[jobData.name] === "function"
        ) {
          handlerFn = handlerFn[jobData.name];
        } else if (
          isPlainObject(handlerFn) &&
          isPlainObject(handlerFn[jobData.name]) &&
          typeof handlerFn[jobData.name].handler === "function"
        ) {
          handlerTimeout =
            jobData.handlerTimeout ??
            handlerFn[jobData.name].timeout ??
            this.handlerTimeout;
          handlerFn = handlerFn[jobData.name].handler;
        } else if (typeof handlerFn !== "function") {
          handlerFn = (event) => {
            event.log.info({
              message: "No handler registered for the following job.",
              jobData,
            });
          };
        }

        await Promise.race([
          new Promise((_, reject) => {
            setTimeout(() => {
              abortController.abort();
              reject(
                AppError.serverError({
                  message: "queue.handlerTimeout",
                }),
              );
            }, handlerTimeout);
          }),
          handlerFn(event, sql, jobData),
        ]);
      } catch (/** @type {any} */ err) {
        event.log.error({
          type: "job_error",
          scheduledAt: jobData.scheduledAt,
          now: new Date(),
          retryCount: jobData.retryCount,
          error: AppError.format(err),
        });

        // Roll back to before the handler did it's thing
        await sql`ROLLBACK TO SAVEPOINT ${sql(savepointId)}`;
        await queries.jobUpdate(
          sql,
          {
            isComplete: jobData.retryCount + 1 >= this.maxRetryCount,
            retryCount: jobData.retryCount + 1,
          },
          { id: jobData.id },
        );
      } finally {
        eventStop(event);
        this.workers[idx] = undefined;

        // Run again as soon as possible
        setImmediate(this.run.bind(this));
      }
    });
  }
}

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
 * @param {Postgres} sql
 * @param {string} eventName
 * @param {Record<string, any>} data
 * @returns {Promise<number>}
 */
export async function addEventToQueue(sql, eventName, data) {
  const [result] = await queries.jobInsert(sql, {
    data,
    name: eventName,
    priority: 2,
  });

  return Number(result?.id);
}

/**
 * Add a new job to the queue.
 * Use this for normal jobs or to customize the job priority.
 * The default priority is '5'.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {JobInput} job
 * @returns {Promise<number>}
 */
export async function addJobToQueue(sql, job) {
  if (isNil(job.priority)) {
    job.priority = 5;
  }

  const [result] = await queries.jobInsert(sql, {
    ...job,
    name: job.name ?? environment.APP_NAME,

    // Always overwrite the timeout
    // @ts-ignore
    handlerTimeout: null,
  });

  return Number(result?.id);
}

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
 * @param {Postgres} sql
 * @param {JobInput} job
 * @param {number} timeout
 * @returns {Promise<number>}
 */
export async function addJobWithCustomTimeoutToQueue(sql, job, timeout) {
  if (
    isNaN(timeout) ||
    !isFinite(timeout) ||
    !Number.isInteger(timeout) ||
    timeout < 10
  ) {
    throw new TypeError(
      "Argument 'timeout' should be an integer value higher than 10. Timeout value represents milliseconds.",
    );
  }

  if (isNil(job.priority)) {
    job.priority = 5;
  }

  const [result] = await queries.jobInsert(sql, {
    ...job,
    name: job.name ?? environment.APP_NAME,
    handlerTimeout: timeout,
  });

  return Number(result?.id);
}

/**
 * Add a recurring job, if no existing job with the same name is scheduled.
 * Does not throw when a job is already pending with the same name.
 * If exists will update the interval.
 * The default priority is '4', which is a bit more important than other jobs.
 *
 * @see JobQueueWorker
 * @since 0.1.0
 *
 * @param {Postgres} sql
 * @param {{ name: string, priority?: number|undefined, interval: StoreJobInterval }} job
 * @returns {Promise<void>}
 */
export async function addRecurringJobToQueue(
  sql,
  { name, priority, interval },
) {
  priority = priority || 4;

  const existingJobs = await queueQueries.getRecurringJobForName(sql, name);

  if (existingJobs.length > 0) {
    await queueQueries.updateRecurringJob(
      sql,
      existingJobs[0].id,
      priority,
      interval,
    );

    if (existingJobs.length > 1) {
      // Remove to many scheduled jobs
      await queries.jobDelete(sql, {
        idIn: existingJobs.slice(1).map((it) => it.id),
      });
    }
    return;
  }

  await addJobToQueue(sql, {
    name: COMPAS_RECURRING_JOB,
    priority,
    data: {
      interval,
      name,
    },
  });
}

/**
 * Handles recurring jobs, by scheduling the 'child' and the current job again.
 * If the next scheduled item is not in the future, the interval is added to the current
 * Date.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreJob} job
 */
export async function handleCompasRecurring(event, sql, job) {
  const {
    scheduledAt,
    priority,
    data: { name, interval },
  } = job;

  let nextSchedule = getNextScheduledAt(scheduledAt, interval);
  if (nextSchedule.getTime() < Date.now()) {
    nextSchedule = getNextScheduledAt(new Date(), interval);
  }

  // Dispatch 'job' with higher priority
  await addJobToQueue(sql, {
    name,
    priority: priority + 1,
  });

  // Dispatch recurring job again for the next 'schedule'
  await addJobToQueue(sql, {
    name: COMPAS_RECURRING_JOB,
    scheduledAt: nextSchedule,
    priority,
    data: {
      name,
      interval,
    },
  });
}

/**
 * Adds the interval to the provided scheduledAt date
 *
 * @param {Date} scheduledAt
 * @param {StoreJobInterval} interval
 * @returns {Date}
 */
export function getNextScheduledAt(scheduledAt, interval) {
  const nextSchedule = new Date();

  nextSchedule.setUTCFullYear(
    scheduledAt.getUTCFullYear() + (interval.years ?? 0),
    scheduledAt.getUTCMonth() + (interval.months ?? 0),
    scheduledAt.getUTCDate() + (interval.days ?? 0),
  );

  nextSchedule.setUTCHours(
    scheduledAt.getUTCHours() + (interval.hours ?? 0),
    scheduledAt.getUTCMinutes() + (interval.minutes ?? 0),
    scheduledAt.getUTCSeconds() + (interval.seconds ?? 0),
    0,
  );

  return nextSchedule;
}

/**
 * Get all uncompleted jobs from the queue.
 * Useful for testing if jobs are created.
 *
 * @param {Postgres} sql
 * @returns {Promise<Object<string, QueryResultStoreJob[]>>}
 */
export async function getUncompletedJobsByName(sql) {
  const jobs = await queryJob({
    where: {
      isComplete: false,
    },
  }).exec(sql);

  /** @type {Record<string, QueryResultStoreJob[]>} */
  const result = {};

  for (const job of jobs) {
    if (isNil(result[job.name])) {
      result[job.name] = [];
    }

    result[job.name].push(job);
  }

  return result;
}
