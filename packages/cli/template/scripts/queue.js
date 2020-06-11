import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { JobQueueWorker } from "@lbu/store";
import { injectServices } from "../src/service.js";
import { sql } from "../src/services/index.js";

mainFn(import.meta, log, main);

async function main() {
  await injectServices();

  // parallelCount shouldn't be higher than Postgres pool size
  const queueWorker = new JobQueueWorker(sql, {
    handler,
  });

  // Start queue
  queueWorker.start();
}

/**
 * @param sql
 * @param job
 */
async function handler(sql, job) {
  log.info(job);
}
