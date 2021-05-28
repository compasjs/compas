import { existsSync } from "fs";
import { pathToFileURL } from "url";
import { isNil, pathJoin } from "@compas/stdlib";
import {
  setEnforceSingleAssertion,
  setGlobalSetup,
  setGlobalTeardown,
  setTestTimeout,
} from "./state.js";

const configPath = pathJoin(process.cwd(), "test/config.js");

/**
 * Config loader if available.
 * Loads the following:
 * - timeout, used as timeout per test case
 * - setup, function called once before tests run
 * - teardown, function called once after all tests run
 *
 * @returns {Promise<void>}
 */
export async function loadTestConfig() {
  if (!existsSync(configPath)) {
    return;
  }

  const config = await import(pathToFileURL(configPath));

  if (config.timeout) {
    if (typeof config.timeout !== "number") {
      throw new TypeError(
        `test/config.js#timeout should be a number. Found ${typeof config.timeout}`,
      );
    }
    setTestTimeout(config.timeout);
  }

  if (!isNil(config?.enforceSingleAssertion)) {
    setEnforceSingleAssertion(config.enforceSingleAssertion);
  }

  setGlobalSetup(config?.setup);
  setGlobalTeardown(config?.teardown);
}
