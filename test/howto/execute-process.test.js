import { mainTestFn, test } from "@compas/cli";
import { execTestFile } from "../utils.js";

mainTestFn(import.meta);

test("howto - execute-process", async (t) => {
  const result = await execTestFile("execute-process");

  t.ok(result.exitCode === 0);
  t.ok(result.stderr.length === 0);

  const firstExitCodeIndex = result.stdout.indexOf("exitCode");
  const secondExitCodeIndex = result.stdout.indexOf(
    "exitCode",
    firstExitCodeIndex + 1,
  );

  t.ok(result.stdout.indexOf("foo") !== -1, "Exec print foo");
  t.ok(result.stdout.indexOf("bar") !== -1, "Spawn print bar");
  t.ok(secondExitCodeIndex !== -1);
  t.ok(secondExitCodeIndex > firstExitCodeIndex);
});
