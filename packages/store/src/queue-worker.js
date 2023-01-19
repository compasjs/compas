import { setTimeout } from "node:timers/promises";
import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  newEvent,
  newLogger,
} from "@compas/stdlib";
import cron from "cron-parser";
import { queries } from "./generated.js";
import { jobWhere, queryJob } from "./generated/database/job.js";
import { query } from "./query.js";

/**
 * @typedef {(
 *   event: InsightEvent,
 *   sql: import("postgres").Sql<{}>,
 *   job: import("./generated/common/types").StoreJob,
 * ) => (void | Promise<void>)} QueueWorkerHandler
 */

/**
 * @typedef {object} QueueWorkerOptions
 * @property {Record<
 *   string,
 *   QueueWorkerHandler | {
 *      handler: QueueWorkerHandler,
 *      timeout: number
 *   }
 * >} handler
 *   Specify handler based on job name, optionally adding a timeout. If no timeout for a
 *   specific handler is provided, the handlerTimeout value is used. The timeout should
 *   be in milliseconds.
 * @property {number} [pollInterval] Determine the poll interval in
 *    milliseconds if the queue did not have available jobs. Defaults to 1500 ms.
 * @property {number} [parallelCount] Set the amount of parallel jobs to
 *    process. Defaults to 1. Make sure it is not higher than the number of Postgres
 *    connections in the pool. Note that if you set a higher number than 1 that some jobs
 *   may run in parallel, so make sure your code expects that.
 * @property {number} [maxRetryCount] The worker will automatically catch any
 *    errors thrown by the handler, and retry the job at a later stage. This property
 *    defines the max number of retries before forcing the job to be completed. Defaults
 *    to 5 retries.
 * @property {number} [handlerTimeout] Maximum time the handler could take to
 *    fulfill a job in milliseconds. Defaults to 30 seconds.
 * @property {string[]} [includedNames] Included job names for this job worker,
 *   ignores all other jobs.
 * @property {string[]} [excludedNames] Excluded job names for this job worker,
 *   picks up all other jobs.
 * @property {boolean} [unsafeIgnoreSorting] Improve job throughput by ignoring
 *   the 'priority' and 'scheduledAt' sort when picking up jobs.  Reducing query times if
 *   a lot of jobs are in the queue. This still only picks up jobs that are eligible to
 *   be picked up. However, it doesn't guarantee any order. This property is also not
 *   bound to any SemVer versioning of this package.
 */

/**
 * @typedef {Required<QueueWorkerOptions> & {
 *   isQueueEnabled: boolean,
 *   timeout?: number,
 * }} QueueWorkerInternalOptions
 */

/**
 * @typedef  {object} QueueWorkerCronOptions
 * @property {{
 *   name: string,
 *   priority?: number,
 *   cronExpression: string,
 * }[]} jobs Specify all needed cron jobs. You can still use the 'includedNames' and
 *   'excludedNames' of the {@link QueueWorkerOptions} so your jobs are handled by a
 *   specific worker. The default priority is '4'.
 */

const queryParts = {
  /**
   * @param {import("./generated/common/types").StoreJobWhere} where
   * @param {import("../types/advanced-types").QueryPart<unknown>} [orderBy]
   * @returns {import("../types/advanced-types").QueryPart<any>}
   */
  getJobToDo(where, orderBy) {
    return query`
      UPDATE "job"
      SET
        "isComplete" = TRUE,
        "updatedAt" = now()
      WHERE
          id = (
          SELECT "id"
          FROM "job" j
          WHERE
            ${jobWhere(where, { skipValidator: true, shortName: "j." })}
          AND NOT "isComplete"
          AND "scheduledAt" < now() ${
            orderBy
              ? query`ORDER BY
          ${orderBy}`
              : query``
          } FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
      RETURNING id
    `;
  },
};

