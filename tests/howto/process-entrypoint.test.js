import test from "tape";
import { execTestFile } from "../utils.js";

test("howto - process-entrypoint", async (t) => {
  const result = await execTestFile("process-entrypoint");

  t.ok(result.stderr.length === 0);
  t.ok(result.stdout.indexOf("info") !== -1, "Uses logger");
  t.ok(result.stdout.indexOf("running") !== -1, "Prints correct result");
});
