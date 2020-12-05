import { mainTestFn, test } from "@compas/cli";
import { parseArgs } from "./parse.js";

mainTestFn(import.meta);

test("cli/parse", (t) => {
  t.test("default to help", (t) => {
    t.deepEqual(parseArgs([], []), {
      type: "util",
      name: "help",
      arguments: [],
    });
  });

  t.test("init is util", (t) => {
    t.deepEqual(parseArgs(["init"], []), {
      type: "util",
      name: "init",
      arguments: [],
    });
  });

  t.test("help is util", (t) => {
    t.deepEqual(parseArgs(["help"], []), {
      type: "util",
      name: "help",
      arguments: [],
    });
  });

  t.test("extra arguments for util scripts are passed through", (t) => {
    t.deepEqual(parseArgs(["init", "--name=foo"], []), {
      type: "util",
      name: "init",
      arguments: ["--name=foo"],
    });
  });

  t.test("exec default to run", (t) => {
    t.deepEqual(parseArgs(["foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      toolArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("throw help with error when nothing is found", (t) => {
    let parseResult = parseArgs(["run"], []);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs(["run", "scripts/non-existent.js"], []);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs(["scripts/non-existent.js"], []);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs(["bar"], ["foo"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");
  });

  t.test("include node args on run exec", (t) => {
    t.deepEqual(parseArgs(["--cpu-prof", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: ["--cpu-prof"],
      toolArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("include node args on explicit run exec", (t) => {
    t.deepEqual(parseArgs(["run", "--cpu-prof", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: ["--cpu-prof"],
      toolArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("include exec args on run exec", (t) => {
    t.deepEqual(parseArgs(["foo", "--cache"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      toolArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });
  });

  t.test("include exec args on explicit run exec", (t) => {
    t.deepEqual(parseArgs(["run", "foo", "--cache"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      toolArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });
  });

  t.test("accept paths for run exec", (t) => {
    t.deepEqual(parseArgs(["run", "./scripts/changelog.js"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "./scripts/changelog.js",
      nodeArguments: [],
      toolArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });
  });

  t.test("combined exec", (t) => {
    t.deepEqual(
      parseArgs(
        [
          "run",
          "--watch",
          "--verbose",
          "--verbose",
          "--cpu-prof-interval=10",
          "bar",
          "--no-cache",
        ],
        ["foo", "bar"],
      ),
      {
        type: "exec",
        name: "run",
        script: "bar",
        nodeArguments: ["--verbose", "--cpu-prof-interval=10"],
        toolArguments: [],
        execArguments: ["--no-cache"],
        watch: true,
        verbose: true,
      },
    );
  });

  t.test("get verbose correctly", (t) => {
    t.deepEqual(
      parseArgs(["run", "--verbose", "--cpu-prof-interval=10", "foo"], ["foo"]),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        toolArguments: [],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );

    t.deepEqual(parseArgs(["run", "--verbose", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      toolArguments: [],
      execArguments: [],
      watch: false,
      verbose: true,
    });

    t.deepEqual(
      parseArgs(
        ["run", "--verbose", "--verbose", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--verbose", "--cpu-prof-interval=10"],
        toolArguments: [],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );
  });

  t.test("get watch correctly", (t) => {
    t.deepEqual(
      parseArgs(["run", "--watch", "--cpu-prof-interval=10", "foo"], ["foo"]),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        toolArguments: [],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );

    t.deepEqual(parseArgs(["run", "--watch", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      toolArguments: [],
      execArguments: [],
      watch: true,
      verbose: false,
    });

    t.deepEqual(
      parseArgs(
        ["run", "--watch", "--watch", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "run",
        script: "foo",
        nodeArguments: ["--watch", "--cpu-prof-interval=10"],
        toolArguments: [],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );
  });

  t.test("error on named script", (t) => {
    let parseResult = parseArgs(["test", "foo"], ["foo"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs(["test", "./foo/"], []);
    t.equal(parseResult.type, "exec");
    t.equal(parseResult.name, "test");
  });

  t.test("accept -- delimiter", (t) => {
    t.deepEqual(
      parseArgs(["coverage", "--watch", "--foo", "--", "--check-coverage"]),
      {
        type: "exec",
        name: "coverage",
        script: undefined,
        nodeArguments: ["--foo"],
        toolArguments: ["--check-coverage"],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );
  });
});