const JOB_TYPE_CRON = "compas.queue.cronJob";

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
export async function queueWorkerAddJob(
  sql,
  { name, priority, scheduledAt, handlerTimeout, data },
) {
  if (isNil(name) || name.length === 0) {
    throw AppError.serverError({
      message: `'name' should be set.`,
    });
  }

  if (!isNil(priority) && typeof priority !== "number") {
    throw AppError.serverError({
      message: `If 'priority' is provided, it should be a number.`,
    });
  }

  if (!isNil(scheduledAt) && !(scheduledAt instanceof Date)) {
    throw AppError.serverError({
      message: `If 'scheduledAt' is provided, it should be a Date.`,
    });
  }

  if (!isNil(handlerTimeout) && typeof handlerTimeout !== "number") {
    throw AppError.serverError({
      message: `If 'handlerTimeout' is provided, it should be a number.`,
    });
  }

  const [result] = await queries.jobInsert(sql, {
    name,
    priority: priority ?? 5,
    scheduledAt: scheduledAt ?? new Date(),
    handlerTimeout,
    data: data ?? {},
  });

  return Number(result?.id);
}

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
export async function queueWorkerRegisterCronJobs(event, sql, { jobs }) {
  eventStart(event, "queueWorker.registerCronJobs");

  await sql.begin(async (sql) => {
    // Obtain an exclusive lock for the live time of this transaction. This ensures that
    // processes trying to execute this lock will have to wait till this sync is done,
    // preventing conflicts and unnecessary inserts and updates.
    await query`SELECT pg_advisory_xact_lock(-9871233452)`.exec(sql);

    await queueWorkerRemoveUnknownCronJobs(sql, jobs);

    for (const job of jobs) {
      await queueWorkerUpsertCronJob(sql, job);
    }
  });

  eventStop(event);
}

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
export function queueWorkerCreate(sql, options) {
  /** @type {QueueWorkerInternalOptions} */
  // @ts-ignore
  const opts = { ...options, isQueueEnabled: true };
  opts.pollInterval = options.pollInterval ?? 1500;
  opts.parallelCount = options.parallelCount ?? 1;
  opts.maxRetryCount = options.maxRetryCount ?? 5;
  opts.handlerTimeout = options.handlerTimeout ?? 30 * 1000;
  opts.unsafeIgnoreSorting = options.unsafeIgnoreSorting ?? false;

  const logger = newLogger({
    ctx: {
      type: "queue",
    },
  });

  const where = {};
  if (opts.includedNames) {
    where.nameIn = opts.includedNames;
  } else if (opts.excludedNames) {
    where.nameNotIn = opts.excludedNames;
  }

  const orderBy = opts.unsafeIgnoreSorting
    ? undefined
    : query`"priority", "scheduledAt"`;

  const workers = Array.from({ length: opts.parallelCount }).map(() => ({
    currentPromise: Promise.resolve(),
  }));

  return {
    start() {
      logger.info({
        message: "Starting queue",
        workers: workers.length,
        pollInterval: opts.pollInterval,
      });

      opts.isQueueEnabled = true;

      workers.map((it) =>
        queueWorkerRun(logger, sql, opts, where, orderBy, it),
      );
    },
    async stop() {
      logger.info({
        message: "Stopping queue",
        workers: workers.length,
      });

      opts.isQueueEnabled = false;
      await Promise.all(workers.map((it) => it.currentPromise));
    },
  };
}

/**
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerCronOptions["jobs"]} jobs
 */
async function queueWorkerRemoveUnknownCronJobs(sql, jobs) {
  await queries.jobDelete(sql, {
    isComplete: false,
    $raw: query`j.data->>'jobType' =
    ${JOB_TYPE_CRON}`,
    nameNotIn: jobs.map((it) => it.name),
  });
}

/**
 * Try to update a cron job with the new expression and priority. Creates a new job if no
 * record is updated.
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerCronOptions["jobs"][0]} job
 * @returns {Promise<void>}
 */
