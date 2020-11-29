import { App } from "@lbu/code-gen";
import { mainFn } from "@lbu/stdlib";
import { applyCodeGenStructure, applyStoreStructure } from "../gen/index.js";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated"],
  extensions: ["tmpl", "js", "json"],
};

async function main() {
  const app = await App.new({
    verbose: true,
  });

  applyCodeGenStructure(app);

  await app.generate({
    outputDirectory: `packages/code-gen/src/generated`,
    enabledGroups: ["codeGen"],
    isNode: true,
    enabledGenerators: ["type", "validator"],
  });

  applyStoreStructure(app);

  await app.generate({
    outputDirectory: `packages/store/src/generated`,
    enabledGroups: ["store"],
    isNode: true,
    enabledGenerators: ["type", "sql", "validator"],
    dumpStructure: true,
    dumpPostgres: true,
  });
}
