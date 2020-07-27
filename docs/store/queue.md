# Job Queue

@lbu/store also comes with a Postgres backed queue implementation. The queue
supports the following:

- First In, First Out job handling
- Prioritize jobs
- Schedule jobs for execution in the future
- Run workers for specific jobs

Example usage:

```javascript
mainFn(import.meta, log, main);

async function main() {
  const sql = await newPostgresConnection();

  const jobHandler = async (sql, data) => {
    console.log(data.name); // "myJob"

    // simulate work
    await new Promise((r) => setTimeout(r, 100));
  };

  // parallelCount shouldn't be higher than Postgres pool size
  const queueWorker = new JobQueueWorker(sql, "myJob", {
    parallelCount: 5,
    pollInterval: 1500,
    handler: jobHandler,
  });

  // Start queue
  queueWorker.start();

  setInterval(() => {
    // Get current queue size
    queueWorker.pendingQueueSize().then(({ pendingCount, scheduledCount }) => {
      log.info({ pendingCount, scheduledCount });
    });
  }, 1500);

  setTimeout(() => {
    // running jobs are not cancelled
    // but no new job is started
    queueWorker.stop();
  }, 5000);

  // By default uses "myJob" as name
  await queueWorker.addJob({ data: {} });

  // Items with a lower priority value are prioritized, defaults to 0
  await queueWorker.addJob({ priority: 5, data: {} });

  // Add job with a different name
  await queueWorker.addJob({ name: "otherJob", data: {} });

  // Add job with scheduled time to run, defaults to immediately
  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 1); // Tomorrow
  await queueWorker.addJob({ scheduledAt, data: {} });

  // Returns a job id, so you can use it as a tracking id / use it as a foreign key
  const jobId = await queueWorker.addJob({ data: {} });

  // The same api is available in separate exported function, so you don't have to pass the queueWorker around
  const otherJobId = await addJobToQueue(sql, { name: "myJob", data: {} });

  // Get the average time to completion for jobs
  const start = new Date();
  start.setDate(start.getDate() - 1);
  const end = new Date();
  const average = await queueWorker.averageTimeToCompletion(start, end);
}
```
