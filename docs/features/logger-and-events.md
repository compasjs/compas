# Logger & events

::: tip

Requires `@compas/stdlib` to be installed

:::

## Logger

Although the stdlib package exports more than just a logger, this document will focus on
the logger.

### API

Provided by `@compas/stdlib`

#### newLogger

This function constructs a new logger. It accepts an optional context object that is
included in each log line for that logger. A log formatter is automatically configured
based on the environment that your application is running in. If `NODE_ENV` is set to
`development` a pretty printer will be used else it defaults to newline delimited json.
Which boils down to a single stringified json object per log call.

Parameters:

- `options`:
  - `ctx` (object): Any context to add to log lines. This value is copied immediately on
    logger creation, so changes made via a reference, will not be reflected.

::: tip

Make sure to have a `.env` file with `NODE_ENV=development` in it for local development so
log lines are readable.

:::

A logger is a plain JavaScript object with 2 functions:

**info** and **error**:

The info and error function accept a single argument that is logged. This happens in a
single `write` call when pretty printing or not.

### loggerExtendGlobalContext

An application is able to gradually add more information to the shared context used by
loggers. All properties added via this function will end up in each log line like the
`ctx` option of `newLogger`. You can still overwrite values via the `ctx` option of
`newLogger`. The added properties will only show up in loggers created after calling this
function.

### loggerSetGlobalDestination

The logger uses [Pino](https://getpino.io) under the hood, and thus is able to use its
[`destination`](https://getpino.io/#/docs/api?id=destination) and
[`transport`](https://getpino.io/#/docs/api?id=pino-transport) system. This affects all
loggers created via `newLogger` after setting a new destination.

### On log levels and processing

Log levels are used to get some ranking based on importance in your log lines. Compas only
knows 2 log levels: info and error. A log line is either important enough to warn you, or
it is not. By simplifying this decision, you can spend a bit more time deciding if you
really need to log that information or not.

There is much more information in logs than just the contrasting error- and info-'level',
however this always requires further processing. Compas prefers that this happens outside
the current process. That is why by default we write everything to `stdout`. To
accommodate processing, every log line is a valid JSON string, also called newline
delimited JSON or NDJSON for short. The log line is structured as follows:

```json5
// Created with `log.info({ hello: "world" });`
{
	// The log level, either 'info' or 'error'
	level: "info",
	// Milliseconds since the unix epoch
	time: 1634375371114,
	// The `ctx` that is passed in `newLogger`
	// In this case the default by `mainFn` from `@compas/stdlib`
	context: {
		// File name without extension
		type: "api",
		// Value of process.env.APP_NAME, see environment variable docs
		application: "compas",
	},
	// The value passed in to the log function
	// So can be an object, array, string, boolean, ...
	message: {
		hello: "world",
	},
}
```

The log-processor can take these lines and do whatever is needed to check on 'indirect'
errors like a spike of unauthorized requests.

## Events

Events are used for manually tracing call stacks. This way you can check how long your
async functions took to run or analyze how often some route is called.

Events are created with `newEvent(logger)`, most of the time you are not constructing that
event or logger your self, but use some of the provided events:

- `newTestEvent(t)` in tests
- `ctx.event` in server middleware
- `event` as the first argument passed in to queue functions

Let's check an example of a function that expects an event:

```js
/**
 * Add a & b, but before returning wait for a random amount of time
 *
 * @param {InsightEvent} event
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
async function addWithWait(event, a, b) {
	eventStart(event, "add");

	const result = a + b;
	await asyncSleep(Math.random() * 100); // Wait between 0 & 100 milliseconds

	// Always the last statement before the return statement
	eventStop(event);

	return result;
}
```

As you can see we can use `eventStart` and `eventStop` to wrap our function body. We can
also create 'sub-events' to follow the nested callstack. It looks something like:

```js
function fooAdd(event, a, b) {
	eventStart(event, "foo.add");

	const result = fooAddAll(newEventFromEvent(event), a, b);

	eventStop(event);

	return result;
}

function fooAddAll(event, ...args) {
	eventStart(event, "foo.addAll");

	const result = args.reduce((sum, next) => sum + next, 0);

	eventStop(event);

	return result;
}
```

When `eventStop` is called on the 'root-event' i.e the event created by `newEvent`, it
will automatically log the callstack via its logger. That will look something like:

```txt
11:11:13.390 info[script_name] {
  type: 'event_callstack',
  aborted: false,
  callStack: [
    {
      type: 'start',
      name: 'foo.add',
      time: 1630401073390,
      duration: 0
    },
    [
      {
        type: 'start',
        name: 'foo.addAll',
        time: 1630401073390,
        duration: 0
      },
      { type: 'stop', name: 'foo.addAll', time: 1630401073390 }
    ],
    { type: 'stop', name: 'foo.add', time: 1630401073390 }
  ]
}
```

As you can see, both `foo.add` and `foo.addAll` events took 0 milliseconds. This is why we
recommend only using events with async functions, as these most likely contain some
network / database calls.
