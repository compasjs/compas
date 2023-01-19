import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { isNil } from "@compas/stdlib";
import { sql } from "../../../src/testing.js";
import { queryJob } from "./generated/database/job.js";
import { queries } from "./generated.js";
import { jobQueueCleanup, jobQueueInsights } from "./queue-worker-jobs.js";

mainTestFn(import.meta);

test("store/queue-worker-jobs", (t) => {
  t.test("jobQueueCleanup", async (t) => {
    const twoDaysAgo = new Date();
    const fiveDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 1);

    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    fiveDaysAgo.setHours(fiveDaysAgo.getHours() - 1);

    const [twoDaysAgoInsert, fiveDaysAgoInsert] = await queries.jobInsert(sql, [
      {
        name: "test1",
        isComplete: true,
        scheduledAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
      {
        name: "test1",
        isComplete: true,
        scheduledAt: fiveDaysAgo,
        updatedAt: fiveDaysAgo,
      },
    ]);

    t.test("defaults", async (t) => {
      const handler = jobQueueCleanup();
      await handler(newTestEvent(t), sql, {});

      const jobs = await queryJob().exec(sql);

      t.ok(
        isNil(
          jobs.find((it) => Number(it.id) === Number(fiveDaysAgoInsert.id)),
        ),
      );
      t.ok(jobs.find((it) => Number(it.id) === Number(twoDaysAgoInsert.id)));
    });

    t.test("two days", async (t) => {
      const handler = jobQueueCleanup({
        queueHistoryInDays: 2,
      });
      await handler(newTestEvent(t), sql, {});

      const jobs = await queryJob().exec(sql);

      t.ok(
        isNil(
          jobs.find((it) => Number(it.id) === Number(fiveDaysAgoInsert.id)),
        ),
      );
      t.ok(
        isNil(jobs.find((it) => Number(it.id) === Number(twoDaysAgoInsert.id))),
      );
    });
  });

  t.test("jobQueueInsights", async (t) => {
    await queries.jobInsert(sql, [
      {
        name: "test",
        scheduledAt: new Date(0),
        isComplete: false,
      },
      {
        name: "test",
        scheduledAt: new Date(Date.now() + 1000000),
        isComplete: false,
      },
    ]);

    t.test("success", async (t) => {
      const handler = jobQueueInsights();
      await handler(newTestEvent(t), sql, {});

      t.pass();
    });

    t.test("teardown", async (t) => {
      await queries.jobDelete(sql, {
        $or: [{ isComplete: true }, { isComplete: false }],
      });

      t.pass();
    });
  });
});
