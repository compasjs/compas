import { readFile } from "node:fs/promises";
import { mainTestFn, test } from "@compas/cli";
import { pathJoin } from "@compas/stdlib";
import { TypeCreator } from "../../../src/builders/index.js";
import { codeGenToTemporaryDirectory } from "../utils.test.js";

mainTestFn(import.meta);

test("code-gen/environment/react-native", async (t) => {
  const T = new TypeCreator("app");
  const R = T.router("/app");

  const { exitCode, generatedDirectory, stdout, cleanupGeneratedDirectory } =
    await codeGenToTemporaryDirectory(
      [
        R.post("/file", "file").files({
          file: T.file(),
        }),
      ],
      {
        isBrowser: true,
        environment: {
          clientRuntime: "react-native",
        },
      },
    );

  t.equal(exitCode, 0);

  if (exitCode !== 0) {
    t.log.error(stdout);
  }

  const apiClientPath = pathJoin(generatedDirectory, "app/apiClient.ts");
  const apiClientSource = await readFile(apiClientPath, "utf-8");

  const typesPath = pathJoin(generatedDirectory, "common/types.ts");
  const typesSource = await readFile(typesPath, "utf-8");

  await cleanupGeneratedDirectory();

  // FormData.append has a different signature compared to Node.js FormData and Browser
  // FormData;
  t.ok(apiClientSource.includes("data.append(key, file);"));
  t.ok(typesSource.includes("uri: string"));
});
