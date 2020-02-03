import { AbstractRoute, AbstractTree } from "../types";
import { RouteBuilder } from "./RouteBuilder";
import { NamedTypeBuilder } from "./TypeBuilder";

export class FluentApi {
  private store: AbstractTree = {
    name: this.name,
    abstractRoutes: [],
    types: {},
  };

  constructor(private name: string) {}

  type(name: string, cb: (T: NamedTypeBuilder) => void) {
    const builder = new NamedTypeBuilder(this.store, name);
    cb(builder);
  }

  model(name: string, cb: (T: NamedTypeBuilder) => void) {
    this.type(name, T => cb(T.enableModel()));
  }

  validator(name: string, cb: (T: NamedTypeBuilder) => void) {
    this.type(name, T => cb(T.enableValidator()));
  }

  get(name: string, cb: (R: RouteBuilder) => void) {
    this.route(name, "GET", cb);
  }

  post(name: string, cb: (R: RouteBuilder) => void) {
    this.route(name, "POST", cb);
  }

  put(name: string, cb: (R: RouteBuilder) => void) {
    this.route(name, "PUT", cb);
  }

  delete(name: string, cb: (R: RouteBuilder) => void) {
    this.route(name, "DELETE", cb);
  }

  head(name: string, cb: (R: RouteBuilder) => void) {
    this.route(name, "HEAD", cb);
  }

  getTree(): AbstractTree {
    return this.store;
  }

  private route(
    name: string,
    method: AbstractRoute["method"],
    cb: (R: RouteBuilder) => void,
  ) {
    const builder = new RouteBuilder(this.store, name, method);
    cb(builder);
    builder.finalize();
  }
}

const api = new FluentApi("foo");
api.type("Foo", T => {
  T.enableModel()
    .enableValidator()
    .set(
      T.string()
        .comparable()
        .convert()
        .min(5),
    );
  T.set(
    T.number()
      .comparable()
      .integer()
      .optional()
      .convert(),
  );
  T.set(
    T.object().keys({
      foo: T.number(),
    }),
  );
});
