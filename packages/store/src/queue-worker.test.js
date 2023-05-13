import { setImmediate } from "node:timers/promises";
import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { AppError, isNil } from "@compas/stdlib";
import { sql } from "../../../src/testing.js";
import { queryJob } from "./generated/database/job.js";
import { queries } from "./generated.js";
import {
  queueWorkerAddJob,
  queueWorkerCreate,
  queueWorkerRegisterCronJobs,
} from "./queue-worker.js";

mainTestFn(import.meta);

test("store/queue-worker", (t) => {
  t.test("queueWorkerAddJob", (t) => {
    t.test("success", async (t) => {
      const jobId = await queueWorkerAddJob(sql, {
        name: "test",
        data: {
          bar: true,
        },
        priority: 8,
        handlerTimeout: 40,
        scheduledAt: new Date(),
      });

      const [job] = await queryJob({
        where: {
          id: jobId,
        },
      }).exec(sql);

      t.equal(job.name, "test");
      t.equal(job.isComplete, false);
      t.equal(job.handlerTimeout, 40);
    });
  });

  t.test("queueWorkerRegisterCronJobs", (t) => {
    const initialDefinition = [
      {
        name: "cron1",
        cronExpression: "* * * * *",
      },
      {
        name: "cron2",
        cronExpression: "* * * * *",
        priority: 3,
      },
      {
        name: "cron3",
        cronExpression: "1 * * * *",
      },
    ];

    const removalDefinition = [
      {
        name: "cron1",
        cronExpression: "* * * * *",
      },
      {
        name: "cron3",
        cronExpression: "1 * * * *",
      },
    ];

    const upsertDefinition = [
      {
        name: "cron1",
        cronExpression: "1 * * * *",
      },
      {
        name: "cron3",
        cronExpression: "1 * * * *",
      },
    ];

    t.test("initial", async (t) => {
      await queueWorkerRegisterCronJobs(newTestEvent(t), sql, {
        jobs: initialDefinition,
      });

      const [cron1] = await queryJob({
        where: {
          name: "cron1",
        },
      }).exec(sql);

      const [cron2] = await queryJob({
        where: {
          name: "cron2",
        },
      }).exec(sql);

      const [cron3] = await queryJob({
        where: {
          name: "cron3",
        },
      }).exec(sql);

      t.equal(cron1.data.jobType, "compas.queue.cronJob");

      t.equal(cron1.priority, 4);
      t.equal(cron2.priority, 3);

      t.equal(cron1.data.cronExpression, "* * * * *");
      t.equal(cron3.data.cronExpression, "1 * * * *");
    });

    t.test("removal", async (t) => {
      await queueWorkerRegisterCronJobs(newTestEvent(t), sql, {
        jobs: removalDefinition,
      });

      const [cron1] = await queryJob({
        where: {
          name: "cron1",
        },
      }).exec(sql);

      const [cron2] = await queryJob({
        where: {
          name: "cron2",
        },
      }).exec(sql);

      const [cron3] = await queryJob({
        where: {
          name: "cron3",
        },
      }).exec(sql);

      t.ok(cron1);
      t.ok(isNil(cron2));
      t.ok(cron3);
    });

    t.test("upsert", async (t) => {
      await queueWorkerRegisterCronJobs(newTestEvent(t), sql, {
        jobs: upsertDefinition,
      });

      const [cron1] = await queryJob({
        where: {
          name: "cron1",
        },
      }).exec(sql);

      t.equal(cron1.data.cronExpression, "1 * * * *");
    });
  });

  t.test("queueWorkerCreate", (t) => {
    t.test("create", (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {},
      });

      t.equal(typeof qw.start, "function");
      t.equal(typeof qw.stop, "function");
    });
  });

  t.test("queueWorker - update - behavior", (t) => {
    const cleanQueue = () => {
      t.test("setup", async (t) => {
        await queries.jobDelete(sql, {
          $or: [{ isComplete: true }, { isComplete: false }],
        });

        t.pass();
      });
    };

    cleanQueue();

    t.test("success behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {
          test: () => {},
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(job.isComplete, true);
    });

    cleanQueue();

    t.test("no handler behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {},
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(job.isComplete, true);
    });

    cleanQueue();
    t.test("no job behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {},
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      t.pass();
    });

    cleanQueue();

    t.test("retry behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {
          test: () => {
            throw AppError.serverError({});
          },
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(job.isComplete, false);
      t.equal(job.retryCount, 1);
    });

    cleanQueue();

    t.test("max retry behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        maxRetryCount: 1,
        handler: {
          test: () => {
            throw AppError.serverError({});
          },
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(job.isComplete, true);
      t.equal(job.retryCount, 1);
    });

    cleanQueue();

    t.test("cron behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        handler: {
          test: (event, sql, job) => {
            t.ok(job.data.cronExpression);
            t.ok(job.data.cronLastCompletedAt);
          },
        },
      });

      await queueWorkerRegisterCronJobs(newTestEvent(t), sql, {
        jobs: [
          {
            name: "test",
            cronExpression: "* * * * *",
          },
        ],
      });

      await queries.jobUpdate(sql, {
        update: {
          scheduledAt: new Date(0),
        },
        where: {
          name: "test",
        },
      });

      const nextScheduledAt = new Date();
      nextScheduledAt.setMinutes(nextScheduledAt.getMinutes() + 1, 0, 0);

      qw.start();
      await setImmediate();
      await qw.stop();

      const [jobComplete] = await queryJob({
        where: { name: "test", isComplete: true },
      }).exec(sql);
      const [jobNotComplete] = await queryJob({
        where: {
          name: "test",
          isComplete: false,
        },
      }).exec(sql);

      t.equal(jobComplete.isComplete, true);
      t.equal(jobNotComplete.isComplete, false);

      t.equal(jobNotComplete.scheduledAt.getTime(), nextScheduledAt.getTime());
    });

    cleanQueue();
  });

  t.test("queueWorker - delete - behavior", (t) => {
    const cleanQueue = () => {
      t.test("setup", async (t) => {
        await queries.jobDelete(sql, {});

        t.pass();
      });
    };

    cleanQueue();

    t.test("success behavior", async (t) => {
      let calledTimes = 0;
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        handler: {
          test: () => {
            calledTimes += 1;
          },
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(calledTimes, 1);
      t.ok(isNil(job));
    });

    cleanQueue();

    t.test("no handler behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        handler: {},
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.ok(isNil(job));
    });

    cleanQueue();

    t.test("no job behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        handler: {},
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      t.pass();
    });

    cleanQueue();

    t.test("retry behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        handler: {
          test: () => {
            throw AppError.serverError({});
          },
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.equal(job.isComplete, false);
      t.equal(job.retryCount, 1);
    });

    cleanQueue();

    t.test("max retry behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        maxRetryCount: 1,
        handler: {
          test: () => {
            throw AppError.serverError({});
          },
        },
      });

      await queueWorkerAddJob(sql, {
        name: "test",
        scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
      });

      qw.start();
      await setImmediate();
      await qw.stop();

      const [job] = await queryJob({
        where: { name: "test" },
      }).exec(sql);

      t.ok(isNil(job));
    });

    cleanQueue();

    t.test("cron behavior", async (t) => {
      const qw = queueWorkerCreate(sql, {
        deleteJobOnCompletion: true,
        handler: {
          test: (event, sql, job) => {
            t.ok(job.data.cronExpression);
            t.ok(job.data.cronLastCompletedAt);
          },
        },
      });

      await queueWorkerRegisterCronJobs(newTestEvent(t), sql, {
        jobs: [
          {
            name: "test",
            cronExpression: "* * * * *",
          },
        ],
      });

      await queries.jobUpdate(sql, {
        update: {
          scheduledAt: new Date(0),
        },
        where: {
          name: "test",
        },
      });

      const nextScheduledAt = new Date();
      nextScheduledAt.setMinutes(nextScheduledAt.getMinutes() + 1, 0, 0);

      qw.start();
      await setImmediate();
      await qw.stop();

      const [jobComplete] = await queryJob({
        where: { name: "test", isComplete: true },
      }).exec(sql);
      const [jobNotComplete] = await queryJob({
        where: {
          name: "test",
          isComplete: false,
        },
      }).exec(sql);

      t.ok(isNil(jobComplete));
      t.equal(jobNotComplete.isComplete, false);
      t.equal(jobNotComplete.scheduledAt.getTime(), nextScheduledAt.getTime());
    });

    cleanQueue();
  });
});
