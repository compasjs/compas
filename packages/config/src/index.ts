import { Logger } from "@lightbase/insight";
import { isNil } from "@lightbase/stdlib";
import { join } from "path";

let loadedConfig: any = {};

export function initConfig(logger: Logger) {
  try {
    const env = (process.env.NODE_ENV || "development").toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(join(
      process.cwd(),
      "src",
      "config",
      `config.${env}`,
    ));
    loadedConfig = config.default || config.config || config;
  } catch {
    logger.error("No config files present");
  }
}

/**
 * Try to get the value at key or return the default value.
 * Supports nested keys like `foo.bar` but not array indices
 *
 * @example
 * loadedConfig = { foo: 2, bar: {baz: "hi" }};
 * getConfigValue("foo"); // 2
 * getConfigValue("bar.baz"); // hi
 * getConfigValue("nope"): // undefined
 * getConfigValue("nope", true): // true
 */
export function getConfigValue<T = unknown>(key: string, defaultValue?: T): T {
  const keyParts = key.split(".");
  let root = loadedConfig;
  for (const part of keyParts) {
    root = root[part];
    if (isNil(root)) {
      return defaultValue!;
    }
  }

  return root;
}
