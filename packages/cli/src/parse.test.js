import { mainTestFn, test } from "@compas/cli";
import { parseArgs } from "./parse.js";

mainTestFn(import.meta);

test("cli/parse", (t) => {
  t.test("default to help", (t) => {
    t.deepEqual(parseArgs([], [], []), {
      type: "util",
      name: "help",
      arguments: [],
    });
  });

  t.test("init is util", (t) => {
    t.deepEqual(parseArgs([], [], ["init"]), {
      type: "util",
      name: "init",
      arguments: [],
    });
  });

  t.test("help is util", (t) => {
    t.deepEqual(parseArgs([], [], ["help"]), {
      type: "util",
      name: "help",
      arguments: [],
    });
  });

  t.test("extra arguments for util scripts are passed through", (t) => {
    t.deepEqual(parseArgs([], [], ["init", "--name=foo"]), {
      type: "util",
      name: "init",
      arguments: ["--name=foo"],
    });
  });

  t.test("exec default to run", (t) => {
    t.deepEqual(parseArgs([], ["foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("throw help with error when nothing is found", (t) => {
    let parseResult = parseArgs([], [], ["run"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs([], [], ["run", "scripts/non-existent.js"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs([], [], ["scripts/non-existent.js"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs([], ["foo"], ["bar"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");
  });

  t.test("include node args on run exec", (t) => {
    t.deepEqual(parseArgs(["--cpu-prof"], ["foo"], ["--cpu-prof", "foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: ["--cpu-prof"],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("include node args on explicit run exec", (t) => {
    t.deepEqual(
      parseArgs(["--cpu-prof"], ["foo"], ["run", "--cpu-prof", "foo"]),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof"],
        execArguments: [],
        watch: false,
        verbose: false,
      },
    );
  });

  t.test("include exec args on run exec", (t) => {
    t.deepEqual(parseArgs([], ["foo"], ["foo", "--cache"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });
  });

  t.test("include exec args on explicit run exec", (t) => {
    t.deepEqual(parseArgs([], ["foo"], ["run", "foo", "--cache"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });
  });

  t.test("accept paths for run exec", (t) => {
    t.deepEqual(parseArgs([], ["foo"], ["run", "./scripts/changelog.js"]), {
      type: "exec",
      name: "run",
      script: "./scripts/changelog.js",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("combined exec", (t) => {
    t.deepEqual(
      parseArgs(
        ["--cpu-prof-interval"],
        ["foo", "bar"],
        [
          "run",
          "--watch",
          "--verbose",
          "--verbose",
          "--cpu-prof-interval=10",
          "bar",
          "--no-cache",
        ],
      ),
      {
        type: "exec",
        name: "run",
        script: "bar",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: ["--no-cache"],
        watch: true,
        verbose: true,
      },
    );
  });

  t.test("get verbose correctly", (t) => {
    t.deepEqual(
      parseArgs(
        ["--cpu-prof-interval"],
        ["foo"],
        ["run", "--verbose", "--cpu-prof-interval=10", "foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );

    t.deepEqual(parseArgs([], ["foo"], ["run", "--verbose", "foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: true,
    });

    t.deepEqual(
      parseArgs(
        ["--cpu-prof-interval"],
        ["foo"],
        ["run", "--verbose", "--cpu-prof-interval=10", "foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );
  });

  t.test("get watch correctly", (t) => {
    t.deepEqual(
      parseArgs(
        ["--cpu-prof-interval"],
        ["foo"],
        ["run", "--watch", "--cpu-prof-interval=10", "foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );

    t.deepEqual(parseArgs([], ["foo"], ["run", "--watch", "foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: true,
      verbose: false,
    });

    t.deepEqual(
      parseArgs(
        ["--cpu-prof-interval"],
        ["foo"],
        ["run", "--watch", "--watch", "--cpu-prof-interval=10", "foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );
  });
});
