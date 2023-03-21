# Background jobs

::: tip

Requires `@compas/store` to be installed

:::

The queue system is based on 'static' units of work to be done in the
background. It supports the following:

- Job priority's. Lower value means higher priority.
- Scheduling jobs at a set time
- Customizable handler timeouts
- Recurring job handling
- Concurrent workers pulling from the same queue
- Specific workers for a specific job

When to use which function of adding a job:

- `queueWorkerAddJob`: use the queue as background processing of defined units.
  Like converting a file to different formats, sending async or scheduled
  notifications. Jobs created will have a priority of '5'.
- `queueWorkerRegisterCronJobs`: use the queue for scheduled recurring jobs
  based on the specific `cronExpression`. Jos created will have a default
  priority of '4'.

Every job runs with a timeout. It is determined in the following order:

- Timeout of the specific job, via `handlerTimeout` property. Should be used
  sporadically
- Timeout of a specific handler as provided by the `handler` property.
- The `handlerTimeout` property of the QueueWorker

Jobs are picked up if the following criteria are met:

- The job is not complete yet
- The job's 'scheduledAt' property is in the past
- The job's 'retryCount' value is lower than the `maxRetryCount` option.

Eligible jobs are sorted in the following order:

- By priority ascending, so a lower priority value job will run first
- By scheduledAt ascending, so an earlier scheduled job will be picked before a
  later scheduled job.

If a job fails, by throwing an error, other jobs may run first before any
retries happen, based on the above ordering.

## API

Provided by `@compas/store`. A summary of the available functionality. See the
docs on these functions for more information and their accepted arguments.

### queueWorkerCreate

This function constructs a worker, applies the default options if no value is
provided and returns a `{ start, stop }` synchronously. `start` needs to be
called before any jobs are picked up. If you need to shutdown gracefully you can
use `await stop()`. This will finish all running jobs and prevent picking up new
jobs. See the `QueueWorkerOptions` as the second argument of this function for
all available options and their defaults.

### queueWorkerAddJob

Add a new job to the queue. The `name` option is mandatory. This function
returns the `id` of the inserted job.

### queueWorkerRegisterCronJobs

Register cron jobs to the queue. Any existing cron job not in this definition
will be removed from the queue, even if pending jobs exist. When the cron
expression of a job is changed, it takes effect immediately. The system won't
ever upgrade an existing normal job to a cron job. Note that your job may not be
executed on time. Use `job.data.cronLastCompletedAt` and
`job.data.cronExpression` to decide if you still need to execute your logic. The
provided `cronExpression` is evaluated in 'utc' mode.

[cron-parser](https://www.npmjs.com/package/cron-parser) is used for parsing the
`cronExpression`. If you need a different type of scheduler, use
`queueWorkerAddJob` manually in your job handler.

### jobQueueCleanup

A handler to remove jobs from the queue. The queue is the most performant when
old completed jobs are cleaned up periodically. The advised way to use this job
is the following:

- In `queueWorkerRegisterCronJobs`:
  `{ name: "compas.queue.cleanup", cronExpression: "0 1 * * *" }` to run this
  job daily at 1 AM.
- In your handler object:
  `{ "compas.queue.cleanup": jobQueueCleanup({ queueHistoryInDays: 5 }), }`

### jobQueueInsights

Get insights in the amount of jobs that are ready to be picked up (ie `pending`)
and how many jobs are scheduled at some time in the future. The advised way to
use this job is the following:

- In `queueWorkerRegisterCronJobs`:
  `{ name: "compas.queue.insights", cronExpression: "0 * * * *" }` to run this
  job every hour.
- In your handler object: `{ "compas.queue.insights": jobQueueInsights(), }`

## Other @compas/store jobs

### jobFileCleanup

When you delete a file via `queries.fileDelete` the file is not removed from the
underlying bucket. To do this `syncDeletedFiles` is necessary. This job does
that.

- In `queueWorkerRegisterCronJobs`:
  `{ name: "compas.file.cleanup", cronExpression: "0 2 * * *" }` to run this job
  daily at 2 AM.
- In your handler object:
  `{ "compas.file.cleanup": jobFileCleanup(s3Client, "bucketName"), }`

### jobFileGeneratePlaceholderImage

When you create a file via `createOrUpdateFile` you have to the option to let it
create a job to generate a placeholder image. This is a 10px wide JPEG that is
stored on the file object, to support things like
[Next.js Image `blurDataUrl`](https://nextjs.org/docs/api-reference/next/image#blurdataurl).

- In your handler object:
  `{ "compas.file.generatePlaceholderImage": jobFileGeneratePlaceholderImage(s3Client, "bucketName"), }`

### jobFileTransformImage

When you send files with `fileSendTransformedImageResponse`, it adds this job
when a not yet transformed option combination is found. This job transforms the
image according to the requested options.

- In your handler object:
  `{ "compas.file.transformImage": jobFileTransformImage(s3Client), }`

### jobSessionStoreCleanup

Revoked and expired sessions of the session store are not automatically removed.
This job does exactly that.

- In `queueWorkerRegisterCronJobs`:
  `{ name: "compas.sessionStore.cleanup", cronExpression: "0 2 * * *" }` to run
  this job daily at 2 AM.
- In your handler object:
  `{ "compas.sessionStore.cleanup": jobSessionStoreCleanup({ maxRevokedAgeInDays: 14 }), }`

### jobSessionStoreProcessLeakedSession

Process re ported leaked sessions. These jobs occur when the session store finds
that refresh token is used multiple times. The job is able to either process the
leaked session in to a report and log it via
`type: "sessionStore.leakedSession.report"` or is able to dump the raw session
information via `type: "sessionStore.leakedSession.dump"`

- In your handler object:
  `{ "compas.sessionStore.potentialLeakedSession": jobSessionStoreCleanup({ maxRevokedAgeInDays: 14 }), }`
