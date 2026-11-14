import { mainTestFn, test } from "@compas/cli";
import { AppError } from "./error.js";
import { compasWithSentry } from "./sentry.js";

mainTestFn(import.meta);

test("stdlib/sentry", (t) => {
  t.test(
    "compasWithSentry rejects versions that don't instrument postgres v4",
    (t) => {
      for (const version of ["10.78.0", "11.10.0", undefined]) {
        try {
          compasWithSentry({ SDK_VERSION: version });
          t.fail(`Expected Sentry version '${version}' to be rejected.`);
        } catch (e) {
          t.ok(AppError.instanceOf(e), String(version));
        }
      }
    },
  );
});
