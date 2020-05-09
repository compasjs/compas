import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { JobQueueWorker, newPostgresConnection } from "@lbu/store";

mainFn(import.meta, log, main);

async function main() {
  const sql = await newPostgresConnection();

  // parallelCount shouldn't be higher than Postgres pool size
  const queueWorker = new JobQueueWorker(sql, {
    handler,
  });

  // Start queue
  queueWorker.start();
}

async function handler(sql, job) {
  log.info(job);
}
