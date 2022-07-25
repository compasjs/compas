import { mainTestFn, test } from "@compas/cli";
import { loggerWritePretty } from "./log-writers.js";

mainTestFn(import.meta);

test("stdlib/log-writers", (t) => {
  t.test("loggerWritePretty", (t) => {
    const now = new Date();
    let result = [];
    const mock = /** @type {WritableStream} */ {
      write: (arg) => {
        result.push(arg);
      },
    };

    loggerWritePretty(mock, "info", now, {}, {});

    t.equal(result.length, 1);

    const [timestamp, level] = result[0].split(" ");

    t.ok(timestamp.match(/\d{2}:\d{2}:\d{2}.\d{3}/), "print time");
    t.ok(level.indexOf("info") !== -1, "print level");

    result = [];
    loggerWritePretty(
      mock,
      "info",
      now,
      { type: "foo" },
      {
        foo: { bar: { baz: "quix" } },
      },
    );

    t.equal(result.length, 1);
    t.ok(result[0].indexOf("foo") !== -1, "should print log type");
  });
});
