import { mainTestFn, test } from "@compas/cli";
import { execTestFile } from "../utils.js";

mainTestFn(import.meta);

test("howto - process-entrypoint", async (t) => {
  const result = await execTestFile("process-entrypoint");

  t.ok(result.exitCode === 0);
  t.ok(result.stderr.length === 0);
  t.ok(result.stdout.indexOf("info") !== -1, "Uses logger");
  t.ok(result.stdout.indexOf("running") !== -1, "Prints correct result");
});
