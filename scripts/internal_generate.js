import { App } from "@lbu/code-gen";
import { mainFn } from "@lbu/stdlib";
import { applyCodeGenStructure, applyStoreStructure } from "../gen/index.js";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated", "stubs"],
  extensions: ["tmpl", "js", "json"],
};

async function main() {
  const app = await App.new({
    verbose: true,
  });

  applyStoreStructure(app);
  applyCodeGenStructure(app);

  await app.generate({
    outputDirectory: `packages/store/src/generated`,
    enabledGroups: ["store"],
    enabledGenerators: ["type", "sql"],
    useTypescript: false,
    dumpStructure: true,
    dumpPostgres: true,
  });

  await app.generate({
    outputDirectory: `packages/code-gen/src/generated`,
    enabledGroups: ["codeGen"],
    enabledGenerators: ["type", "validator"],
    useTypescript: false,
    dumpStructure: false,
  });
}
