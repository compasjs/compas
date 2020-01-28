import { isNil } from "@lbu/stdlib";
import { logger } from "../logger";
import { upperCaseFirst } from "../util";
import { RouteBuilder, RouteBuilderDelegate } from "./RouteBuilder";
import {
  AppSchema,
  HttpMethod,
  RouteSchema,
  ValidatorSchema,
  ValidatorLikeSchema,
} from "./types";
import { validatorLikeToValidator } from "./util";

export class FluentApp {
  private validatorStore: { [k: string]: ValidatorLikeSchema } = {};
  private routeStore: { [k: string]: RouteBuilder } = {};

  constructor(private name: string) {}

  validator(validator: ValidatorLikeSchema) {
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

  toSchema(): AppSchema {
    const validators: ValidatorSchema[] = [];
    const routes: RouteSchema[] = [];

    for (const key in this.validatorStore) {
      validators.push(validatorLikeToValidator(this.validatorStore[key]));
    }

    for (const key in this.routeStore) {
      routes.push(this.routeStore[key].toSchema());
    }

    return {
      name: this.name,
      validators,
      routes,
    };
  }

  private addRoute(name: string, method: HttpMethod): RouteBuilder {
    if (!isNil(this.routeStore[name])) {
      logger.info(`Overwriting ${method} ${name}`);
    }

    const r = new RouteBuilder(name, method);
    this.routeStore[name] = r;

    return r;
  }
}
