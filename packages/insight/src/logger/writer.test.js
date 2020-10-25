import { mainTestFn, test } from "@lbu/cli";
import { writeNDJSON, writePretty } from "./writer.js";

mainTestFn(import.meta);

test("insight/writer", (t) => {
  t.test("writePretty", (t) => {
    const now = new Date();
    let result = [];
    const mock = {
      write: (arg) => {
        result.push(arg);
      },
    };

    writePretty(mock, "info", now, {}, {});

    t.equal(result.length, 4);

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

    t.equal(result.length, 4);
    t.ok(result[0].indexOf("foo") !== -1, "should print log type");
  });

  t.test("writeNDJSON", (t) => {
    const now = new Date();
    let result = [];
    const mock = {
      write: (arg) => {
        result.push(arg);
      },
    };

    writeNDJSON(mock, "info", now, "{}", {});

    t.equal(result.length, 1);
    t.equal(
      JSON.parse(result[0]).level,
      "info",
      "log output can be parsed by json",
    );

    result = [];
    writeNDJSON(
      mock,
      "info",
      now,
      JSON.stringify({
        type: "foo",
      }),
      { foo: { bar: { baz: "quix" } } },
    );

    t.equal(result.length, 1);
    t.equal(
      JSON.parse(result[0])?.context?.type,
      "foo",
      "should print log type",
    );
  });
});
