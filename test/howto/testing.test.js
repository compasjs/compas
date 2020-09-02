import { mainTestFn, test } from "@lbu/cli";
import { execTestFile } from "../utils.js";

mainTestFn(import.meta);

test("howto - testing", async (t) => {
  const result = await execTestFile("testing");
  const expectedAssertionCount = 10;

  t.ok(result.exitCode === 0);
  t.ok(result.stderr.length === 0);

  t.notEqual(
    result.stdout.indexOf(`Total assertions: ${expectedAssertionCount}`),
    -1,
  );
  t.notEqual(result.stdout.indexOf(`Passed: ${expectedAssertionCount}`), -1);
});
