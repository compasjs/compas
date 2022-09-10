import { mainFn, newEvent } from "@compas/stdlib";
import {
  jobFileCleanup,
  jobFileGeneratePlaceholderImage,
  jobQueueCleanup,
  jobQueueInsights,
  jobSessionStoreCleanup,
  jobSessionStoreProcessLeakedSession,
  queueWorkerCreate,
  queueWorkerRegisterCronJobs,
} from "@compas/store";
import { initializeServices } from "../src/service.js";
import {
  bucketName,
  s3Client,
  serviceLogger,
  sql,
} from "../src/services/core.js";

mainFn(import.meta, main);

/**
 * Docs: https://compasjs.com/features/background-jobs.html
 *
 * @returns {Promise<void>}
 */
async function main() {
  await initializeServices();

  await queueWorkerRegisterCronJobs(newEvent(serviceLogger), sql, {
    jobs: [
      {
        name: "compas.queue.cleanup",
        cronExpression: "0 1 * * *",
      },
      {
        name: "compas.queue.insights",
        cronExpression: "0 * * * *",
      },
      {
        name: "compas.file.cleanup",
        cronExpression: "0 2 * * *",
      },
      {
        name: "compas.sessionStore.cleanup",
        cronExpression: "0 2 * * *",
      },
    ],
  });

  const queueWorker = queueWorkerCreate(sql, {
    parallelCount: 3,
    handler: {
      // Queue related jobs
      "compas.queue.cleanup": jobQueueCleanup({ queueHistoryInDays: 5 }),
      "compas.queue.insights": jobQueueInsights(),

      // Session related jobs
      "compas.sessionStore.cleanup": jobSessionStoreCleanup({
        maxRevokedAgeInDays: 14,
      }),
      "compas.sessionStore.potentialLeakedSession":
        jobSessionStoreProcessLeakedSession({}),

      // File related jobs
      "compas.file.cleanup": jobFileCleanup(s3Client, bucketName),
      "compas.file.generatePlaceholderImage": jobFileGeneratePlaceholderImage(
        s3Client,
        bucketName,
      ),
    },
  });

  queueWorker.start();
}
