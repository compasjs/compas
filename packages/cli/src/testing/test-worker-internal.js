import { loadTestConfig } from "./config.js";
import { printTestResults } from "./printer.js";
import { runTestsRecursively } from "./runner.js";
import { globalSetup, globalTeardown, state } from "./state.js";

/**
 *
 * @param {{
 *   files?: string[],
 * }} options
 * @returns {Promise<number>}
 */
export async function runTestsInProcess({ files }) {
  if (Array.isArray(files)) {
    for (const f of files) {
      await import(f);
    }
  } else {
    // Used when `mainTestFn` is called the first thing of the process,
    // which results in no tests registered yet
    await new Promise((r) => {
      setTimeout(r, 2);
    });
  }

  await loadTestConfig();
  await globalSetup();
  await runTestsRecursively(state);
  await globalTeardown();

  return printTestResults();
}
