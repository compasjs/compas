import {
  dirnameForModule,
  pathJoin,
  processDirectoryRecursive,
} from "@compas/stdlib";
import { loadTestConfig } from "./config.js";
import { printTestResults } from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import {
  globalSetup,
  globalTeardown,
  ignoreDirectories,
  state,
  testLogger,
} from "./state.js";

export const workerFile = new URL(
  `file://${pathJoin(dirnameForModule(import.meta), "./worker-thread.js")}`,
);

/**
 * List available test files
 *
 * @returns {Promise<string[]>}
 */
export async function listTestFiles() {
  const files = [];
  await processDirectoryRecursive(process.cwd(), (file) => {
    if (file === workerFile.pathname) {
      return;
    }

    if (!file.endsWith(".test.js")) {
      return;
    }

    for (const dir of ignoreDirectories) {
      if (file.startsWith(dir)) {
        return;
      }
    }

    files.push(file);
  });

  return files;
}

/**
 * @param {{
 *   singleFileMode: boolean
 * }} [options]
 * @returns {Promise<number>}
 */
export async function runTestsInProcess(options) {
  await loadTestConfig();
  const files = await listTestFiles();

  if (!options?.singleFileMode && Array.isArray(files)) {
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
  await globalSetup();
  await runTestsRecursively(state);
  testLogger.info(`Running: teardown`);
  await globalTeardown();

  return printTestResults();
}
