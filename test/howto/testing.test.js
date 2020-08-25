import { mainTestFn, test } from "@lbu/cli";
import { execTestFile } from "../utils.js";

mainTestFn(import.meta);

test("howto - testing", async (t) => {
  const result = await execTestFile("testing");

  t.ok(result.exitCode === 0);
  t.ok(result.stderr.length === 0);

  t.notEqual(result.stdout.indexOf("Total assertions: 9"), -1);
  t.notEqual(result.stdout.indexOf("Passed: 9"), -1);
});
