import { setImmediate } from "node:timers/promises";
import * as Sentry from "@sentry/node";
import axios from "axios";
import { sql, testSentryEnvelopes } from "../src/testing.js";
import { mainTestFn, test } from "@compas/cli";
import { closeTestApp, createTestAppAndClient, getApp } from "@compas/server";
import { AppError, newLogger, uuid } from "@compas/stdlib";
import { queueWorkerAddJob, queueWorkerCreate } from "@compas/store";

mainTestFn(import.meta);

/**
 * Flush Sentry and return all sent spans with their attribute values unwrapped.
 *
 * @returns {Promise<Array<{
 *   name: string,
 *   span_id: string,
 *   is_segment: boolean,
 *   attributes: Record<string, any>,
 * }>>}
 */
async function flushAndCollectSpans() {
  await Sentry.flush(2000);

  const spans = [];
  for (const [, items] of testSentryEnvelopes) {
    for (const [header, payload] of items) {
      if (header.type !== "span") {
        continue;
      }

      for (const span of payload.items) {
        spans.push({
          ...span,
          attributes: Object.fromEntries(
            Object.entries(span.attributes ?? {}).map(([key, it]) => [
              key,
              it.value,
            ]),
          ),
        });
      }
    }
  }

  return spans;
}

/**
 * Flush Sentry and return all sent logs with their attribute values unwrapped.
 *
 * @returns {Promise<Array<{
 *   level: string,
 *   body: string,
 *   attributes: Record<string, any>,
 * }>>}
 */
async function flushAndCollectLogs() {
  await Sentry.flush(2000);

  const logs = [];
  for (const [, items] of testSentryEnvelopes) {
    for (const [header, payload] of items) {
      if (header.type !== "log") {
        continue;
      }

      for (const log of payload.items) {
        logs.push({
          ...log,
          attributes: Object.fromEntries(
            Object.entries(log.attributes ?? {}).map(([key, it]) => [
              key,
              it.value,
            ]),
          ),
        });
      }
    }
  }

  return logs;
}

/**
 * @param {string} message
 * @returns {Promise<number>}
 */
async function flushAndCountCapturedErrors(message) {
  await Sentry.flush(2000);

  let count = 0;
  for (const [, items] of testSentryEnvelopes) {
    for (const [header, payload] of items) {
      if (
        header.type === "event" &&
        payload.exception?.values?.some((it) => it.value === message)
      ) {
        count++;
      }
    }
  }

  return count;
}

