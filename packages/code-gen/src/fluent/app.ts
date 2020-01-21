import { isNil } from "@lbu/stdlib";
import { join } from "path";
import { generateForAppSchema } from "../generate";
import { logger } from "../logger";
import { Validator, ValidatorLike } from "../types";
import { HttpMethod, Route } from "../types/router";
import { upperCaseFirst } from "../util";
import { validatorLikeToValidator } from "../validator";
import { RouteBuilder, RouteBuilderDelegate } from "./RouteBuilder";

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
  private routeStore: { [k: string]: RouteBuilder } = {};

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

  get(name: string) {
    return this.addRoute(name, "GET");
  }

  post(name: string) {
    return this.addRoute(name, "POST");
  }

  put(name: string) {
    return this.addRoute(name, "PUT");
  }

  delete(name: string) {
    return this.addRoute(name, "DELETE");
  }

  head(name: string) {
    return this.addRoute(name, "HEAD");
  }

  all(name: string) {
    const routes = (["GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map(
      it => {
        const routeName = `${it.toLowerCase()}${upperCaseFirst(name)}`;
        return this.addRoute(routeName, it);
      },
    );

    return new RouteBuilderDelegate(routes);
  }

  build(outputDir: string) {
    generateForAppSchema(outputDir, this.toSchema());
  }

  printSchema() {
    logger.info(this.toSchema());
  }

  private addRoute(name: string, method: HttpMethod): RouteBuilder {
    if (!isNil(this.routeStore[name])) {
      logger.info(`Overwriting ${method} ${name}`);
    }

    const r = new RouteBuilder(name, method);
    this.routeStore[name] = r;

    return r;
  }

  private toSchema() {
    const validators: { [k: string]: Validator } = {};
    for (const key in this.validatorStore) {
      validators[key] = validatorLikeToValidator(this.validatorStore[key]);
    }

    const routes: { [k: string]: Route } = {};
    for (const key in this.routeStore) {
      routes[key] = this.routeStore[key].toSchema();
    }

    return {
      name: this.name,
      validators,
      routes,
    };
  }
}
