import { mainTestFn, test } from "@compas/cli";
import {
  testGeneratorError,
  testGeneratorStaticFiles,
} from "../../test/testing.js";

mainTestFn(import.meta);

test("code-gen/processors/route-validation", (t) => {
  t.test("query validation - fail top level", (t) => {
    testGeneratorError(
      t,
      {
        partialError:
          "Only 'T.object()' or a reference to an object is allowed",
      },
      (T) => {
        const R = T.router("/");

        return [R.get("/").query([true])];
      },
    );
  });

  t.test("param validation - fail nested", (t) => {
    testGeneratorError(
      t,
      {
        partialError:
          "Found an invalid type 'array' used in the params of ('app', 'get')",
      },
      (T) => {
        const R = T.router("/");

        return [
          R.get("/:foo").params({
            foo: [true],
          }),
        ];
      },
    );
  });

  t.test("query validation - fail nested reference", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "Found an invalid type 'object' used",
      },
      (T) => {
        const R = T.router("/");

        return [
          R.get("/").query({
            obj: T.object("query").keys({}),
          }),
        ];
      },
    );
  });

  t.test("body validation - fail on nested file use", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "used in the body of",
      },
      (T) => {
        const R = T.router("/");
        return [
          R.post("/").body({
            nested: {
              file: T.file(),
            },
          }),
        ];
      },
    );
  });

  t.test("body validation - fail on object with file use", (t) => {
    testGeneratorError(
      t,
      {
        partialError: "used in the body of",
      },
      (T) => {
        const R = T.router("/");
        return [
          R.post("/").body({
            nested: {
              bool: T.bool(),
            },
            file: T.file(),
          }),
        ];
      },
    );
  });

  t.test(
    "body validation - fail on object with file use through reference",
    (t) => {
      testGeneratorError(
        t,
        {
          partialError: "used in the body of",
        },
        (T) => {
          const R = T.router("/");
          return [
            R.post("/").body({
              nested: {
                bool: T.bool(),
              },
              file: T.file("file"),
            }),
          ];
        },
      );
    },
  );

  t.test("route validation - success", (t) => {
    testGeneratorStaticFiles(t, {}, (T) => {
      const R = T.router("/");

      return [
        R.get("/none", "none"),
        R.get("/empty", "empty").params({}).query({}),

        R.get("/bool/:foo", "paramBoolean").params({
          foo: T.bool(),
        }),
        R.get("/date/:foo", "paramDate").params({
          foo: T.date(),
        }),
        R.get("/number/:foo", "paramNumber").params({
          foo: T.number(),
        }),
        R.get("/string/:foo", "paramString").params({
          foo: T.string(),
        }),
        R.get("/uuid/:foo", "paramUuid").params({
          foo: T.uuid(),
        }),

        R.get("/query", "queryParams").query({
          foo: T.bool("namedBool"),
          date: T.date(),
          str: T.string(),
        }),

        R.post("/body-no-files", "bodyNoFiles").body({
          foo: {
            bar: "baz",
          },
          bool: T.bool(),
        }),
      ];
    });

    t.pass();
  });
});
