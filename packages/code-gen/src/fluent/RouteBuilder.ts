import { AbstractRoute, AbstractTree } from "../types";
import { upperCaseFirst } from "../util";
import { NamedTypeBuilder } from "./TypeBuilder";

export class RouteBuilder {
  private result: AbstractRoute = {
    name: this.name,
    method: this.method,
    path: "",
  };

  constructor(
    private tree: AbstractTree,
    private name: string,
    private method: AbstractRoute["method"],
  ) {
    for (const r of this.tree.abstractRoutes) {
      if (r.name === this.name) {
        throw new Error("Make sure every route has a unique name");
      }
    }

    this.tree.abstractRoutes.push(this.result);
  }

  path(path: string) {
    this.result.path = path;

    if (this.result.path.startsWith("/")) {
      this.result.path = this.result.path.substring(1);
    }
    if (this.result.path.endsWith("/")) {
      this.result.path = this.result.path.substring(
        0,
        this.result.path.length - 2,
      );
    }

    return this;
  }

  query(cb: (T: NamedTypeBuilder) => void) {
    const name = `QuerySchema${upperCaseFirst(this.name)}`;
    this.result.queryValidator = name;

    const builder = new NamedTypeBuilder(this.tree, name);
    cb(builder.enableValidator());

    return this;
  }

  params(cb: (T: NamedTypeBuilder) => void) {
    const name = `ParamsSchema${upperCaseFirst(this.name)}`;
    this.result.paramsValidator = name;

    const builder = new NamedTypeBuilder(this.tree, name);
    cb(builder.enableValidator());

    return this;
  }

  body(cb: (T: NamedTypeBuilder) => void) {
    const name = `BodySchema${upperCaseFirst(this.name)}`;
    this.result.bodyValidator = name;

    const builder = new NamedTypeBuilder(this.tree, name);
    cb(builder.enableValidator());

    return this;
  }

  response(cb: (T: NamedTypeBuilder) => void) {
    const name = `${upperCaseFirst(this.name)}Response`;
    this.result.response = name;

    const builder = new NamedTypeBuilder(this.tree, name);
    cb(builder);

    return this;
  }

  finalize() {
    if (this.result.path === "") {
      throw new Error("Make sure to call this.path() with a valid path");
    }

    // May be a bit of a hacky place to do this but should be fine for now.
    const handlerType = new NamedTypeBuilder(this.tree, `${this.name}Handler`);
    const obj: any = {};
    if (this.result.paramsValidator) {
      obj.validatedParams = handlerType.ref().type(this.result.paramsValidator);
    }
    if (this.result.queryValidator) {
      obj.validatedQuery = handlerType.ref().type(this.result.queryValidator);
    }
    if (this.result.bodyValidator) {
      obj.validatedBody = handlerType.ref().type(this.result.bodyValidator);
    }

    handlerType.set(handlerType.object().keys(obj));
  }
}
