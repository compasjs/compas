import { applyCodeGenStructure } from "../gen/code-gen.js";
import { extendWithRepo } from "../gen/repo.js";
import { applyStoreStructure } from "../gen/store.js";
import {
  applyBenchStructure,
  applyTestingServerStructure,
  applyTestingSqlStructure,
  applyTestingValidatorsStructure,
} from "../gen/testing.js";
import { App } from "../packages/code-gen/index.js";
import { storeStructure } from "../packages/store/index.js";

export const generateTestAndBenchSettings = {
  validators: {
    outputDirectory: "./generated/testing/validators",
    enabledGroups: ["validator"],
    isNode: true,
    enabledGenerators: ["validator"],
    dumpStructure: true,
  },
  bench: {
    outputDirectory: "./generated/testing/bench",
    enabledGroups: ["bench", "githubApi"],
    isNodeServer: true,
    enabledGenerators: ["validator", "router"],
    dumpStructure: true,
  },
  server: {
    outputDirectory: "./generated/testing/server",
    enabledGenerators: ["apiClient", "router", "validator"],
    enabledGroups: ["server"],
    isNodeServer: true,
    dumpStructure: true,
  },
  client: {
    outputDirectory: "./generated/testing/client",
    enabledGroups: ["server"],
    enabledGenerators: ["type", "apiClient", "validator" /*, "reactQuery"*/],
    isBrowser: true,
  },
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
    inputPaths: [
      "./generated/testing/server",
      "./generated/testing/sql",
      "./generated/testing/validators",
      "./src/generated",
      "./packages/code-gen/src/generated",
      "./packages/store/src/generated",
    ],
    dumpCompasTypes: true,
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
    enabledGenerators: ["validator"],
    dumpStructure: true,
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
    throwingValidators: true,
    isNode: true,
    dumpStructure: true,
    dumpApiStructure: false,
    dumpPostgres: true,
  });
}

export async function generateRepo() {
  const app = new App({
    verbose: true,
  });

  extendWithRepo(app);

  await app.generate({
    outputDirectory: "./src/generated",
    enabledGenerators: ["validator"],
    isNode: true,
    throwingValidators: false,
    dumpStructure: true,
  });
}

export async function generateTestAndBench() {
  const app = new App({
    verbose: true,
  });

  applyAllLocalGenerate(app);

  await app.generate(generateTestAndBenchSettings.validators);
  await app.generate(generateTestAndBenchSettings.bench);
  await app.generate(generateTestAndBenchSettings.server);
  await app.generate(generateTestAndBenchSettings.client);
  await app.generate(generateTestAndBenchSettings.sql);
}

export function applyAllLocalGenerate(app) {
  app.extend(storeStructure);

  applyBenchStructure(app);
  applyTestingValidatorsStructure(app);
  applyTestingServerStructure(app);
  applyTestingSqlStructure(app);
}
