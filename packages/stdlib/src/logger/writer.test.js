import { mainTestFn, test } from "@compas/cli";
import { writePretty } from "./writer.js";

mainTestFn(import.meta);

test("stdlib/logger/writer", (t) => {
  t.test("writePretty", (t) => {
    const now = new Date();
    let result = [];
    const mock = /** @type {WritableStream} */ {
      write: (arg) => {
        result.push(arg);
      },
    };

    writePretty(mock, "info", now, {}, {});

    t.equal(result.length, 1);

    const [timestamp, level] = result[0].split(" ");

    t.ok(timestamp.match(/\d{2}:\d{2}:\d{2}.\d{3}/), "print time");
    t.ok(level.indexOf("info") !== -1, "print level");

    result = [];
    writePretty(
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