test("sentry", (t) => {
  const routePath = `/sentry/${uuid()}/:id`;
  const unexpectedErrorMessage = uuid();
  const expectedErrorKey = `sentry.${uuid()}`;

  const app = getApp();
  const client = axios.create();

  app.use(async (ctx, next) => {
    if (ctx.path.startsWith("/sentry/")) {
      ctx.matchedRoute = { name: "router.sentry.single", path: routePath };
      await sql`SELECT 1 AS "sentryTest"`;

      ctx.body = {};
    } else if (ctx.path === "/unexpected-error") {
      throw new Error(unexpectedErrorMessage);
    } else if (ctx.path === "/expected-error") {
      throw AppError.validationError(expectedErrorKey);
    } else if (ctx.path === "/unmatched") {
      ctx.body = {};
    }

    return next();
  });

  t.test("create test app", async (t) => {
    await createTestAppAndClient(app, client);
    t.pass();
  });

  t.test("request span is named after the matched route", async (t) => {
    await client.get(`/sentry/${uuid()}/5`);

    const spans = await flushAndCollectSpans();
    const segment = spans.find(
      (it) => it.attributes["http.route"] === routePath,
    );

    t.equal(segment?.name, `GET ${routePath}`);
    t.equal(segment?.is_segment, true);
    t.equal(segment?.attributes["sentry.op"], "http.server");
    t.equal(segment?.attributes["sentry.segment.name.source"], "route");
    t.equal(segment?.attributes["compas.route"], "router.sentry.single");
  });

  t.test("queries in a request are traced without a loader", async (t) => {
    const spans = await flushAndCollectSpans();
    const segment = spans.find(
      (it) => it.attributes["http.route"] === routePath,
    );
    const querySpan = spans.find(
      (it) =>
        it.attributes["sentry.segment.id"] === segment?.span_id &&
        it.attributes["db.query.text"]?.includes(`"sentryTest"`),
    );

    t.equal(querySpan?.attributes["sentry.op"], "db");
    t.equal(querySpan?.attributes["db.system.name"], "postgres");
    t.equal(
      querySpan?.attributes["sentry.segment.name"],
      `GET ${routePath}`,
      "the route is known before the query ends",
    );
  });

  t.test("middleware doesn't add spans to the request", async (t) => {
    const spans = await flushAndCollectSpans();
    const segment = spans.find(
      (it) => it.attributes["http.route"] === routePath,
    );

    t.ok(segment);
    t.equal(
      spans.filter(
        (it) =>
          it.attributes["sentry.segment.id"] === segment?.span_id &&
          it.attributes["sentry.op"] === "middleware",
      ).length,
      0,
    );
  });

  t.test("unmatched requests are not given a route", async (t) => {
    await client.get("/unmatched");

    const spans = await flushAndCollectSpans();
    const segment = spans.find(
      (it) => it.is_segment && it.attributes["url.path"] === "/unmatched",
    );

    t.ok(segment);
    t.equal(segment?.attributes["compas.route"], undefined);
  });

  t.test("unexpected errors are captured once", async (t) => {
    await client.get("/unexpected-error").catch(() => {});

    t.equal(await flushAndCountCapturedErrors(unexpectedErrorMessage), 1);
  });

  t.test("expected errors are not captured", async (t) => {
    await client.get("/expected-error").catch(() => {});

    await Sentry.flush(2000);
    const isCaptured = testSentryEnvelopes.some(([, items]) =>
      items.some(
        ([header, payload]) =>
          header.type === "event" &&
          JSON.stringify(payload).includes(expectedErrorKey),
      ),
    );

    t.equal(isCaptured, false);
  });

  t.test("string log messages are used as the log body", async (t) => {
    const message = uuid();
    newLogger({ ctx: { type: "sentry-test" } }).info(message);

    const logs = await flushAndCollectLogs();

    t.ok(logs.some((it) => it.level === "info" && it.body === message));
  });

  t.test("structured log messages refer to the attributes", async (t) => {
    const id = uuid();
    newLogger({ ctx: { type: "sentry-test" } }).error({ id });

    const logs = await flushAndCollectLogs();
    const log = logs.find(
      (it) =>
        typeof it.attributes.message === "string" &&
        it.attributes.message.includes(id),
    );

    t.equal(log?.level, "error");
    t.equal(log?.body, "See attributes");
  });

  t.test("close test app", async (t) => {
    await closeTestApp(app);
    t.pass();
  });

  t.test("queue jobs get their own root span", async (t) => {
    const jobName = `sentry.${uuid()}`;
    const qw = queueWorkerCreate(sql, {
      includedNames: [jobName],
      handler: {
        [jobName]: async (event, sql) => {
          await sql`SELECT 1 AS "sentryJobTest"`;
        },
      },
    });

    const jobId = await queueWorkerAddJob(sql, {
      name: jobName,
      scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
    });

    qw.start();
    await setImmediate();
    await qw.stop();

    const spans = await flushAndCollectSpans();
    const segment = spans.find(
      (it) => it.attributes["messaging.destination.name"] === jobName,
    );

    t.equal(segment?.name, jobName);
    t.equal(segment?.is_segment, true);
    t.equal(segment?.attributes["sentry.op"], "queue.process");
    t.equal(segment?.attributes["messaging.message.id"], String(jobId));
    t.equal(segment?.attributes["messaging.message.retry.count"], 0);
    t.equal(segment?.attributes["compas.job.is_cron"], false);
    t.ok(
      spans.some(
        (it) =>
          it.attributes["sentry.segment.id"] === segment?.span_id &&
          it.attributes["db.query.text"]?.includes(`"sentryJobTest"`),
      ),
    );
  });

  t.test("unexpected job errors are captured", async (t) => {
    const jobName = `sentry.${uuid()}`;
    const message = uuid();
    const qw = queueWorkerCreate(sql, {
      includedNames: [jobName],
      handler: {
        [jobName]: () => {
          throw new Error(message);
        },
      },
    });

    await queueWorkerAddJob(sql, {
      name: jobName,
      scheduledAt: new Date(new Date().getTime() - sql.systemTimeOffset),
    });

    qw.start();
    await setImmediate();
    await qw.stop();

    t.equal(await flushAndCountCapturedErrors(message), 1);
  });
});
