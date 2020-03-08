import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { R } from "./RouteBuilder.js";

const store = new Set();

const init = app => {
  store.clear();
  app.hooks.addRoute = route => {
    if (!(route instanceof R.types.RouteBuilder)) {
      throw new Error("Store#addRoute is only accepting RouteBuilder");
    }

    store.add(route);

    if (!isNil(route.paramsValidator)) {
      app.callHook("addValidator", route.paramsValidator);
    }
    if (!isNil(route.queryValidator)) {
      app.callHook("addValidator", route.queryValidator);
    }
    if (!isNil(route.bodyValidator)) {
      app.callHook("addValidator", route.bodyValidator);
    }
    if (!isNil(route.responseModel)) {
      app.callHook("addModel", route.responseModel);
    }
  };
};

const getModelName = validator => {
  if (validator === undefined) {
    return undefined;
  }
  if (Object.keys(validator.item.keys).length === 0) {
    return undefined;
  }
  return upperCaseFirst(validator.item.name);
};

const registerCodegenRoute = () => {
  store.add(
    R("LbuStructure", "_lbu/structure.json")
      .get()
      .tags("_lbu")
      .docs("Return the full generated structure as a json object."),
  );
};

const build = result => {
  registerCodegenRoute();

  result.routes = [];
  const tags = new Set();

  for (const route of store.values()) {
    const r = route.build();

    // Set docs to empty string, for easier code-gen
    if (isNil(r.docs)) {
      r.docs = "";
    }

    if (isNil(r.tags)) {
      // Set tags to empty array, for easier code-gen
      r.tags = [];
    } else {
      for (const t of r.tags.values()) {
        tags.add(t);
      }
    }

    r.paramsValidator = getModelName(route.paramsValidator);
    r.queryValidator = getModelName(route.queryValidator);
    r.bodyValidator = getModelName(route.bodyValidator);
    r.responseModel = getModelName(route.responseModel);

    result.routes.push(r);
  }

  // unique route tags
  result.routeTags = [...tags];
};

export const plugin = {
  init,
  build,
};
