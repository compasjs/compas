import { mainTestFn, test } from "@lbu/cli";
import { isNil } from "@lbu/stdlib";
import { JobQueueWorker } from "./queue.js";
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

    const result = await sql`SELECT 1 + 2 AS sum`;
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