async function queueWorkerUpsertCronJob(sql, job) {
  const nextValue = cron
    .parseExpression(job.cronExpression, {
      utc: true,
    })
    .next()
    .toDate();

  // @ts-ignore
  const [updated] = await queries.jobUpdate(sql, {
    update: {
      data: {
        $set: {
          path: ["cronExpression"],
          value: job.cronExpression,
        },
      },
      scheduledAt: nextValue,
      priority: job.priority ?? 4,
    },
    where: {
      name: job.name,
      isComplete: false,
    },
    returning: ["id"],
  });

  if (isNil(updated?.id)) {
    await queries.jobInsert(sql, {
      name: job.name,
      priority: job.priority ?? 4,
      scheduledAt: nextValue,
      data: {
        jobType: JOB_TYPE_CRON,
        cronExpression: job.cronExpression,
        cronLastCompletedAt: new Date(),
      },
    });
  }
}

/**
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerInternalOptions} options
 * @param {import("./generated/common/types").StoreJobWhere} where
 * @param {import("../types/advanced-types").QueryPart|undefined} orderBy
 * @param {{currentPromise: Promise<void>}} worker
 */
function queueWorkerRun(logger, sql, options, where, orderBy, worker) {
  if (!options.isQueueEnabled) {
    return;
  }

  Promise.resolve(worker.currentPromise).then(() => {
    worker.currentPromise = sql
      .begin(async (sql) => {
        const [partialJob] = await queryParts
          .getJobToDo(where, orderBy)
          .exec(sql);

        if (!partialJob?.id) {
          return {
            didHandleJob: false,
          };
        }

        const [job] = await queryJob({
          where: {
            id: partialJob.id,
          },
        }).exec(sql);

        await queueWorkerExecuteJob(logger, sql, options, job);

        return {
          didHandleJob: true,
        };
      })
      .then(({ didHandleJob }) => {
        if (!didHandleJob) {
          worker.currentPromise = setTimeout(options.pollInterval);
        }

        return queueWorkerRun(logger, sql, options, where, orderBy, worker);
      });
  });
}

/**
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("postgres").Sql<{}>} sql
 * @param {QueueWorkerInternalOptions} options
 * @param {import("./generated/common/types").StoreJob} job
 */
async function queueWorkerExecuteJob(logger, sql, options, job) {
  const isCronJob = job.data?.jobType === JOB_TYPE_CRON;

  let handler = options.handler[job.name];
  // @ts-ignore
  const timeout =
    job.handlerTimeout ??
    (typeof handler === "function"
      ? options.handlerTimeout
      : handler?.timeout ?? options.handlerTimeout);
  let isJobComplete = false;

  // @ts-ignore
  if (handler?.handler) {
    // @ts-ignore
    handler = handler.handler;
  }

  if (!handler) {
    const log = isCronJob ? logger.error : logger.info;
    log({
      message: "No handler registered for the job.",
      job,
    });

    return;
  }

  const event = newEvent(
    newLogger({
      ctx: {
        type: "queue_handler",
        id: job.id,
        name: job.name,
        priority: job.priority,
      },
    }),

    // @ts-ignore
    AbortSignal.timeout(timeout),
  );

  try {
    // @ts-ignore
    await sql.savepoint(async (sql) => {
      // @ts-ignore
      await handler(event, sql, job);
    });
    isJobComplete = true;
  } catch (e) {
    event.log.error({
      type: "job_error",
      scheduledAt: job.scheduledAt,
      retryCount: job.retryCount,
      error: AppError.format(e),
    });

    isJobComplete = job.retryCount + 1 >= options.maxRetryCount;

    await queries.jobUpdate(sql, {
      update: {
        isComplete: isJobComplete,
        retryCount: job.retryCount + 1,
      },
      where: {
        id: job.id,
      },
    });
  }

  if (isCronJob && isJobComplete) {
    const nextValue = cron
      .parseExpression(job.data.cronExpression, {
        utc: true,
      })
      .next()
      .toDate();

    await queries.jobInsert(sql, {
      name: job.name,
      priority: job.priority,
      scheduledAt: nextValue,
      data: {
        jobType: JOB_TYPE_CRON,
        cronExpression: job.data.cronExpression,
        cronLastCompletedAt: new Date(),
      },
    });
  }
}
