import { log } from "@lbu/insight";
import { storeQueries } from "./generated/queries.js";

const LBU_RECURRING_JOB = "lbu.job.recurring";

const queries = {
  // Should only run in a transaction
  getAnyJob: (sql) => sql`
    UPDATE "job"
    SET "isComplete" = TRUE,
        "updatedAt"  = now()
    WHERE id = (SELECT "id"
                FROM "job"
                WHERE NOT "isComplete"
                  AND "scheduledAt" < now()
                ORDER BY "scheduledAt", "priority"
                  FOR UPDATE SKIP LOCKED
                LIMIT 1)
    RETURNING id
  `,

  // Should only run in a transaction
  getJobByName: (name, sql) => sql`
    UPDATE "job"
    SET "isComplete" = TRUE,
        "updatedAt"  = now()
    WHERE id = (SELECT "id"
                FROM "job"
                WHERE NOT "isComplete"
                  AND "scheduledAt" < now()
                  AND "name" = ${name}
                ORDER BY "scheduledAt", "priority"
                  FOR UPDATE SKIP LOCKED
                LIMIT 1)
    RETURNING "id"
  `,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSize: (sql) => sql`
    SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END)  AS "pendingCount",
           sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
    FROM "job"
    WHERE NOT "isComplete"
  `,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSizeForName: (sql, name) => sql`
    SELECT sum(CASE WHEN "scheduledAt" < now() THEN 1 ELSE 0 END)  AS "pendingCount",
           sum(CASE WHEN "scheduledAt" >= now() THEN 1 ELSE 0 END) AS "scheduledCount"
    FROM "job"
    WHERE NOT "isComplete"
      AND "name" = ${name}
  `,

  // Returns time in milliseconds
  getAverageJobTime: (sql, dateStart, dateEnd) => sql`
    SELECT avg((EXTRACT(EPOCH FROM "updatedAt" AT TIME ZONE 'UTC') * 1000) -
               (EXTRACT(EPOCH FROM "scheduledAt" AT TIME ZONE 'UTC') * 1000)) AS "completionTime"
    FROM "job"
    WHERE "isComplete"
      AND "updatedAt" > ${dateStart}
      AND "updatedAt" <= ${dateEnd};
  `,

  // Returns time in milliseconds
  getAverageJobTimeForName: (sql, name, dateStart, dateEnd) => sql`
    SELECT avg((EXTRACT(EPOCH FROM "updatedAt" AT TIME ZONE 'UTC') * 1000) -
               (EXTRACT(EPOCH FROM "scheduledAt" AT TIME ZONE 'UTC') * 1000)) AS "completionTime"
    FROM "job"
    WHERE "isComplete"
      AND name = ${name}
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
    WHERE name = ${LBU_RECURRING_JOB}
      AND "isComplete" IS FALSE
      AND data ->> 'name' = ${name}
  `,
};

export class JobQueueWorker {
  /**
   * @param {Postgres} sql
   * @param {string|JobQueueWorkerOptions} nameOrOptions
   * @param {JobQueueWorkerOptions} [options]
   */
  constructor(sql, nameOrOptions, options) {
    this.sql = sql;

    // Default query ignores name
    this.newJobQuery = queries.getAnyJob.bind(undefined);

    if (typeof nameOrOptions === "string") {
      // Use the name query and bind the name already, else we would have to use this
      // when executing the query
      this.newJobQuery = queries.getJobByName.bind(undefined, nameOrOptions);
      this.name = nameOrOptions;
    } else {
      options = nameOrOptions;
    }

    this.pollInterval = options?.pollInterval ?? 1500;

    // Setup the worker array, each value is either undefined or a running Promise
    this.workers = Array(options?.parallelCount ?? 1).fill(undefined);

    this.timeout = undefined;
    this.isStarted = false;

    this.jobHandler = options?.handler;
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
      return getPendingQueueSizeForName(this.sql);
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
      return getAverageTimeToJobCompletionForName(
        this.sql,
        this.name,
        startDate,
        endDate,
      );
    }

