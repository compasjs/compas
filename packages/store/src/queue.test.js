import { mainTestFn, test } from "@lbu/cli";
import { isNil } from "@lbu/stdlib";
import { queries } from "./generated/index.js";
import { storeQueries } from "./generated/queries.js";
import {
  addRecurringJobToQueue,
  getNextScheduledAt,
  handleLbuRecurring,
  JobQueueWorker,
} from "./queue.js";
import {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./testing.js";

mainTestFn(import.meta);

test("store/queue", async (t) => {
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
  const handler = (sql, data) => {
    handlerCalls.push(data);
  };

  t.test("create a JobQueueWorker", async (t) => {
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
    const id = await qw.addJob({ name: "job1" });
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

    const id = await qw.addJob({ name: "job1", scheduledAt: d });
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
    await new Promise((r) => {
      setTimeout(r, 15);
    });
    qw.stop();
    await new Promise((r) => {
      setTimeout(r, 15);
    });
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

  t.test("destroy test db", async (t) => {
    await cleanupTestPostgresDatabase(sql);
    t.ok(true, "closed postgres connection");
  });
});

test("store/queue - recurring jobs ", async (t) => {
  let sql = undefined;

  t.test("create a test db", async (t) => {
    sql = await createTestPostgresDatabase();
    t.ok(!!sql);

    const result = await sql`
      SELECT 1 + 2 AS sum
    `;
    t.equal(result[0].sum, 3);
  });

  t.test("add recurring job to queue creates an lbu job", async (t) => {
    await addRecurringJobToQueue(sql, {
      name: "test",
      interval: { seconds: 1 },
    });
    const jobs = await sql`SELECT * FROM job WHERE name = 'lbu.job.recurring'`;
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
      const jobs = await sql`SELECT * FROM job WHERE name = 'lbu.job.recurring'`;
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
      const jobs = await sql`SELECT * FROM job WHERE name = 'lbu.job.recurring'`;
      t.equal(jobs.length, 2);
    },
  );

  t.test(
    "adding again once the job is completed, yields a new job",
    async (t) => {
      await sql`UPDATE job SET  "isComplete" = true WHERE data->>'name' = 'test'`;
      await addRecurringJobToQueue(sql, {
        name: "test",
        interval: { seconds: 1 },
      });
      const jobs = await sql`SELECT * FROM job WHERE name = 'lbu.job.recurring'`;
      t.equal(jobs.length, 3);
    },
  );

  t.test("cleanup jobs", async () => {
    await queries.jobDelete(sql);
  });

  t.test(
    "handleLbuRecurring should dispatch and create a new schedule job",
    async (t) => {
      const inputDate = new Date();
      await handleLbuRecurring(sql, {
        scheduledAt: new Date(),
        priority: 1,
        data: {
          name: "test",
          interval: {
            minutes: 1,
          },
        },
      });

      const [testJob] = await sql`SELECT * FROM job WHERE name = 'test'`;
      const [
        recurringJob,
      ] = await sql`SELECT * FROM job WHERE name = 'lbu.job.recurring'`;
      const count = await storeQueries.jobCount(sql);

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
