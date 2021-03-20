import { App } from "@compas/code-gen";
import { mainFn, pathJoin, spawn } from "@compas/stdlib";
import { storeStructure } from "@compas/store";
import {
  applyBenchStructure,
  applyTestingServerStructure,
  applyTestingSqlStructure,
  applyTestingValidatorsStructure,
} from "../gen/testing.js";

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated"],
  extensions: ["tmpl", "js", "json"],
};

export const generateSettings = {
  validators: {
    outputDirectory: "./generated/testing/validators",
    enabledGroups: ["validator"],
    isNode: true,
  },
  bench: {
    outputDirectory: "./generated/testing/bench",
    enabledGroups: ["bench", "githubApi"],
    isNodeServer: true,
    enabledGenerators: ["validator", "type", "router"],
  },
  server: {
    outputDirectory: "./generated/testing/server",
    enabledGenerators: ["type", "apiClient", "router", "validator"],
    enabledGroups: ["server", "type"],
    isNodeServer: true,
  },
  client: {
    outputDirectory: "./generated/testing/client",
    enabledGroups: ["server"],
    enabledGenerators: ["apiClient", "type", "validator" /*, "reactQuery"*/],
    isBrowser: true,
  },
  sql: {
    outputDirectory: "./generated/testing/sql",
    enabledGroups: ["sql"],
    enabledGenerators: ["type", "sql", "validator"],
    isNodeServer: true,
  },
};

mainFn(import.meta, main);

async function main() {
  const app = new App({
    verbose: true,
  });

  applyAllLocalGenerate(app);
  generateSettings;

  await app.generate(generateSettings.validators);
  await app.generate(generateSettings.bench);
  await app.generate(generateSettings.server);
  await app.generate(generateSettings.client);
  await app.generate(generateSettings.sql);

  app.logger.info("Transpiling typescript...");

  await spawn(
    "yarn",
    [
      "tsc",
      `${pathJoin(process.cwd(), "./generated/testing/client")}/**/*.ts`,
      "--strict",
      "--allowJs",
      "--target",
      "ESNext",
      "--noErrorTruncation",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--downlevelIteration",
      "--jsx",
      "preserve",
    ],
    {
      shell: true,
    },
  );
}

export function applyAllLocalGenerate(app) {
  app.extend(storeStructure);

  applyBenchStructure(app);
  applyTestingValidatorsStructure(app);
  applyTestingServerStructure(app);
  applyTestingSqlStructure(app);
}
