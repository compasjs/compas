# Test runner

This document describes the api of the test runner

## API

Provided by `@compas/cli`

### mainTestFn()

This marks a file as a test file and starts the test runner when a file is
executed directly as Node.js script. It is based on `mainFn` as explained in the
[project setup](/setup/project-setup.html) document.

There is only a single way to call this function, always:

```js
mainTestFn(import.meta);
```

This call may exists in all test files and does nothing when tests are executed
via `yarn compas test`.

### test(name, callback)

This is the only other directly exposed function of the test runner and is used
to register tests, also often called a test suite. The callback `t` contains the
functions and properties described below. The callback may be synchronous or
return a promise. Any uncaught exception thrown in the callback, will be caught
and results in a failed test.

Parameters:

- `name` (string): The test suite name
- `callback` (function): The test function

#### t.log

A logger instance provided by `@compas/stdlib`. See
[logger](/features/logger.html) for more details.

#### t.timeout

A setter to configure the timeout of subtests registered via `t.test`. To
configure this value see [config](#config)

#### t.test(name, callback)

Subtests can be registered any number of levels deep with `t.test()`, the name
and callback work exactly the same as `test`.

All subtests are executed in the same order as they are registered and will
never run in parallel.

#### Assertions

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

When `enforceSingleAssertion` is set to `true` in the config, the above is more
idiomatically written as:

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

## CLI

There are two ways to run tests:

- `yarn compas test` runs all tests in files where the name ends with `.test.js`
- `yarn compas ./path/to/file.test.js` runs a single test file, provided that
  the file calls `mainTestFn(import.meta)`.

Whe running all tests, Compas will automatically utilize
[worker threads](https://nodejs.org/api/worker_threads.html) to do some parallel
test running. Compas will run `cpu core count - 1` workers. Workers will execute
a single suite and then request a new test file from the runner. All test suites
registered by importing a test file, will run in serial on a single worker.
Executing with `yarn compas test --serial` will disable the workers and run all
test suite in a single process.

The `--watch` feature can also be used, via `yarn compas test --watch` or
`yarn compas --watch ./path/to/file.test.js`. The test runner will then restart
when a JavaScript or json file is changed.

## Config

When tests are executed, a config file attempted to be loaded from
`test/config.js`. This file can export the following three items:

**timeout**

A configurable timeout in milliseconds. This is enforced for every callback
provided to `test` or `t.test`. Defaults to 2.5 seconds.

**enforceSingleAssertion**

The runner enforces that every `test()` and `t.test()` call does at least a
single assertion or creates at least a single subtest.

**setup**

A function that is called before any test file is imported. Executed both for
single file tests and when running all tests via `yarn compas test`. When
workers are used as explained in the [cli section](#cli), all workers will run
this setup function. It can be used to set services as described in
[services-setup](/setup/services-setup.html). If the function returns a promise,
the runner will wait till the promise is resolved before loading any test file.

Note that when a single test file is executed, the test file and it's imports
are already resolved before this setup function will be called.

**teardown**

A global teardown function, behaving the same as the previous mentioned setup
function. This is called if available, when all test suites did run, regardless
of the test result.

## Output

On successful runs, the test runner will only print the number of assertions as
follows:

```text
12:30:38.640 info[test]
Total assertions: 15
          Passed: 15
          Failed: 0
-----------
```

When tests fail, we have a few options; an assertion failed or an uncaught
exception was caught by the runner. These will be printed as follows, with
annotated function calls that triggered these errors:

```text
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

## Node.js assertions

As noted above `t.deepStrictEqual({}, {})` uses a Node.js built-in for the
assertion. All other assertion functions from the
[assert](https://nodejs.org/api/assert.html) module can be used. The only
difference when using these, is that other assertions in the same test function
will not run, unlike the assertions provided by Compas. Other assertion
libraries that are able to throw
[Node.js AssertionErrors](https://nodejs.org/api/assert.html#assert_new_assert_assertionerror_options)
should be compatible as well, but are not tested.

## Randomize rounds

Another feature of the test runner is to run the tests multiple times, changing
the order of file loading. This feature can be enabled by using
`yarn compas test --randomize-rounds=n` where `n` is any integer, for example
`3`. This may be useful to discover flaky tests or may enable you to do some
'fuzzing' although not completely made for that.

The tests will run as described above, workers will spawn, global setup
functions called and test files loaded. However, when tests pass the known test
files, ending in `.test.js`, will be shuffled and run again. On new workers,
with a new global setup and teardown call, etc... If any of the runs fail, only
the failed result will be printed. When all rounds are successful, the total
number of assertions will be printed. This does not work in combination with
`--serial`.

## Coverage

A test runner isn't complete without a coverage checker. So we utilize
[c8](https://www.npmjs.com/package/c8) for that. By running
`yarn compas coverage` the tests will automatically run in with `--serial`.
