import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { errorsThrowCombinedError } from "./errors.js";

mainTestFn(import.meta);

test("code-gen/errors", (t) => {
  t.test("errorsThrowCombinedError", (t) => {
    t.test("returns with empty error array", (t) => {
      errorsThrowCombinedError([]);

      t.pass();
    });

    t.test("collects messages and throws a single error", (t) => {
      try {
        errorsThrowCombinedError([
          AppError.serverError({
            message: "1",
          }),
          AppError.serverError({
            message: "2",
          }),
        ]);
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.deepEqual(e.info.messages, ["1", "2"]);
      }
    });

    t.test("ignores errors without a message", (t) => {
      try {
        errorsThrowCombinedError([
          AppError.serverError({
            message: "1",
          }),
          AppError.serverError({}),
        ]);
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.info.messages[0], "1");
        t.equal(e.info.messages[1].key, "error.server.internal");
      }
    });

    t.test("includes 'messages' property", (t) => {
      try {
        errorsThrowCombinedError([
          AppError.serverError({
            messages: ["1", "2"],
          }),
          AppError.serverError({}),
        ]);
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.info.messages[0], "1");
        t.equal(e.info.messages[1], "2");
        t.equal(e.info.messages[2].key, "error.server.internal");
      }
    });
  });
});
