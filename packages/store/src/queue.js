import { storeQueries } from "./generated/queries.js";

const queries = {
  // Should only run in a transaction
  getAnyJob: (sql) => sql`UPDATE job_queue
                          SET is_complete = TRUE,
                              updated_at  = now()
                          WHERE id = (SELECT id
                                      FROM job_queue
                                      WHERE NOT is_complete
                                        AND scheduled_at < now()
                                      ORDER BY scheduled_at, priority
                                        FOR UPDATE SKIP LOCKED
                                      LIMIT 1)
                          RETURNING id`,

  // Should only run in a transaction
  getJobByName: (name, sql) => sql`UPDATE job_queue
                            SET is_complete = TRUE,
                                updated_at  = now()
                            WHERE id = (SELECT id
                                        FROM job_queue
                                        WHERE NOT is_complete
                                          AND scheduled_at < now()
                                          AND name = ${name}
                                        ORDER BY scheduled_at, priority 
                                        FOR UPDATE SKIP LOCKED
                                        LIMIT 1)
                            RETURNING id`,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSize: (
    sql,
  ) => sql`SELECT sum(CASE WHEN scheduled_at < now() THEN 1 ELSE 0 END) AS  pending_count,
                                            sum(CASE WHEN scheduled_at >= now() THEN 1 ELSE 0 END) AS scheduled_count
                                     FROM job_queue
                                     WHERE NOT is_complete`,

  // Alternatively use COUNT with a WHERE and UNION all to calculate the same
  getPendingQueueSizeForName: (
    sql,
    name,
  ) => sql`SELECT sum(CASE WHEN scheduled_at < now() THEN 1 ELSE 0 END) AS  pending_count,
                                            sum(CASE WHEN scheduled_at >= now() THEN 1 ELSE 0 END) AS scheduled_count
                                     FROM job_queue
                                     WHERE NOT is_complete AND name = ${name}`,

  // Returns time in milliseconds
  getAverageJobTime: (sql, dateStart, dateEnd) =>
    sql`SELECT avg((EXTRACT(EPOCH FROM updated_at AT TIME ZONE 'UTC') * 1000) - (EXTRACT(EPOCH FROM scheduled_at AT TIME ZONE 'UTC') * 1000)) AS completion_time FROM job_queue WHERE is_complete AND updated_at > ${dateStart} AND updated_at <= ${dateEnd};`,

  // Returns time in milliseconds
  getAverageJobTimeForName: (sql, name, dateStart, dateEnd) =>
    sql`SELECT avg((EXTRACT(EPOCH FROM updated_at AT TIME ZONE 'UTC') * 1000) - (EXTRACT(EPOCH FROM scheduled_at AT TIME ZONE 'UTC') * 1000)) AS completion_time FROM job_queue WHERE is_complete AND name = ${name} AND updated_at > ${dateStart} AND updated_at <= ${dateEnd};`,
};

/**
 * @name JobData
 *
 * Row data for a specific job
 *
 * @typedef {object}
 * @property {number} id
 * @property {Date} created_at
 * @property {Date} scheduled_at
 * @property {string} name
 * @property {object} data
 */

/**
 * @name JobInput
 *
 * @typedef {object}
 * @property {number} [priority=0]
 * @property {object} [data={}]
 * @property {Date} [scheduledAt]
 * @property {string} [name]
 */

/**
 * @name JobQueueWorkerOptions
 *
 * @typedef {object}
 * @property {function(sql: *, data: JobData): (void|Promise<void>)} handler
 * @property {number} [pollInterval] Determine the poll interval in milliseconds if the
 *   queue was empty. Defaults to 1500 ms
 * @property {number} [parallelCount] Set the amount of parallel jobs to process.
 *   Defaults to 1. Make sure it is not higher than the amount of Postgres connections in
 *   the pool
 */

/**
 * @class
 *
 */
export class JobQueueWorker {
  /**
   * Create a new JobQueueWorker
   *
   * @param sql
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

  /**
   * Start the JobQueueWorker
   *
   * @public
   */
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

  /**
   * Stop the JobQueueWorker
   * Running jobs will continue to run, but no new jobs are fetched
   *
   * @public
   */
  stop() {
    if (!this.isStarted) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.isStarted = false;
  }

  /**
   * Get the number of jobs that need to run
   *
   * @public
   * @returns {Promise<{pending_count: number, scheduled_count: number}|undefined>}
   */
  pendingQueueSize() {
    if (this.name) {
      return getPendingQueueSizeForName(this.sql);
    }
    return getPendingQueueSize(this.sql);
  }

  /**
   * Return the average time between scheduled and completed for jobs completed in the
   * provided time range in milliseconds
   *
   * @public
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

        const [jobData] = await storeQueries.jobQueueSelect(sql, {
          id: job.id,
        });

        // We need to catch errors to be able to reset the worker.
        // We throw this error afterwards, so the Postgres library
        // will automatically call ROLLBACK for us.
        let error = undefined;

        try {
          await this.jobHandler(sql, jobData);
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
        console.error(e);
      }); // user should have handled error already, so ignore it
  }
}

/**
 *Add a new item to the job queue
 *
 * @param sql
 * @param {JobInput} job
 * @returns {Promise<number>}
 */
export async function addJobToQueue(sql, job) {
  const [result] = await storeQueries.jobQueueInsert(sql, {
    ...job,
    name: job.name ?? process.env.APP_NAME,
  });
  return result?.id;
}

/**
 * Get the number of jobs that need to run
 *
 * @param sql
 * @returns {Promise<{pendingCount: number, scheduledCount: number}>}
 */
async function getPendingQueueSize(sql) {
  const [result] = await queries.getPendingQueueSize(sql);

  // sql returns 'null' if no rows match, so coalesce in to '0'
  return {
    pendingCount: result?.pending_count ?? 0,
    scheduledCount: result?.scheduled_count ?? 0,
  };
}

/**
 * Get the number of jobs that need to run for specified job name
 *
 * @param sql
 * @param {string} name
 * @returns {Promise<{pendingCount: number, scheduledCount: number}>}
 */
async function getPendingQueueSizeForName(sql, name) {
  const [result] = await queries.getPendingQueueSizeForName(sql, name);

  // sql returns 'null' if no rows match, so coalesce in to '0'
  return {
    pendingCount: result?.pending_count ?? 0,
    scheduledCount: result?.scheduled_count ?? 0,
  };
}

/**
 * Return the average time between scheduled and completed for jobs completed in the
 * provided time range
 *
 * @param sql
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<number>}
 */
async function getAverageTimeToJobCompletion(sql, startDate, endDate) {
  const [result] = await queries.getAverageJobTime(sql, startDate, endDate);

  return result?.completion_time ?? 0;
}

/**
 * Return the average time between scheduled and completed for jobs completed in the
 * provided time range
 *
 * @param sql
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
  return result?.completion_time ?? 0;
}
