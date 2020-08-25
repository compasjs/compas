import { mainTestFn, test } from "@lbu/cli";

mainTestFn(import.meta);

/// [basic]
test("my test", (t) => {
  t.equal(1, 1);
  t.ok(true);
  t.notOk(false);
  t.notEqual("foo", "bar");
  t.deepEqual([1, 2], [1, 2]);
});
/// [basic]

/// [setup-teardown]
test("setup and teardown", (t) => {
  let myTestGlobal = undefined;

  // Every callback function can be async
  t.test("setup", async (t) => {
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
/// [setup-teardown]

/// [pass-fail]
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
/// [pass-fail]
