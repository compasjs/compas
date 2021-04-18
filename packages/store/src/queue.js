import { eventStart, eventStop, newEvent, newLogger } from "@compas/insight";
import {
  AppError,
  environment,
  isNil,
  isPlainObject,
  uuid,
} from "@compas/stdlib";
import { queries } from "./generated.js";
import { queryJob } from "./generated/database/job.js";

const COMPAS_RECURRING_JOB = "compas.job.recurring";

const queueQueries = {
  // Should only run in a transaction
  getAnyJob: (sql) => sql`
    UPDATE "job"
    SET
      "isComplete" = TRUE,
      "updatedAt" = now()
    WHERE
        id = (
        SELECT "id"
        FROM "job"
        WHERE
            NOT "isComplete"
        AND "scheduledAt" < now()
        ORDER BY "priority", "scheduledAt" FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
    RETURNING id
  `,

  // Should only run in a transaction
  getJobByName: (name, sql) => sql`
    UPDATE "job"
    SET
      "isComplete" = TRUE,
      "updatedAt" = now()
    WHERE
        id = (
        SELECT "id"
        FROM "job"
        WHERE
            NOT "isComplete"
        AND "scheduledAt" < now()
        AND "name" = ${name}
        ORDER BY "priority", "scheduledAt" FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
    RETURNING "id"
  `,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSize: (sql) => sql`
    SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END) AS "pendingCount",
           sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
    FROM "job"
    WHERE
      NOT "isComplete"
  `,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSizeForName: (sql, name) => sql`
    SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END) AS "pendingCount",
           sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
    FROM "job"
    WHERE
        NOT "isComplete"
    AND "name" = ${name}
  `,

  // Returns time in milliseconds
  getAverageJobTime: (sql, name, dateStart, dateEnd) => sql`
    SELECT avg((extract(EPOCH FROM "updatedAt" AT TIME ZONE 'UTC') * 1000) -
               (extract(EPOCH FROM "scheduledAt" AT TIME ZONE 'UTC') * 1000)) AS "completionTime"
    FROM "job"
    WHERE
        "isComplete" IS TRUE
    AND (coalesce(${name ?? null}) IS NULL OR "name" = ${name ?? null})
    AND "updatedAt" > ${dateStart}
    AND "updatedAt" <= ${dateEnd};
  `,

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
   * @param {string|JobQueueWorkerOptions} nameOrOptions
   * @param {JobQueueWorkerOptions} [options]
   */
  constructor(sql, nameOrOptions, options) {
    this.sql = sql;

    // Default query ignores name
    this.newJobQuery = queueQueries.getAnyJob.bind(undefined);

    if (typeof nameOrOptions === "string") {
      // Use the name query and bind the name already, else we would have to use this
      // when executing the query
      this.newJobQuery = queueQueries.getJobByName.bind(
        undefined,
        nameOrOptions,
      );
      this.name = nameOrOptions;
    } else {
      this.name = undefined;
      options = nameOrOptions;
    }

    this.pollInterval = options?.pollInterval ?? 1500;
    this.maxRetryCount = options?.maxRetryCount ?? 5;
    this.handlerTimeout = options?.handlerTimeout ?? 30000;

    // Setup the worker array, each value is either undefined or a running Promise
    this.workers = Array(options?.parallelCount ?? 1).fill(undefined);

    this.timeout = undefined;
    this.isStarted = false;

    this.jobHandler = options?.handler;
    this.logger = newLogger({ ctx: { type: this.name ?? "queue" } });
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
  pendingQueueSize() {
    if (this.name) {
      return getPendingQueueSizeForName(this.sql, this.name);
    }
    return getPendingQueueSize(this.sql);
  }

  /**
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<number>}
   */
  averageTimeToCompletion(startDate, endDate) {
    if (this.name) {
      return getAverageTimeToJobCompletion(
        this.sql,
        this.name,
        startDate,
        endDate,
      );
    }

    return getAverageTimeToJobCompletion(
      this.sql,
      undefined,
      startDate,
      endDate,
    );
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

      const [job] = await this.newJobQuery(sql);
      if (job === undefined || job.id === undefined) {
        // reset this 'worker'
        this.workers[idx] = undefined;
        return;
      }

      const [jobData] = await queries.jobSelect(sql, {
        id: job.id,
      });

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
              reject(AppError.serverError("queue.handlerTimeout"));
            }, handlerTimeout);
          }),
          handlerFn(event, sql, jobData),
        ]);
      } catch (err) {
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
 * @param {object} data
 * @returns {Promise<number>}
 */
export async function addEventToQueue(sql, eventName, data) {
  const [result] = await queries.jobInsert(sql, {
    data,
    name: eventName,
    priority: 2,
  });
  return result?.id;
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
    handlerTimeout: null,
  });
  return result?.id;
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
  return result?.id;
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
 * Get the number of jobs that need to run
 *
 * @param {Postgres} sql
 * @returns {Promise<{pendingCount: number, scheduledCount: number}>}
 */
async function getPendingQueueSize(sql) {
  const [result] = await queueQueries.getPendingQueueSize(sql);

  // sql returns 'null' if no rows match, so coalesce in to '0'
  return {
    pendingCount: parseInt(result?.pendingCount ?? 0, 10),
    scheduledCount: parseInt(result?.scheduledCount ?? 0, 10),
  };
}

/**
 * Get the number of jobs that need to run for specified job name
 *
 * @param {Postgres} sql
 * @param {string} name
 * @returns {Promise<{pendingCount: number, scheduledCount: number}>}
 */
async function getPendingQueueSizeForName(sql, name) {
  const [result] = await queueQueries.getPendingQueueSizeForName(sql, name);

  // sql returns 'null' if no rows match, so coalesce in to '0'
  return {
    pendingCount: parseInt(result?.pendingCount ?? 0, 10),
    scheduledCount: parseInt(result?.scheduledCount ?? 0, 10),
  };
}

/**
 * Return the average time between scheduled and completed for jobs completed in the
 * provided time range
 *
 * @param {Postgres} sql
 * @param {string|undefined} name
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<number>}
 */
async function getAverageTimeToJobCompletion(sql, name, startDate, endDate) {
  const [result] = await queueQueries.getAverageJobTime(
    sql,
    name,
    startDate,
    endDate,
  );

  return Math.floor(parseFloat(result?.completionTime ?? "0"));
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

  const result = {};

  for (const job of jobs) {
    if (isNil(result[job.name])) {
      result[job.name] = [];
    }

    result[job.name].push(job);
  }

  return result;
}
