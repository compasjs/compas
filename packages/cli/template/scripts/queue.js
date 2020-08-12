import { mainFn } from "@lbu/stdlib";
import { JobQueueWorker } from "@lbu/store";
import { injectServices } from "../src/service.js";
import { sql } from "../src/services/index.js";

mainFn(import.meta, main);

async function main(logger) {
  await injectServices();

  // parallelCount shouldn't be higher than Postgres pool size
  const queueWorker = new JobQueueWorker(sql, {
    handler: (sql, job) => handler(logger, sql, job),
  });

  // Start queue
  queueWorker.start();
}

/**
 * @param {Logger} logger
 * @param sql
 * @param job
 */
async function handler(logger, sql, job) {
  logger.info(job);
}
