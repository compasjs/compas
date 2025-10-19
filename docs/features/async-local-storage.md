# Async Local Storage

Various features from Compas are also registered in an AsyncLocalStorage context, making
them job or api request aware. This document describes the different available systems and
how they integrate automatically or can be integrated manually.

## Logger

The stdlib provided [Logger](/features/logger-and-events.html) also exports a
`contextAwareLogger`. This logger is globally available and uses the logger that is
currently active via `asyncLocalStorageLogger`.

**Automatic integrations**:

- The logger is automatically populated based on `ctx.log` in Koa Application.
- The logger is automatically populated based on `event.log` in the Queue worker handlers.

**Manual integration**:

```ts
import { asyncLocalStorageLogger } from "@compas/stdlib";

await asyncLocalStorageLogger.run({ log: newLogger() }, async () => {
	// Run async code here.
	contextAwareLogger.info("Hello world!");
});
```

## Further reading

- [Node.js docs on AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage).
