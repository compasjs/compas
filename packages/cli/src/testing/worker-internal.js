import {
  dirnameForModule,
  pathJoin,
  processDirectoryRecursive,
} from "@compas/stdlib";
import { printTestResults } from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import { state, testLogger } from "./state.js";

export const workerFile = new URL(
  `file://${pathJoin(dirnameForModule(import.meta), "./worker-thread.js")}`,
);

/**
 * List available test files
 *
 * @property {import("./config.js").TestConfig} testConfig
 * @returns {Promise<string[]>}
 */
export async function testingListFiles(testConfig) {
  const files = [];
  await processDirectoryRecursive(process.cwd(), (file) => {
    if (file === workerFile.pathname) {
      return;
    }

    if (!file.endsWith(".test.js")) {
      return;
    }

    for (const dir of testConfig.ignoreDirectories) {
      if (file.startsWith(dir)) {
        return;
      }
    }

    files.push(file);
  });

  return files;
}

/**
 * @param {import("./config.js").TestConfig} testConfig
 * @returns {Promise<number>}
 */
export async function runTestsInProcess(testConfig) {
  const files = testConfig.singleFileMode
    ? []
    : await testingListFiles(testConfig);

  if (!testConfig.singleFileMode && Array.isArray(files)) {
    for (const file of files) {
      await import(file);
    }
  } else {
    // Used when `mainTestFn` is called the first thing of the process,
    // which results in no tests registered yet
    await new Promise((r) => {
      setTimeout(r, 2);
    });
  }

  testLogger.info(`Running: setup`);
  await testConfig.setup();
  await runTestsRecursively(testConfig, state);
  testLogger.info(`Running: teardown`);
  await testConfig.teardown();

  return printTestResults();
}
