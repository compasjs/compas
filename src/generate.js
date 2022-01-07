import { applyCliStructure } from "../gen/cli.js";
import { applyCodeGenStructure } from "../gen/code-gen.js";
import { applyStoreStructure } from "../gen/store.js";
import { applyTestingSqlStructure } from "../gen/testing.js";
import { App } from "../packages/code-gen/index.js";
import { storeStructure } from "../packages/store/index.js";

export const generateTestAndBenchSettings = {
  sql: {
    outputDirectory: "./generated/testing/sql",
    enabledGroups: ["sql"],
    enabledGenerators: ["sql", "validator"],
    isNodeServer: true,
    dumpApiStructure: false,
    dumpStructure: true,
  },
};

export async function generateTypes() {
  const app = new App({
    verbose: true,
  });

  await app.generateTypes({
    outputDirectory: "./types/generated",
    inputPaths: ["./generated/testing/sql", "./packages/store/src/generated"],
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

export async function generateTestAndBench() {
  const app = new App({
    verbose: true,
  });

  applyAllLocalGenerate(app);

  await app.generate(generateTestAndBenchSettings.sql);
}

export function applyAllLocalGenerate(app) {
  app.extend(storeStructure);

  applyTestingSqlStructure(app);
}
