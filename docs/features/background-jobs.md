# Background jobs

The queue system is based on 'static' units of work to be done in the
background. It supports the following:

- Job priority's. Lower value means higher priority.
- Scheduling jobs at a set time
- Customizable handler timeouts
- Recurring job handling
- Concurrent workers pulling from the same queue
- Specific workers for a specific job

When to use which function of adding a job:

- `addEventToQueue`: use the queue as an 'external' message bus to do things
  based on user flows, like sending an verification email on when registering.
  Jobs created will have a priority of '2'.
- `addJobToQueue`: use the queue as background processing of defined units. Like
  converting a file to different formats, sending async or scheduled
  notifications. Jobs created will have a priority of '5'.
- `addRecurringJobToQueue`: use the queue for recurring background processing,
  like cleaning up sessions, generating daily reports. The interval can be as
  low as a second. Jobs created will have a priority of '4'. This means the
  recurring jobs are by default more important than normal jobs. However there
  are no guarantees that jobs are running exactly on the time they are
  scheduled.
- `addJobWithCustomTimeoutToQueue`: when the unit of work is hard to define
  statically for the job. For example an external api that needs all information
  in a single call, but the amount of information is of value N. And N doesn't
  have any bounds and is only known when the job is created. However, this sort
  of still enforces that the unit of work is related to some other property to
  consistently calculate a custom timeout. These jobs have a priority of '5' by
  default.

The handler can be passed in, in 2 ways;

- A single handler dispatching over the different jobs in application code
- A plain JS object containing job names as strings, and handler with optional
  timeout as value.

The timeout of a created job overwrites the specific job timeout which
overwrites the 'handlerTimeout' option.

Note that a lower priority value means a higher priority.

## API

Provided by `@compas/store`.

See also:

- [`addEventToQueue`](https://compasjs.com/api/store.html#addeventtoqueue)
- [`addJobToQueue`](https://compasjs.com/api/store.html#addjobtoqueue)
- [`addRecurringJobToQueue`](https://compasjs.com/api/store.html#addrecurringjobtoqueue)
- [`addJobWithCustomTimeoutToQueue`](https://compasjs.com/api/store.html#addjobwithcustomtimeouttoqueue)

### JobQueueWorker

A class representing a worker. By default a JobQueueWorker handles all jobs,
however it is possible to have a specific worker for jobs with specific names.

**constructor()**:

Create a new JobQueueWorker instance.

Parameters:

- `sql`: A Postgres connection. The connection should not be in a transaction
  already.
- `name` (string): Optional name that this JobQueueWorker will filter the jobs
  on. If not necessary, argument can be skipped.
- `options`:

  - `pollInterval` (number): Interval in milliseconds that the worker should
    look for new jobs. Is only used if no job is found directly after completing
    a job. Defaults to 1500 milliseconds
  - `parallelCount` (number): The number of parallel jobs to take on. This
    number should not be higher than the amount of connections your sql instance
    may create. Defaults to 1.
  - `handlerTimeout` (number): The number of milliseconds the handler may run
    before it should be aborted. Note that only `newEventFromEvent` and
    `eventStart` check if an event is aborted by default. Defaults to 30
    seconds.
  - `handler` (function|object): The callback that is called on new jobs. If a
    job throws, the job is not marked as complete and retried most likely
    immediately. If an object is passed in it acts as a lookup table based on
    the job name. If no handler is found, the job will automatically pass. The
    object values may be just an handler or the following object:

    ```js
    const specifcHandlerSpecification = {
      handler: async (event, sql, job) => {},
      timout: 1400, // 1.4 seconds
    };
    ```

    The handler is called with the following parameters:

    - `event`: An @compas/stdlib event, which is aborted after the specified
      timeout. The event is already started and will be stopped by the job
      worker.
    - `sql`: A Postgres connection already in transaction. If the transaction is
      aborted, the job is not marked complete.
    - `job`: The job, containing `name`, `data`, `priority`, `scheduledAt`,
      `handlerTimeout`, `retryCount` and `createdAt` properties.

Returns a new `JobQueueWorker` instance that is not started yet.

**start()**:

Starts the worker if not already started. Returns synchronously.

**stop**:

Stops the worker if not already stopped. Already running jobs will finish, but
no new jobs will be picked up. Returns synchronously.

**pendingQueueSize()**:

Get the amount of pending jobs left. If `name` is passed in the constructor,
only pending jobs with the specified name will be returned.

Returns a promise that fulfills with an object.

- `pendingCount`: The amount of jobs to be done in the future
- `scheduledCount`: The amount of jobs that is waiting on an available worker
  now.

**averageTimeToCompletion()**:

Get the average time to job completion between the specified start and end
dates. If `name` is passed in the constructor, only jobs with the specified name
will calculated.

Parameters:

- `startDate` (Date): Date to filter jobs that completed after the specified
  timestamp.
- `endDate` (Date): Date to filter jobs that completed before the specified
  timestamp.

Returns a promise that fulfills with a number.

**Example**

```js
import { JobQueueWorker } from "@compas/store";

mainFn(import.meta, main);

async function main(logger) {
  const handler = (sql, { name, data }) => {
    if (name === "myImportantJob") {
      logger.info(data);
    } else {
      logger.error({
        message: "Unhandled job",
        name,
      });
    }
  };

  const worker = new JobQueueWorker(sql, {
    handler,
    parallelCount: 2,
  });

  worker.start();
  const startDate = new Date();
  const endDate = new Date();

  // Set startDate 3 days in the past
  startDate.setUTCDate(startDate.getUTCDate() - 3);

  logger.info({
    pendingQueueSize: await worker.pendingQueueSize(),
    averageTimeToCompletion: await worker.averageTimeToCompletion(
      startDate,
      endDate,
    ),
  });
  worker.stop();
}
```
