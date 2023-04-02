import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin } from "@compas/stdlib";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/index.js";

mainTestFn(import.meta);

test("code-gen/preprocessors/omit", async (t) => {
  const T = new TypeCreator();
  const {
    generatedDirectory,
    exitCode,
    stderr,
    stdout,
    cleanupGeneratedDirectory,
  } = await codeGenToTemporaryDirectory(
    [
      T.object("base").keys({
        bar: T.number(),
        baz: T.bool(),
        quix: T.bool(),
      }),

      T.omit("omit").object(T.reference("app", "base")).keys("bar"),
      T.object("nestedOmit").keys({
        foo: T.omit()
          .object({
            bar: T.number(),
            baz: T.bool(),
          })
          .keys("bar"),
      }),
    ],
    {
      enabledGenerators: ["type", "validator"],
      isNodeServer: true,
      declareGlobalTypes: false,
    },
  );

  t.equal(exitCode, 0);
  if (exitCode !== 0) {
    t.log.error({
      stderr,
      stdout,
    });
  }

  const { validateAppOmit, validateAppNestedOmit } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "app/validators.js"))
  );

  t.test("top level omit", (t) => {
    const { error } = validateAppOmit({
      baz: true,
      quix: true,
    });

    t.ok(isNil(error));
  });

  t.test("nested omit", (t) => {
    const { error } = validateAppNestedOmit({
      foo: {
        baz: true,
      },
    });

    t.ok(isNil(error));
  });

  t.test("teardown", async (t) => {
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
