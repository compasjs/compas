import { existsSync } from "fs";
import { pathToFileURL } from "url";
import {
  environment,
  loggerGetGlobalDestination,
  loggerSetGlobalDestination,
  pathJoin,
} from "@compas/stdlib";
import {
  ignoreDirectories,
  setGlobalSetup,
  setGlobalTeardown,
  setTestTimeout,
} from "./state.js";

const configPath = pathJoin(process.cwd(), "test/config.js");

/**
 * Config loader if available.
 * Loads the following:
 * - timeout, used as timeout per test case
 * - ignored directories
 * - setup, function called once before tests run
 * - teardown, function called once after all tests run
 *
 * @returns {Promise<void>}
 */
export async function loadTestConfig() {
  if (!existsSync(configPath)) {
    return;
  }

  if (environment._COMPAS_TEST_WITH_LOGS === "false") {
    const destination = loggerGetGlobalDestination();
    loggerSetGlobalDestination({
      write(msg) {
        if (msg.includes(` error[`) || msg.includes(`"level":"error"`)) {
          destination.write(msg);
        }
      },
    });
  }

  // @ts-ignore
  const config = await import(pathToFileURL(configPath));

  if (config.timeout) {
    if (typeof config.timeout !== "number") {
      throw new TypeError(
        `test/config.js#timeout should be a number. Found ${typeof config.timeout}`,
      );
    }
    setTestTimeout(config.timeout);
  }

  if (Array.isArray(config.ignoreDirectories)) {
    for (const dir of config.ignoreDirectories) {
      if (dir.startsWith("/")) {
        ignoreDirectories.push(dir);
      } else {
        ignoreDirectories.push(pathJoin(process.cwd(), dir));
      }
    }
  }

  setGlobalSetup(config?.setup);
  setGlobalTeardown(config?.teardown);
}
