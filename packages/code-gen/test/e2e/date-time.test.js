import { readFile } from "fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { TypeCreator } from "../../src/builders/index.js";
import { generateAndRunForBuilders } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/e2e/date-time", async (t) => {
  const T = new TypeCreator("app");
  const R = T.router("/time");

  const { exitCode, generatedDirectory } = await generateAndRunForBuilders(
    [
      T.object("codeGenDateTime")
        .keys({
          fullDate: T.date().defaultToNow(),
          dateOnly: T.date().dateOnly(),
          timeOnly: T.date().timeOnly(),
        })
        .enableQueries(),
    ],
    {
      enabledGenerators: ["validator", "router", "sql", "apiClient", "type"],
      isNodeServer: true,
      dumpStructure: true,
      dumpPostgres: true,
    },
  );

  t.equal(exitCode, 0);

  test("structure.sql", async (t) => {
    const structureFile = await readFile(
      pathJoin(generatedDirectory, "common/structure.sql"),
      "utf-8",
    );

    t.ok(structureFile.includes(`"fullDate" timestamptz NOT NULL`));
    t.ok(structureFile.includes(`"dateOnly" date NOT NULL`));
    t.ok(structureFile.includes(`"timeOnly" time NOT NULL`));
  });
});
