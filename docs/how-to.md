# How to

A number of examples of how to utilise the functionalities provided by `@lbu/*`.
The How To's mention default arguments, ready to run examples and some possible
edge cases.

## Process entrypoint

Use the `mainFn` provided by `@lbu/stdlib` to run a function when the file is
the program entrypoint.

<--- howto-entrypoint -->

```js
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, (logger) => {
  logger.info("Process entrypoint running.");
});
```

`<--- howto-entrypoint -->

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

## Testing

Lbu comes with its own test runner loosely inspired by
[tape](https://github.com/substack/tape). It comes with a few assertions, async
testing, and the possibility of doing sub tests. `AssertionErrors` by using
Node.js builtin [assert](https://nodejs.org/api/assert.html) -module are handled
as well.

### Basic test file

A basic test file looks like the following:

<--- howto-test-basic -->

```js
test("my test", (t) => {
  t.equal(1, 1);
  t.ok(true);
  t.notOk(false);
  t.notEqual("foo", "bar");
  t.deepEqual([1, 2], [1, 2]);
});
```

`<--- howto-test-basic -->

### Running tests

There are two ways to run tests. The short way is to use `yarn lbu test` which
will run all test files in your project. There is also the option to run a test
file directly like `node ./file.test.js` or `yarn lbu run ./file.test.js`.
However, to do this you need to add the following to your test file:

```js
import { mainTestFn } from "@lbu/cli";

mainTestFn(import.meta);
```

This works based on `mainFn` as explained in
[Process entrypoint](#process-entrypoint)

### Setup and teardown per test file

Most test runners have a special global function that runs before or after all
tests in a single file. This is often called `beforeAll` / `afterAll`. We don't
need this in the lbu provided test runner as all tests run in the order they are
specified.

<--- howto-test-setup-teardown -->

```js
test("setup and teardown", (t) => {
  let myTestGlobal = undefined;

  // Every callback function can be async
  t.test("setup", async () => {
    myTestGlobal = 10;
  });

  t.test("my test global is there", (t) => {
    t.equal(myTestGlobal, 10);
  });

  // In this example not necessary since myTestGlobal will
  // be out of scope for all other code
  t.test("teardown", (t) => {
    myTestGlobal = undefined;
    t.pass("successful teardown");
  });
});
```

`<--- howto-test-setup-teardown -->

### Asserting on throws

Asserting on throws is another overlooked part of some test runners. This test
runner does not provide any fancy util like `t.throws(functionThatThrows)`, but
expects the user to use normal control flow like try / catch.

<--- howto-test-pass-fail -->

```js
const throws = async () => {
  throw new Error("Oops!");
};

const doesNotThrow = () => {};

test("Throws vs not throws", async (t) => {
  try {
    await throws();
    t.fail(`The 'throws' function should have thrown.`);
  } catch (e) {
    t.equal(e.message, "Oops!");
  }

  try {
    doesNotThrow();
    t.pass("The function did not throw!");
  } catch (e) {
    t.fail(`The 'doesNotThrow' function did throw.`);

    // A logger from @lbu/insight is available
    t.log.error(e);
  }
});
```

`<--- howto-test-pass-fail -->

### Test configuration

Test configuration is auto loaded from `{root}/test/config.js`. An example with
the defaults is below:

```js
// Individual test timeout, i.e. the function provided to `test` and `t.test`
export const timeout = 2500;

export async function setup() {
  // Global setup function
}

export async function teardown() {
  // Global teardown function
}
```

Timeout is also configurable for subtests via `t.timeout` like so:

<--- howto-test-timeout -->

```js
test("configurable timeout", (t) => {
  t.timeout = 20;

  t.test("race with the timeout", async (t) => {
    try {
      await new Promise((resolve) => {
        // No exception happening here
        setTimeout(() => {
          resolve();
        }, 5);
      });
      t.pass("subtest is faster than the parent timeout of 20 milliseconds");
    } catch (e) {
      t.fail("This should not trigger");
      t.log.error(e);
    }
  });
});
```

`<--- howto-test-timeout -->

## Execute Process

There are two ways to execute a program or `child_process` provided by
`@lbu/stdlib`:

- Exec, a promisified version of
  [`child_process#exec`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)

<--- howto-exec -->

```js
const { stdout, stderr, exitCode } = await exec("echo 'foo'");
// stdout => "foo\n"
// stderr => ""
// exitCode => 0
```

`<--- howto-exec -->

- Spawn, a promisified version of
  [`child_process#spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

<--- howto-spawn -->

```js
const { exitCode } = await spawn("echo", ["bar"]);
// Outputs "bar\n" on stdout
// exitCode => 0
```

`<--- howto-spawn -->

By default `{ stdio: "inherit" }` is passed to `spawn` which means that all of
stdin, stdout and stderr are passed to the spawned process.

Use `exec` when further processing of stdout and stdin is needed or when you
want to ignore any output. Use `spawn` in other cases.
