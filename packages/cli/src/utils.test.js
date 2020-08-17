import { isNil, isPlainObject, pathJoin } from "@lbu/stdlib";
import test from "tape";
import {
  collectScripts,
  watchOptionsToIgnoredArray,
  watchOptionsWithDefaults,
} from "./utils.js";

test("cli/utils", async (t) => {
  t.test("collectScripts builds an object", async (t) => {
    const result = collectScripts();

    t.ok(isPlainObject(result));
  });

  t.test("collectScripts contains scripts", async (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["generate"]));
    t.equal(result["generate"].type, "user");
  });

  t.test("collectScripts contains package.json scripts", async (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["release"]));
    t.equal(result["release"].type, "package");
  });

  t.test("watchOptionsWithDefaults should have defaults", async (t) => {
    const result = watchOptionsWithDefaults();

    t.ok(result);
    t.ok(Array.isArray(result.extensions));
  });

  t.test(
    "watchOptionsWithDefaults should not overwrite provided args",
    async (t) => {
      const result = watchOptionsWithDefaults({ extensions: [] });

      t.equal(result.extensions.length, 0);
    },
  );

  t.test(
    "watchOptionsWithDefaults should throw wrong type is provided",
    async (t) => {
      try {
        watchOptionsWithDefaults({ extensions: false });
        t.fail("Should throw");
        // eslint-disable-next-line no-empty
      } catch {}

      try {
        watchOptionsWithDefaults({ ignoredPatterns: false });
        t.fail("Should throw");
        // eslint-disable-next-line no-empty
      } catch {}
    },
  );

  t.test("watchOptionsToIgnoredArray should return function", async (t) => {
    const result = watchOptionsToIgnoredArray({
      extensions: [],
      ignoredPatterns: [],
    });

    t.equal(typeof result, "function");
  });

  t.test("watchOptionsToIgnoredArray regex checks", async (t) => {
    const call = watchOptionsToIgnoredArray({
      extensions: ["js", "md"],
      ignoredPatterns: ["files"],
    });

    const cwd = process.cwd();

    const callWithCwd = (path) => call(pathJoin(cwd, path));

    t.test("ignore by extension", async (t) => {
      t.ok(call("foo.txt"));
    });

    t.test("ignore by extension with cwd", async (t) => {
      t.ok(callWithCwd("foo.txt"));
    });

    t.test("ignore node_modules", async (t) => {
      t.ok(call("node_modules/foo.js"));
    });

    t.test("ignore node_modules with cwd", async (t) => {
      t.ok(callWithCwd("node_modules/foo.js"));
    });

    t.test("ignore by pattern", async (t) => {
      t.ok(call("/foo/files/foo.md"));
      t.ok(call("files/foo.md"));
    });

    t.test("ignore by pattern with cwd", async (t) => {
      t.ok(callWithCwd("node_modules/foo.md"));
    });

    t.test("ignore dotfiles", async (t) => {
      t.ok(call(".foobar"));
    });

    t.test("ignore dotfiles with cwd", async (t) => {
      t.ok(callWithCwd(".bashrc"));
    });

    t.test("don't ignore valid files", async (t) => {
      t.ok(!call("test.js"));
      t.ok(!call("bar.md"));
      t.ok(!callWithCwd("test.js"));
      t.ok(!callWithCwd("bar.md"));
    });
  });
});
