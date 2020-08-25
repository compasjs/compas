import { existsSync } from "fs";
import { pathJoin } from "@lbu/stdlib";
import { setTestTimeout } from "./state.js";

const configPath = pathJoin(process.cwd(), "test/config.js");

/**
 * Config loader if available.
 * Loads the following:
 * - timeout, used as timeout per test case
 * @returns {Promise<void>}
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
}
