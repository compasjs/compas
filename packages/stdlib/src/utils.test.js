import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { mainTestFn, test } from "@compas/cli";
import { gc, getSecondsSinceEpoch, isMainFnAndReturnName } from "./utils.js";

mainTestFn(import.meta);

test("stdlib/utils", (t) => {
  t.test("getSecondsSinceEpoch", (t) => {
    t.ok(Number.isInteger(getSecondsSinceEpoch()));
  });

  t.test("gc", (t) => {
    try {
      gc();
      t.pass();
    } catch (e) {
      t.fail("Should not throw");
      t.log.error(e);
    }
  });

  t.test("isMainFnAndGetName", (t) => {
    const baseUrl = `file://${process.cwd()}`;
    const nonMainFnResult = isMainFnAndReturnName({
      url: `${baseUrl}/packages/stdlib/src/utils.js`,
    });

    t.equal(nonMainFnResult.isMainFn, false);
    // Still returns the name of the file that is the process entrypoint
    t.ok(
      nonMainFnResult.name === "worker-thread" ||
        nonMainFnResult.name === "index",
    );
  });

  t.test("isMainFn resolves entrypoints through symlinked directories", (t) => {
    const tempDirectory = realpathSync(mkdtempSync(join(tmpdir(), "compas-")));
    const realDirectory = join(tempDirectory, "real");
    const linkedDirectory = join(tempDirectory, "linked");
    const originalArgv1 = process.argv[1];

    try {
      mkdirSync(realDirectory);
      writeFileSync(join(realDirectory, "script.js"), "");
      symlinkSync(realDirectory, linkedDirectory, "dir");

      process.argv[1] = join(linkedDirectory, "script.js");

      const result = isMainFnAndReturnName({
        url: pathToFileURL(join(realDirectory, "script.js")).href,
      });

      t.equal(result.isMainFn, true);
      t.equal(result.name, "script");
    } finally {
      process.argv[1] = originalArgv1;
      rmSync(tempDirectory, { recursive: true, force: true });
    }
  });
});
