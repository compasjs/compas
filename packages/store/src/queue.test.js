import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { eventStart, eventStop } from "@compas/insight";
import { AppError, isNil } from "@compas/stdlib";
import { queries } from "./generated.js";
import {
  addEventToQueue,
  addJobToQueue,
  addJobWithCustomTimeoutToQueue,
  addRecurringJobToQueue,
  getNextScheduledAt,
  getUncompletedJobsByName,
  handleCompasRecurring,
  JobQueueWorker,
} from "./queue.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

const promiseSleep = (ms) =>
  new Promise((r) => {
    setTimeout(() => r(), ms);
  });

test("store/queue", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  /** @type {JobQueueWorker|undefined} */
  let qw = undefined;
  const handlerCalls = [];
  const handler = (event, sql, data) => {
    handlerCalls.push(data);
  };

  t.test("create a JobQueueWorker", (t) => {
    qw = new JobQueueWorker(sql, {
      parallelCount: 1,
      pollInterval: 10,
      handler,
    });

    t.equal(handlerCalls.length, 0);
  });

  t.test("empty queue to start with", async (t) => {
    t.deepEqual(await qw.pendingQueueSize(), {
      pendingCount: 0,
      scheduledCount: 0,
    });
  });

  t.test("add normal job returns id", async (t) => {
    const id = await addJobToQueue(sql, { name: "job1" });
    t.ok(!isNil(id));
  });

  t.test("single job pending", async (t) => {
    t.deepEqual(await qw.pendingQueueSize(), {
      pendingCount: 1,
      scheduledCount: 0,
    });
  });

  t.test("add scheduled job returns id", async (t) => {
    const d = new Date();
    d.setSeconds(d.getSeconds() + 1);

    const id = await addJobToQueue(sql, { name: "job1", scheduledAt: d });
    t.ok(!isNil(id));
  });

  t.test("single job pending and single job scheduled", async (t) => {
    t.deepEqual(await qw.pendingQueueSize(), {
      pendingCount: 1,
      scheduledCount: 1,
    });
  });

  t.test("average time to job completion should be 0", async (t) => {
    const start = new Date();
    const end = new Date();
    start.setHours(start.getHours() - 1);

    t.equal(await qw.averageTimeToCompletion(start, end), 0);
  });

  t.test("quick start / stop sequence", async (t) => {
    qw.start();
    await promiseSleep(15);
    qw.stop();
    await promiseSleep(15);
    t.ok(!qw.isStarted);
  });

  t.test("single scheduled job pending", async (t) => {
    t.equal(handlerCalls.length, 1);
    t.deepEqual(await qw.pendingQueueSize(), {
      pendingCount: 0,
      scheduledCount: 1,
    });
  });

  t.test("average time to job completion should be over 0", async (t) => {
    const start = new Date();
    const end = new Date();
    start.setHours(start.getHours() - 1);

    t.ok((await qw.averageTimeToCompletion(start, end)) > 0);
  });

  t.test("on failure retryCount should be up", async (t) => {
    await queries.jobDelete(sql, {
      $or: [{ isComplete: true }, { isComplete: false }],
    });
    await addJobToQueue(sql, { name: "retryTestJob" });

    qw.jobHandler = (event, sql, job) => {
      eventStart(event, "test.handler");
      if (job.name === "retryTestJob") {
        throw AppError.serverError("oops");
      }
    };

    // Start a job manually
    qw.handleJob(0);
    await promiseSleep(20);

    const [job] = await queries.jobSelect(sql, { name: "retryTestJob" });

    t.equal(job.isComplete, false);
    t.equal(job.retryCount, 1);
  });

  t.test("on max retries, job should be completed", async (t) => {
    // Note that we use the setup of the previous function here as well
    qw.maxRetryCount = 1;
    // Start a job manually
    qw.handleJob(0);
    await promiseSleep(20);

    const [job] = await queries.jobSelect(sql, { name: "retryTestJob" });

    t.equal(job.isComplete, true);
    t.equal(job.retryCount, 2);
  });

  t.test("handler timeout", async (t) => {
    await addJobToQueue(sql, { name: "timeoutTest" });

    // Setup settings
    qw.handlerTimeout = 2;
    qw.maxRetryCount = 10;
    qw.jobHandler = async (event) => {
      eventStart(event, "test.handler");
      await promiseSleep(10);
      eventStop(event);
    };

    qw.handleJob(0);
    await promiseSleep(20);

    const [job] = await queries.jobSelect(sql, { name: "timeoutTest" });

    t.equal(job.isComplete, false);
    t.equal(job.retryCount, 1);

    // Immediate resolve handler, and 10ms handler timeout
    qw.jobHandler = () => {};
    qw.handlerTimeout = 10;

    qw.handleJob(0);
    await promiseSleep(20);

    const [dbJob] = await queries.jobSelect(sql, {
      name: "timeoutTest",
    });

    t.equal(dbJob.isComplete, true);
    t.equal(dbJob.retryCount, 1);
  });

  t.test("object job handler", async (t) => {
    // Setup settings
    qw.handlerTimeout = 10;
    qw.maxRetryCount = 10;
    qw.jobHandler = {
      "test.object.handler": async () => {
        await promiseSleep(5);
      },
      "test.object.handler2": {
        handler: async () => {
          await promiseSleep(11);
        },
        timeout: 15,
      },
    };

    await addJobToQueue(sql, { name: "test.object.handler" });
    qw.handleJob(0);
    await promiseSleep(10);

    await addJobToQueue(sql, { name: "test.object.handler2" });
    qw.handleJob(0);
    await promiseSleep(15);

    await addJobToQueue(sql, { name: "test.object.handler.missingKey" });
    qw.handleJob(0);
    await promiseSleep(5);

    const [job] = await queries.jobSelect(sql, { name: "test.object.handler" });
    t.equal(job.isComplete, true);

    const [job2] = await queries.jobSelect(sql, {
      name: "test.object.handler2",
    });
    t.equal(job2.isComplete, true);

    const [job3] = await queries.jobSelect(sql, {
      name: "test.object.handler.missingKey",
    });
    t.equal(job3.isComplete, true);

    t.log.info({
      job3,
      job2,
      job,
    });
  });

  t.test("addEventToQueue", async (t) => {
    const name = "event.test.add";
    const payload = { foo: true };
    const initialJobs = await getUncompletedJobsByName(sql);

    await addEventToQueue(sql, name, payload);
    const currentJobs = await getUncompletedJobsByName(sql);

    const job = currentJobs[name][initialJobs[name]?.length ?? 0];
    t.ok(job);
    t.equal(job.isComplete, false);
    t.equal(job.priority, 2);
    t.deepEqual(job.data, payload);
  });

  t.test("addJobToQueue", async (t) => {
    const name = "job.test.add";
    const payload = { foo: true };
    const initialJobs = await getUncompletedJobsByName(sql);

    await addJobToQueue(sql, {
      name,
      data: payload,
    });
    const currentJobs = await getUncompletedJobsByName(sql);

    const job = currentJobs[name][initialJobs[name]?.length ?? 0];
    t.ok(job);
    t.equal(job.isComplete, false);
    t.equal(job.priority, 5);
    t.deepEqual(job.data, payload);
  });

  t.test("addRecurringJobToQueue", async (t) => {
    const name = "job.recurring.test.add";
    const internalName = "compas.job.recurring";
    const initialJobs = await getUncompletedJobsByName(sql);

    await addRecurringJobToQueue(sql, {
      name,
      interval: {
        minutes: 1,
      },
    });
    const currentJobs = await getUncompletedJobsByName(sql);

    const job =
      currentJobs[internalName][initialJobs[internalName]?.length ?? 0];
    t.ok(job);
    t.equal(job.isComplete, false);
    t.equal(job.priority, 4);
    t.deepEqual(job.data, { name, interval: { minutes: 1 } });
  });

  t.test("addJobWithCustomTimeoutToQueue", async (t) => {
    const name = "job.test.add.recurring";
    const payload = { foo: true };
    const initialJobs = await getUncompletedJobsByName(sql);

    await addJobWithCustomTimeoutToQueue(
      sql,
      {
        name,
        data: payload,
      },
      100,
    );
    const currentJobs = await getUncompletedJobsByName(sql);

    const job = currentJobs[name][initialJobs[name]?.length ?? 0];
    t.ok(job);
    t.equal(job.isComplete, false);
    t.equal(job.priority, 5);
    t.equal(job.handlerTimeout, 100);
    t.deepEqual(job.data, payload);
  });

  t.test("destroy test db", async (t) => {
    qw.stop();
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});

test("store/queue - recurring jobs ", (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("add recurring job to queue creates an compas job", async (t) => {
    await addRecurringJobToQueue(sql, {
      name: "test",
      interval: { seconds: 1 },
    });
    const jobs = await sql`
      SELECT *
      FROM job
      WHERE
        name = 'compas.job.recurring'
    `;
    t.equal(jobs.length, 1);
    t.equal(jobs[0].data.name, "test");
  });

  t.test(
    "adding again with the same name does not yield a new job",
    async (t) => {
      await addRecurringJobToQueue(sql, {
        name: "test",
        interval: { seconds: 1 },
      });
      const jobs = await sql`
      SELECT *
      FROM job
      WHERE
        name = 'compas.job.recurring'
    `;
      t.equal(jobs.length, 1);
    },
  );

  t.test(
    "adding again with a different name does yield a new job",
    async (t) => {
      await addRecurringJobToQueue(sql, {
        name: "secondTest",
        interval: { seconds: 1 },
      });
      const jobs = await sql`
      SELECT *
      FROM job
      WHERE
        name = 'compas.job.recurring'
    `;
      t.equal(jobs.length, 2);
    },
  );

  t.test(
    "adding with a different priority and interval yields an updated job",
    async (t) => {
      await addRecurringJobToQueue(sql, {
        name: "secondTest",
        interval: { minutes: 1 },
        priority: 5,
      });
      const jobs = await sql`
             SELECT *
             FROM job
             WHERE
               name = 'compas.job.recurring'
           `;
      const secondTest = jobs.find((it) => it.data.name === "secondTest");

      t.deepEqual(secondTest.data.interval, { minutes: 1 });
      t.equal(secondTest.priority, 5);
    },
  );

  t.test(
    "adding again once the job is completed, yields a new job",
    async (t) => {
      await sql`
      UPDATE job
      SET
        "isComplete" = TRUE
      WHERE
        data ->> 'name' = 'test'
    `;
      await addRecurringJobToQueue(sql, {
        name: "test",
        interval: { seconds: 1 },
      });
      const jobs = await sql`
      SELECT *
      FROM job
      WHERE
        name = 'compas.job.recurring'
    `;
      t.equal(jobs.length, 3);
    },
  );

  t.test("cleanup jobs", async () => {
    await queries.jobDelete(sql);
  });

  t.test(
    "handleCompasRecurring should dispatch and create a new schedule job",
    async (t) => {
      const inputDate = new Date();
      await handleCompasRecurring(newTestEvent(t), sql, {
        scheduledAt: new Date(),
        priority: 1,
        data: {
          name: "test",
          interval: {
            minutes: 1,
          },
        },
      });

      const [testJob] = await sql`
             SELECT *
             FROM job
             WHERE
               name = 'test'
           `;
      const [recurringJob] = await sql`
             SELECT *
             FROM job
             WHERE
               name = 'compas.job.recurring'
           `;
      const count = await queries.jobCount(sql);

      t.equal(count, 2);

      t.ok(testJob);
      t.ok(recurringJob);

      t.equal(testJob.priority, 2);
      t.equal(recurringJob.priority, 1);

      t.deepEqual(recurringJob.data, {
        name: "test",
        interval: { minutes: 1 },
      });

      inputDate.setUTCMinutes(
        inputDate.getUTCMinutes() + 1,
        inputDate.getUTCSeconds(),
        0,
      );
      t.deepEqual(recurringJob.scheduledAt, inputDate);

      t.ok(testJob.scheduledAt.getTime() < inputDate.getTime());
    },
  );

  t.test(
    "handleCompasRecurring should recreate in to the future",
    async (t) => {
      const scheduledAt = new Date();
      scheduledAt.setUTCMinutes(scheduledAt.getUTCMinutes() - 15);
      await handleCompasRecurring(newTestEvent(t), sql, {
        scheduledAt,
        priority: 1,
        data: {
          name: "recreate_future_test",
          interval: {
            minutes: 1,
          },
        },
      });

      const [job] = await sql`
      SELECT *
      FROM "job"
      WHERE
        name = 'compas.job.recurring'
      AND data ->> 'name' = 'recreate_future_test'
    `;

      t.ok(job.scheduledAt > scheduledAt);
    },
  );

  t.test("getNextScheduledAt - use provided scheduledAt as a base", (t) => {
    const input = new Date();
    const result = getNextScheduledAt(input, {});

    input.setUTCMilliseconds(0);
    t.deepEqual(result, input);
  });

  t.test("getNextScheduledAt - adds year", (t) => {
    const input = new Date();
    const result = getNextScheduledAt(input, { years: 1 });

    input.setUTCFullYear(input.getUTCFullYear() + 1);
    input.setUTCMilliseconds(0);

    t.deepEqual(result, input);
  });

  t.test("getNextScheduledAt - adds hours", (t) => {
    const input = new Date();
    const result = getNextScheduledAt(input, { hours: 1, minutes: 5 });

    input.setUTCHours(input.getUTCHours() + 1, input.getUTCMinutes() + 5);
    input.setUTCMilliseconds(0);

    t.deepEqual(result, input);
  });

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});
