import { pathToFileURL } from "url";
import { mainTestFn, test } from "@compas/cli";
import { isNil, pathJoin } from "@compas/stdlib";
import { codeGenToTemporaryDirectory } from "../../test/legacy/utils.test.js";
import { TypeCreator } from "../builders/index.js";

mainTestFn(import.meta);

test("code-gen/preprocessors/extend", async (t) => {
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

      T.extendNamedObject(T.reference("app", "base")).keys({
        fox: T.number(),
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

  const { validateAppBase } = await import(
    pathToFileURL(pathJoin(generatedDirectory, "app/validators.js"))
  );

  t.test("extend", (t) => {
    const { error } = validateAppBase({
      bar: 5,
      baz: true,
      quix: true,
      fox: 3,
    });

    t.ok(isNil(error));

    if (error) {
      throw error;
    }
  });

  t.test("teardown", async (t) => {
    await cleanupGeneratedDirectory();

    t.pass();
  });
});
