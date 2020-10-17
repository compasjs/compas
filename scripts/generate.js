import { rmdir } from "fs/promises";
import { App } from "@lbu/code-gen";
import { mainFn, pathJoin, spawn } from "@lbu/stdlib";
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
  const app = await App.new({
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
      "--target",
      "ESNext",
      "--noErrorTruncation",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--downlevelIteration",
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
    enabledGenerators: ["apiClient", "type", "validator"],
    isBrowser: true,
  },
  sql: {
    outputDirectory: "./generated/testing/sql",
    enabledGroups: ["sql"],
    enabledGenerators: ["type", "sql"],
    isNodeServer: true,
  },
};
