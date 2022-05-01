import { readFile } from "fs/promises";
import { readdir } from "node:fs/promises";
import { AppError, exec } from "@compas/stdlib";
import { applyCliStructure } from "../gen/cli.js";
import { applyCodeGenStructure } from "../gen/code-gen.js";
import { applyStoreStructure } from "../gen/store.js";
import { App } from "../packages/code-gen/index.js";

export async function generateTypes() {
  const app = new App({
    verbose: true,
  });

  await app.generateTypes({
    outputDirectory: "./types/generated",
    inputPaths: ["./packages/store/src/generated"],
    dumpCompasTypes: true,
  });
}

export async function generateCli() {
  const app = new App({
    verbose: true,
  });

  applyCliStructure(app);

  await app.generate({
    outputDirectory: `packages/cli/src/generated`,
    enabledGroups: ["cli"],
    isNode: true,
    enabledGenerators: ["validator", "type"],
    dumpStructure: true,
    declareGlobalTypes: false,
  });
}

export async function generateCodeGen() {
  const app = new App({
    verbose: true,
  });

  applyCodeGenStructure(app);

  await app.generate({
    outputDirectory: `packages/code-gen/src/generated`,
    enabledGroups: ["codeGen"],
    isNode: true,
    enabledGenerators: ["validator", "type"],
    dumpStructure: true,
    declareGlobalTypes: false,
  });
}

export async function generateStore() {
  const app = new App({
    verbose: true,
  });

  applyStoreStructure(app);

  await app.generate({
    outputDirectory: `packages/store/src/generated`,
    enabledGroups: ["store"],
    enabledGenerators: ["sql", "validator"],
    isNode: true,
    dumpStructure: true,
    dumpApiStructure: false,
    dumpPostgres: true,
  });
}

export async function generateExamples() {
  await Promise.all(
    (
      await readdir("./examples", {
        encoding: "utf-8",
      })
    ).map(async (exampleName) => {
      if (exampleName.includes(".")) {
        return;
      }

      const { exampleMetadata } = JSON.parse(
        await readFile(`./examples/${exampleName}/package.json`, "utf-8"),
      );

      if (exampleMetadata?.includeGenerated) {
        const result = await exec(`npx compas run generate`, {
          cwd: `./examples/${exampleName}`,
        });

        if (result.exitCode !== 0) {
          throw AppError.serverError({
            message: "One of the examples failed to generate",
            result,
            exampleName,
          });
        }
      }
    }),
  );
}
