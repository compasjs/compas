# Writing tests

A project setup needs a test runner of course. Compas comes with its own test
runner loosely inspired by [tape](https://github.com/substack/tape). It comes
with a few assertions, async testing, and the possibility of doing nesting test
suites. `AssertionErrors` by using Node.js builtin
[assert](https://nodejs.org/api/assert.html) -module are handled as well.

## Basic test file

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

## Running tests

There are two ways to run tests. The short way is to use `yarn compas test`
which will run all test files in your project. There is also the option to run a
test file directly like `node ./file.test.js` or
`yarn compas run ./file.test.js`. However, to do this you need to add the
following to your test file:

```js
import { mainTestFn } from "@compas/cli";

mainTestFn(import.meta);
```

It works based on `mainFn` as explained in
[Project setup](/setup/project-setup.md).

## Setup and teardown per test file

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

## Asserting on throws

Asserting on throws is another overlooked part of some test runners. This test
runner does not provide any fancy util like `t.throws(functionThatThrows)`, but
expects the user to use normal control flow like try / catch.

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

    // A logger from @compas/stdlib is available
    t.log.error(e);
  }
});
```

## Test configuration

Test configuration is auto loaded from `{root}/test/config.js`. An example with
the defaults is below:

```js
// Individual test timeout, i.e. the function provided to `test` and `t.test`
export const timeout = 2500;

// Enforce that every test has at least a single subtest (i.e. t.test()) or an assertion (t.pass())
export const enforceSingleAssertion = false;

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
