import { mainTestFn, test } from "@compas/cli";
import { spawn } from "@compas/stdlib";

mainTestFn(import.meta);

test("eslint-plugin", async (t) => {
  for (const f of [
    "enforce-event-stop.js",
    "check-event-name.js",
    "node-builtin-module-url-import.js",
  ]) {
    t.test(f, async (t) => {
      const { exitCode } = await spawn(`node`, [
        `./packages/eslint-plugin/test/${f}`,
      ]);

      t.equal(exitCode, 0);
    });
  }
});
