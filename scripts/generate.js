import { rmdir } from "fs/promises";
import { App } from "@compas/code-gen";
import { mainFn, pathJoin, spawn } from "@compas/stdlib";
import {
  applyBenchStructure,
  applyTestingServerStructure,
  applyTestingSqlStructure,
  applyTestingValidatorsStructure,
} from "../gen/testing.js";

mainFn(import.meta, main);

/** @type {CliWatchOptions} */
export const cliWatchOptions = {
  ignoredPatterns: ["generated"],
  extensions: ["tmpl", "js", "json"],
};

async function main() {
  const app = new App({
    verbose: true,
  });

  app.logger.info("Cleanup previous output");
  await rmdir("./generated/testing/", { recursive: true });

  applyAllLocalGenerate(app);

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
      `${pathJoin(process.cwd(), "./generated/testing/client")}/*.ts`,
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
  applyBenchStructure(app);
  applyTestingValidatorsStructure(app);
  applyTestingServerStructure(app);
  applyTestingSqlStructure(app);
}

export const generateSettings = {
  validators: {
    outputDirectory: "./generated/testing/validators",
    enabledGroups: ["validator"],
    isNode: true,
  },
  bench: {
    outputDirectory: "./generated/testing/bench",
    enabledGroups: ["bench"],
    isNodeServer: true,
    enabledGenerators: ["validator"],
  },
  server: {
    outputDirectory: "./generated/testing/server",
    enabledGenerators: ["type", "apiClient", "router", "validator"],
    enabledGroups: ["server"],
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
