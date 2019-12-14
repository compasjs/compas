import { Logger } from "@lightbase/insight";
import { isNil, merge } from "@lightbase/stdlib";
import { join } from "path";

let loadedConfig: any = {};

/**
 * Load base config and config for the current environment in.
 */
export function initConfig(logger: Logger) {
  const env = (process.env.NODE_ENV || "development").toLowerCase();

  loadFile(logger, join(process.cwd(), "src", "config", "config"));
  loadFile(logger, join(process.cwd(), "src", "config", `config.${env}`));
}

function loadFile(logger: Logger, path: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const conf = require(path);
    const thisConf = conf.default || conf.config || conf;
    loadedConfig = merge(loadedConfig, thisConf);
  } catch (e) {
    logger.error(`Could not load ${path}`, e);
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
