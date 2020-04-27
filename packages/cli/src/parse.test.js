import test from "tape";
import { parseArgs } from "./parse.js";

test("cli/parse", (t) => {
  t.test("default to help", (t) => {
    t.deepEqual(parseArgs([], []), {
      type: "util",
      name: "help",
      arguments: [],
    });

    t.end();
  });

  t.test("init is util", (t) => {
    t.deepEqual(parseArgs(["init"], []), {
      type: "util",
      name: "init",
      arguments: [],
    });

    t.end();
  });

  t.test("help is util", (t) => {
    t.deepEqual(parseArgs(["help"], []), {
      type: "util",
      name: "help",
      arguments: [],
    });

    t.end();
  });

  t.test("extra arguments for util scripts are passed through", (t) => {
    t.deepEqual(parseArgs(["init", "--name=foo"], []), {
      type: "util",
      name: "init",
      arguments: ["--name=foo"],
    });

    t.end();
  });

  t.test("exec default to run", (t) => {
    t.deepEqual(parseArgs(["foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });

    t.end();
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

    t.end();
  });

  t.test("include node args on run exec", (t) => {
    t.deepEqual(parseArgs(["--cpu-prof", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: ["--cpu-prof"],
      execArguments: [],
      watch: false,
      verbose: false,
    });

    t.end();
  });

  t.test("include node args on explicit run exec", (t) => {
    t.deepEqual(parseArgs(["run", "--cpu-prof", "foo"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: ["--cpu-prof"],
      execArguments: [],
      watch: false,
      verbose: false,
    });

    t.end();
  });

  t.test("include exec args on run exec", (t) => {
    t.deepEqual(parseArgs(["foo", "--cache"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });

    t.end();
  });

  t.test("include exec args on explicit run exec", (t) => {
    t.deepEqual(parseArgs(["run", "foo", "--cache"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "foo",
      nodeArguments: [],
      execArguments: ["--cache"],
      watch: false,
      verbose: false,
    });

    t.end();
  });

  t.test("accept paths for run exec", (t) => {
    t.deepEqual(parseArgs(["run", "./scripts/generate.js"], ["foo"]), {
      type: "exec",
      name: "run",
      script: "./scripts/generate.js",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: false,
    });

    t.end();
  });

  t.test("combined exec", (t) => {
    t.deepEqual(
      parseArgs(
        [
          "profile",
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
        name: "profile",
        script: "bar",
        nodeArguments: ["--verbose", "--cpu-prof-interval=10"],
        execArguments: ["--no-cache"],
        watch: true,
        verbose: true,
      },
    );

    t.end();
  });

  t.test("get verbose correctly", (t) => {
    t.deepEqual(
      parseArgs(
        ["profile", "--verbose", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "profile",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );

    t.deepEqual(parseArgs(["profile", "--verbose", "foo"], ["foo"]), {
      type: "exec",
      name: "profile",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: false,
      verbose: true,
    });

    t.deepEqual(
      parseArgs(
        ["profile", "--verbose", "--verbose", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "profile",
        script: "foo",
        nodeArguments: ["--verbose", "--cpu-prof-interval=10"],
        execArguments: [],
        watch: false,
        verbose: true,
      },
    );

    t.end();
  });
  t.test("get test correctly", (t) => {
    t.deepEqual(
      parseArgs(
        ["profile", "--watch", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "profile",
        script: "foo",
        nodeArguments: ["--cpu-prof-interval=10"],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );

    t.deepEqual(parseArgs(["profile", "--watch", "foo"], ["foo"]), {
      type: "exec",
      name: "profile",
      script: "foo",
      nodeArguments: [],
      execArguments: [],
      watch: true,
      verbose: false,
    });

    t.deepEqual(
      parseArgs(
        ["profile", "--watch", "--watch", "--cpu-prof-interval=10", "foo"],
        ["foo"],
      ),
      {
        type: "exec",
        name: "profile",
        script: "foo",
        nodeArguments: ["--watch", "--cpu-prof-interval=10"],
        execArguments: [],
        watch: true,
        verbose: false,
      },
    );

    t.end();
  });

  t.test("error on named script", (t) => {
    let parseResult = parseArgs(["test", "foo"], ["foo"]);
    t.ok(parseResult.error, "string");
    t.equal(parseResult.type, "util");
    t.equal(parseResult.name, "help");

    parseResult = parseArgs(["test", "./foo/"], []);
    t.equal(parseResult.type, "exec");
    t.equal(parseResult.name, "test");

    t.end();
  });
});
