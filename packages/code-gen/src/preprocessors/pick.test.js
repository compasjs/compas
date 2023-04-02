import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin } from "@compas/stdlib";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/index.js";

mainTestFn(import.meta);

test("code-gen/preprocessors/pick", async (t) => {
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

      T.pick("pick").object(T.reference("app", "base")).keys("baz", "quix"),
      T.object("nestedPick").keys({
        foo: T.pick()
          .object({
            baz: T.bool(),
          })
          .keys("baz"),
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

  const { validateAppPick, validateAppNestedPick } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "app/validators.js"))
  );

  t.test("top level pick", (t) => {
    const { error } = validateAppPick({
      baz: true,
      quix: true,
    });

    t.ok(isNil(error));
  });

  t.test("nested pick", (t) => {
    const { error } = validateAppNestedPick({
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
