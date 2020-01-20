import { isNil } from "@lbu/stdlib";
import { join } from "path";
import { generateForAppSchema } from "../generate";
import { logger } from "../logger";
import { Validator, ValidatorLike } from "../types";
import { validatorLikeToValidator } from "../validator";

/**
 * Initialize the Fluent API
 * Requires the generate process to run in the root of the project
 */
export function createApp() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { name } = require(join(process.cwd(), "package.json"));
  return new FluentApp(name);
}

class FluentApp {
  private validatorStore: { [k: string]: ValidatorLike } = {};

  constructor(private name: string) {}

  validator(validator: ValidatorLike) {
    const name = validatorLikeToValidator(validator).name;
    if (!name) {
      throw new TypeError("Schema should have a name specified");
    }

    if (!isNil(this.validatorStore[name])) {
      logger.info(`Overwriting ${name}`);
    }
    this.validatorStore[name] = validator;

    return this;
  }

  build(outputDir: string) {
    generateForAppSchema(outputDir, this.toJson());
  }

  printSchema() {
    logger.info(this.toJson());
  }

  private toJson() {
    const validators: { [k: string]: Validator } = {};

    for (const key in this.validatorStore) {
      validators[key] = validatorLikeToValidator(this.validatorStore[key]);
    }

    return {
      name: this.name,
      validators,
    };
  }
}
