import { mainTestFn, test } from "@compas/cli";
import { AppError } from "@compas/stdlib";
import { errorsThrowCombinedError, stringFormatNameForError } from "./utils.js";

mainTestFn(import.meta);

test("code-gen/utils", (t) => {
  t.test("stringFormatNameForError", (t) => {
    t.test("format group and name", (t) => {
      const result = stringFormatNameForError({
        group: "foo",
        name: "bar",
      });

      t.equal(result, "('foo', 'bar')");
    });

    t.test("format type property", (t) => {
      const result = stringFormatNameForError({
        type: "boolean",
      });

      t.equal(result, "(boolean)");
    });

    t.test("default to anonymous", (t) => {
      const result = stringFormatNameForError({});

      t.equal(result, "(anonymous)");
    });

    t.test("return default value if only group is provided", (t) => {
      const result = stringFormatNameForError({ group: "foo" });

      t.equal(result, "(anonymous)");
    });

    t.test("return default value if only name is provided", (t) => {
      const result = stringFormatNameForError({ name: "foo" });

      t.equal(result, "(anonymous)");
    });
  });

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
