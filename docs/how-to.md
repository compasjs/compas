# How to

A number of examples of how to utilise the functionalities provided by `@lbu/*`.
The How To's mention default arguments, ready to run examples and some possible
edge cases.

## Process entrypoint

Use the `mainFn` provided by `@lbu/stdlib` to run a function when the file is
the program entrypoint.

<!-- prettier-ignore -->
[process-entrypoint](_media/howto/process-entrypoint.js ':include :type=code :fragment=snippet')

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

## Execute Process

There are two ways to execute a program or `child_process` provided by
`@lbu/stdlib`:

- Exec, a promisified version of
  [`child_process#exec`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)

<!-- prettier-ignore -->
[execute-process](_media/howto/execute-process.js ':include :type=code :fragment=exec')

- Spawn, a promisified version of
  [`child_process#spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

<!-- prettier-ignore -->
[execute-process](_media/howto/execute-process.js ':include :type=code :fragment=spawn')

By default `{ stdio: "inherit" }` is passed to `spawn` which means that all of
stdin, stdout and stderr are passed to the spawned process.

Use `exec` when further processing of stdout and stdin is needed or when you
want to ignore any output. Use `spawn` in other cases.