    return getAverageTimeToJobCompletion(this.sql, startDate, endDate);
  }

  /**
   * Uses this queue name and connection to add a job to the queue
   *
   * @public
   * @param {JobInput} job
   * @returns {Promise<number>}
   */
  addJob(job) {
    if (this.name && !job.name) {
      // If this JobQueueWorker has a name, and the job input doesn't use that name.
      job.name = this.name;
    }

    return addJobToQueue(this.sql, job);
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
    this.workers[idx] = this.sql
      .begin(async (sql) => {
        // run in transaction

        const [job] = await this.newJobQuery(sql);
        if (job === undefined || job.id === undefined) {
          // reset this 'worker'
          this.workers[idx] = undefined;
          return;
        }

        const [jobData] = await storeQueries.jobSelect(sql, {
          id: job.id,
        });

        // We need to catch errors to be able to reset the worker.
        // We throw this error afterwards, so the Postgres library
        // will automatically call ROLLBACK for us.
        let error = undefined;

        try {
          if (jobData.name === LBU_RECURRING_JOB) {
            await handleLbuRecurring(sql, jobData);
          } else {
            await this.jobHandler(sql, jobData);
          }
        } catch (err) {
          error = err;
        } finally {
          this.workers[idx] = undefined;
        }

        if (error) {
          throw error;
        } else {
          // Run again as soon as possible
          setImmediate(this.run.bind(this));
        }
      })
      .catch((e) => {
        log.error(e);
      }); // user should have handled error already, so ignore it
  }
}

/**
 * Add a new item to the job queue
 *
 * @param {Postgres} sql
 * @param {JobInput} job
 * @returns {Promise<number>}
 */
export async function addJobToQueue(sql, job) {
  const [result] = await storeQueries.jobInsert(sql, {
    ...job,
    name: job.name ?? process.env.APP_NAME,
  });
  return result?.id;
}

/**
 * Add a recurring job, if no existing job with the same name is scheduled.
 * Does not throw when a job is already pending with the same name.
 *
 * @param {Postgres} sql
 * @param {string} name
 * @param {number} [priority]
 * @param {StoreJobInterval} interval
 * @returns {Promise<void>}
 */
export async function addRecurringJobToQueue(
  sql,
  { name, priority, interval },
) {
  priority = priority || 1;

  const existingJobs = await queries.getRecurringJobForName(sql, name);

  if (existingJobs.length > 0) {
    return;
  }

  await addJobToQueue(sql, {
    name: LBU_RECURRING_JOB,
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
  const [result] = await queries.getPendingQueueSize(sql);

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
  const [result] = await queries.getPendingQueueSizeForName(sql, name);

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
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<number>}
 */
async function getAverageTimeToJobCompletion(sql, startDate, endDate) {
  const [result] = await queries.getAverageJobTime(sql, startDate, endDate);

  return parseFloat(result?.completionTime ?? 0);
}

/**
 * Return the average time between scheduled and completed for jobs completed in the
 * provided time range
 *
 * @param {Postgres} sql
 * @param {string} name
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<number>}
 */
async function getAverageTimeToJobCompletionForName(
  sql,
  name,
  startDate,
  endDate,
) {
  const [result] = await queries.getAverageJobTimeForName(
    sql,
    name,
    startDate,
    endDate,
  );
  return result?.completionTime ?? 0;
}

/**
 * Handles recurring jobs, by scheduling the 'child' and the current job again
 *
 * @param {Postgres} sql
 * @param {StoreJob} job
 */
export async function handleLbuRecurring(sql, job) {
  const {
    scheduledAt,
    priority,
    data: { name, interval },
  } = job;

  const nextSchedule = getNextScheduledAt(scheduledAt, interval);

  // Dispatch 'job' with higher priority
  await addJobToQueue(sql, {
    name,
    priority: priority + 1,
  });

  // Dispatch recurring job again for the next 'schedule'
  await addJobToQueue(sql, {
    name: LBU_RECURRING_JOB,
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
