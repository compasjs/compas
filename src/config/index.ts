import { Logger } from "../insight";
import { register, Service } from "../service-locator";
import { isNil, merge } from "../stdlib";
import { join } from "path";

const loggerType = "CONFIG";
const logger = new Logger(3, { type: loggerType });

export const CONFIG = Symbol.for("config");

export class Config<T> extends Service<ConfigValue<T>> {
  init(): ConfigValue<T> {
    let result: any = {};
    const env = (process.env.NODE_ENV || "development").toLowerCase();

    // Normal config file
    result = merge(
      result,
      this.loadFile(join(process.cwd(), "src", "config", "config")),
    );

    // Env specific config file
    result = merge(
      result,
      this.loadFile(join(process.cwd(), "src", "config", `config.${env}`)),
    );

    return new ConfigValue<T>(result);
  }

  dispose(): void {
    return;
  }

  private loadFile(path: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const conf = require(path);
      return conf.default || conf.config || conf;
    } catch (e) {
      logger.error(`Could not load ${path}`);
      return {};
    }
  }
}

class ConfigValue<T> {
  constructor(private value: T) {}

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
  getConfigValue<R = unknown>(key: string, defaultValue?: R): R {
    const keyParts = key.split(".");
    let root: any = this.value;
    for (const part of keyParts) {
      root = root[part];
      if (isNil(root)) {
        return defaultValue!;
      }
    }

    return root;
  }
}

register(CONFIG, new Config());
