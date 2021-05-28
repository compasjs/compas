import { mainTestFn, test } from "@compas/cli";
import { isNil, isPlainObject, pathJoin } from "@compas/stdlib";
import {
  collectScripts,
  watchOptionsToIgnoredArray,
  watchOptionsWithDefaults,
} from "./utils.js";

mainTestFn(import.meta);

test("cli/utils", (t) => {
  t.test("collectScripts builds an object", (t) => {
    const result = collectScripts();

    t.ok(isPlainObject(result));
  });

  t.test("collectScripts contains scripts", (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["changelog"]));
    t.equal(result["changelog"].type, "user");
  });

  t.test("collectScripts contains package.json scripts", (t) => {
    const result = collectScripts();

    t.ok(!isNil(result["release"]));
    t.equal(result["release"].type, "package");
  });

  t.test("watchOptionsWithDefaults should have defaults", (t) => {
    const result = watchOptionsWithDefaults();

    t.ok(result);
    t.ok(Array.isArray(result.extensions));
  });

  t.test("watchOptionsWithDefaults should not overwrite provided args", (t) => {
    const result = watchOptionsWithDefaults({ extensions: [] });

    t.equal(result.extensions.length, 0);
  });

  t.test(
    "watchOptionsWithDefaults should throw wrong type is provided",
    (t) => {
      try {
        watchOptionsWithDefaults({ extensions: false });
        // eslint-disable-next-line no-empty
      } catch {
        t.pass();
      }

      try {
        watchOptionsWithDefaults({ ignoredPatterns: false });
        // eslint-disable-next-line no-empty
      } catch {
        t.pass();
      }
    },
  );

  t.test("watchOptionsToIgnoredArray should return function", (t) => {
    const result = watchOptionsToIgnoredArray({
      extensions: [],
      ignoredPatterns: [],
    });

    t.equal(typeof result, "function");
  });

  t.test("watchOptionsToIgnoredArray regex checks", (t) => {
    const call = watchOptionsToIgnoredArray({
      extensions: ["js", "md"],
      ignoredPatterns: ["files"],
    });

    const cwd = process.cwd();

    const callWithCwd = (path) => call(pathJoin(cwd, path));

    t.test("ignore by extension", (t) => {
      t.ok(call("foo.txt"));
    });

    t.test("ignore by extension with cwd", (t) => {
      t.ok(callWithCwd("foo.txt"));
    });

    t.test("ignore node_modules", (t) => {
      t.ok(call("node_modules/foo.js"));
    });

    t.test("ignore node_modules with cwd", (t) => {
      t.ok(callWithCwd("node_modules/foo.js"));
    });

    t.test("ignore by pattern", (t) => {
      t.ok(call("/foo/files/foo.md"));
      t.ok(call("files/foo.md"));
    });

    t.test("ignore by pattern with cwd", (t) => {
      t.ok(callWithCwd("node_modules/foo.md"));
    });

    t.test("ignore dotfiles", (t) => {
      t.ok(call(".foobar"));
    });

    t.test("ignore dotfiles with cwd", (t) => {
      t.ok(callWithCwd(".bashrc"));
    });

    t.test("don't ignore valid files", (t) => {
      t.ok(!call("test.js"));
      t.ok(!call("bar.md"));
      t.ok(!callWithCwd("test.js"));
      t.ok(!callWithCwd("bar.md"));
    });
  });
});
