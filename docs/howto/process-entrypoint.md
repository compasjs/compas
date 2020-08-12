# Process entrypoint

Use the `mainFn` provided by `@lbu/stdlib` to run a function when the file is
the program entrypoint.

<!-- prettier-ignore -->
[process-entrypoint](../_media/howto/process-entrypoint.js ':include :type=code :fragment=snippet')

This function uses `import.meta` to check if this file is used as the
entrypoint. If for example `my-file.js` contained the above snippet,
`node my-file.js` would trigger the callback function, but importing it like
`import "./my-file.js"` would not call the function.

The second parameter is the function called when this file is the process
entrypoint. It gets a logger with the current file name as the first argument
and may return a Promise.

Before the callback is called, the `.env`-file from the current directory is
loaded.

Another side effect is that `unhandledRejections` and `unhandledExceptions` will
be logged and the process will be killed.
