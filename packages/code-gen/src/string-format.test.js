import { mainTestFn, test } from "@compas/cli";
import { stringFormatNameForError } from "./string-format.js";

mainTestFn(import.meta);

test("code-gen/string-format", (t) => {
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
});
