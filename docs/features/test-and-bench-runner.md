# Testing and benchmarking

::: tip

Requires `@compas/cli` to be installed

:::

## Testing

A project setup needs a test runner of course. Compas comes with its own test
runner loosely inspired by [tape](https://github.com/substack/tape). It comes
with a few assertions, async testing, and the possibility of doing nesting test
suites. `AssertionErrors` by using Node.js builtin
[assert](https://nodejs.org/api/assert.html) -module are handled as well.

### Basic test file

A basic test file looks like the following:

```js
import { test } from "@compas/cli";

test("my test", (t) => {
  t.equal(1, 1);
  t.ok(true);
  t.notOk(false);
  t.notEqual("foo", "bar");
  t.deepEqual([1, 2], [1, 2]);
});
```

### Running tests

There are two ways to run tests. The short way is to use `compas test` which
will run all test files in your project. It supports various flags like
`--with-logs` to enable all info-logs in your project. By default, the test
runner only logs errors. There is also the option to run a test file directly
like `node ./file.test.js` or `compas run ./file.test.js`. However, to do this,
you need to add the following to your test file:

```js
import { mainTestFn } from "@compas/cli";

mainTestFn(import.meta);
```

It works based on `mainFn` as explained in the
[cli page](/features/cli.html#mainfn). Running your test file like this, will
also enable all your logs.

### Setup and teardown per test file

Most test runners have a special global function that runs before or after all
tests in a single file. This is often called `beforeAll` / `afterAll`. We don't
need this in the compas provided test runner as all tests run in the order they
are specified.

```js
import { test, mainTestFn } from "@compas/cli";

mainTestFn(import.meta);

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

### Asserting on throws

Asserting on throws is another overlooked part of some test runners. This test
runner does not provide any fancy util like `t.throws(functionThatThrows)`, but
expects the user to use normal control flow like try / catch.

```js
const throws = async () => {
  throw new Error("Oops!");
};

const doesNotThrow = () => {};

test("Function that throws", async (t) => {
  try {
    await throws();
    // If the function doesn't throw, no assertion is done, which results in a test failure by the runner.
  } catch (e) {
    // A logger from @compas/stdlib is available
    t.log.error(e);
    t.equal(e.message, "Oops!");
  }
});

test("Function that does not throw", async (t) => {
  doesNotThrow();
  t.pass("The function did not throw!");
  // If the function does throw, the test runner catches the error and fails this test with the caught exception.
});
```

### Test configuration

Test configuration is auto loaded from `{root}/test/config.js`. An example with
the defaults is below:

```js
// Individual test timeout, i.e. the function provided to `test` and `t.test`
export const timeout = 2500;

// Relative or absolute directories that are ignored
export const ignoreDirectories = [];

export async function setup() {
  // Global setup function
}

export async function teardown() {
  // Global teardown function
}
```

Timeout is also configurable for subtests via `t.timeout` like so:

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

### API

Provided by `@compas/cli`

#### mainTestFn()

This marks a file as a test file and starts the test runner when a file is
executed directly as Node.js script. It is based on `mainFn` as explained in the
[cli page](/features/cli.html#mainfn).

There is only a single way to call this function, always:

```js
mainTestFn(import.meta);
```

This call may exists in all test files and does nothing when tests are executed
via `compas test`.

#### test(name, callback)

This is the only other directly exposed function of the test runner and is used
to register tests, also often called a test suite. The callback `t` contains the
functions and properties described below. The callback may be synchronous or
return a promise. Any uncaught exception thrown in the callback, will be caught
and results in a failed test.

Parameters:

- `name` (string): The test suite name
- `callback` (function): The test function

##### t.log

A logger instance provided by `@compas/stdlib`. See
[logger](/features/logger-and-events.html#logger) for more details.

##### t.timeout

A setter to configure the timeout of subtests registered via `t.test`. To
configure this value see [config](#config)

##### t.test(name, callback)

Subtests can be registered any number of levels deep with `t.test()`, the name
and callback work exactly the same as `test`.

All subtests are executed in the same order as they are registered and will
never run in parallel.

##### Assertions

**t.ok(value, msg?)**

Assert that the value passed in is 'truthy'. In JavaScript this is any value
except `null`, `undefined`, `false`, `""` and `0`.

**t.notOk(value, msg?)**

Assert that the value passed in is 'falsey'. In JavaScript this corresponds to
the following values: `null`, `undefined` , `false`, `""` and `0`.

**t.equal(value, expected, msg?)**

Assert that `value` is strict equal to `expected`.

Some examples:

```js
t.equal(true, true); // Pass
t.equal("foo", "foo"); // Pass

t.equal("foo", "bar"); // Fail
t.equal({}, {}); // Fail
```

**t.notEqual(value, notExpected, msg?)**

Assert that `value` is not strict equal to `expected`.

**t.pass(msg?)**

Signal to the test runner that an implicit assertion passed. This is often used
when testing control flow, like checking that a `catch` block is executed.

**t.fail(msg?)**

Signal to the test runner that an implicit assertion failed. This is also often
used when testing control flow. For example in the following example where the
function `willThrow` should really throw an error.

```js
mainTestFn(import.meta);

const willThrow = () => {
  throw new Error("Really did throw");
};

test("willThrow really throws", (t) => {
  try {
    willThrow();
    t.fail("willThrow did not throw.");
  } catch {
    t.pass("willThrow, did indeed throw an error.");
  }
});
```

Since the test runner enforces that each `test` or `t.test` should either do an
assertion or call `t.test`, the above is more idiomatically written as:

```js
mainTestFn(import.meta);

const willThrow = () => {
  throw new Error("Really did throw");
};

test("willThrow really throws", (t) => {
  try {
    willThrow();
  } catch {
    t.pass("willThrow, did indeed throw an error.");
  }
});
```

In this case when the `willThrow()` function doesn't throw, the test runners
throws an error that `willThrow really throws` didn't execute a single
assertion. Because the 'catch' block did not executed and consecutively the
`t.pass()` not called.

**t.deepEqual(value, expected, msg?)**

Compare `value` and `expected` using the Node.js built-in
[deepStrictEqual](https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message).

### CLI

There are two ways to run tests:

- `compas test` runs all tests in files where the name ends with `.test.js`
- `compas run ./path/to/file.test.js` runs a single test file, if the file calls
  `mainTestFn(import.meta)`.

Whe running all tests, Compas will automatically utilize
[worker threads](https://nodejs.org/api/worker_threads.html) to do some parallel
test running. Compas will run `cpu core count - 1` workers. Workers will execute
a single suite and then request a new test file from the runner. All test suites
registered by importing a test file, will run in serial on a single worker.
Executing with `compas test --serial` will disable the workers and run all test
suite in a single process.

The `--watch` feature can also be used, via `compas test --watch` or
`compas --watch ./path/to/file.test.js`. The test runner will then restart when
a JavaScript or json file is changed.

### Config

When tests are executed, a config file attempted to be loaded from
`test/config.js`. This file can export the following three items:

**timeout**

A configurable timeout in milliseconds. This is enforced for every callback
provided to `test` or `t.test`. Defaults to 2.5 seconds.

**ignoreDirectories**

An array of strings specifying directories that should be ignored when searching
for test files. They can be absolute paths or relative to the project root. Test
files in these directories can still be executed via for example
`compas run ./ignored/directory/foo.test.js`

**setup**

A function that is called before any test file is imported. Executed both for
single file tests and when running all tests via `compas test`. When workers are
used as explained in the [cli section](#cli), all workers will run this setup
function. If the function returns a promise, the runner will wait till the
promise is resolved before loading any test file.

Note that when a single test file is executed, the test file and it's imports
are already resolved before this setup function will be called.

**teardown**

A global teardown function, behaving the same as the previous mentioned setup
function. This is called if available, when all test suites did run, regardless
of the test result.

### Output

On successful runs, the test runner will only print the number of assertions as
follows:

```txt
12:30:38.640 info[test]
Total assertions: 15
          Passed: 15
          Failed: 0
-----------
```

When tests fail, we have a few options; an assertion failed or an uncaught
exception was caught by the runner. These will be printed as follows, with
annotated function calls that triggered these errors:

```txt
12:42:39.578 error[test]
Total assertions: 6
          Passed: 1
          Failed: 5
-----------
failing assertion suite (1/5)
  // t.fail("Fail message")
  fail: Fail message
  // t.ok(false)
  ok
    Expected: (boolean) true
    Actual: (boolean) false
  // t.equal("t.equal()", "expected");
  // The type is printed as well, to make it easier to spot when an object is passed in
  equal
    Expected: (string) expected
    Actual: (string) "t.equal()"
  // t.deepEqual({ foo: "bar" }, { bar: "foo" });
  deepEqual
    Expected values to be strictly deep-equal:
    + actual - expected

      {
    +   foo: 'bar'
    -   bar: 'foo'
      }
uncaught exception suite (0/0)
  // throw new Error("Plain JavaScript error message");
  uncaughtException (0/0)
    Error - Plain JavaScript error message
      {
        name: 'Error',
        message: 'Plain JavaScript error message',
        stack: [
          'at Object.callback (file:///home/dirk/projects/compas-docs/src/exception.test.js:17:11)',
          ...,
        ]
      }
  // throw new AppError("validation.error", 500, { info: "object" });
  @compas/stdlib AppError (0/0)
    AppError: validation.error - 500
      {
        key: 'validation.error',
        status: 500,
        info: { info: 'object' },
        stack: [
          'at Object.callback (file:///home/dirk/projects/compas-docs/src/exception.test.js:21:11)',
          ...,
        ],
        originalError: undefined
      }
  // import assert from "assert";
  // assert.strictEqual("actual", "expected");
  Node.js AssertionError (0/1)
    strictEqual
      Expected values to be strictly equal:
      + actual - expected

      + 'actual'
      - 'expected'
```

### Node.js assertions

As noted above `t.deepStrictEqual({}, {})` uses a Node.js built-in for the
assertion. All other assertion functions from the
[assert](https://nodejs.org/api/assert.html) module can be used. The only
difference when using these, is that other assertions in the same test function
will not run, unlike the assertions provided by Compas. Other assertion
libraries that are able to throw
[Node.js AssertionErrors](https://nodejs.org/api/assert.html#assert_new_assert_assertionerror_options)
should be compatible as well, but are not tested.

### Randomize rounds

Another feature of the test runner is to run the tests multiple times, changing
the order of file loading. This feature can be enabled by using
`compas test --randomize-rounds=n` where `n` is any integer, for example `3`.
This may be useful to discover flaky tests or may enable you to do some
'fuzzing' although not completely made for that.

The tests will run as described above, workers will spawn, global setup
functions called and test files loaded. However, when tests pass the known test
files, ending in `.test.js`, will be shuffled and run again. On new workers,
with a new global setup and teardown call, etc... If any of the runs fail, only
the failed result will be printed. When all rounds are successful, the total
number of assertions will be printed. This does not work in combination with
`--serial`.

### Coverage

A test runner isn't complete without a coverage checker. So we utilize
[c8](https://www.npmjs.com/package/c8) for that. By running `compas coverage`
collecting coverage is enabled. Check [c8](https://www.npmjs.com/package/c8) for
configuration options.
