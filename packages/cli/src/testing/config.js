import { existsSync } from "fs";
import { noop, pathJoin } from "@lbu/stdlib";
import { setTestTimeout } from "./state.js";

const configPath = pathJoin(process.cwd(), "test/config.js");

/**
 * Config loader if available.
 * Loads the following:
 * - timeout, used as timeout per test case
 * - setup, function called once before tests run
 * - teardown, function called once after all tests run
 * @returns {Promise<{
 *    setup: function(): (void|Promise<void>)
 *    teardown: function(): (void|Promise<void>)
 * }>}
 */
export async function loadTestConfig() {
  if (!existsSync(configPath)) {
    return;
  }

  const config = await import(configPath);

  if (config.timeout) {
    if (typeof config.timeout !== "number") {
      throw new TypeError(
        `test/config.js#timeout should be a number. Found ${typeof config.timeout}`,
      );
    }
    setTestTimeout(config.timeout);
  }

  return {
    setup: config?.setup ?? noop,
    teardown: config?.teardown ?? noop,
  };
}
