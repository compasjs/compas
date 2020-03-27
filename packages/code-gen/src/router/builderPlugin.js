import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { R } from "./RouteBuilder.js";

const store = new Set();

const init = (app) => {
  store.clear();
  app.hooks.addRoute = (route) => {
    if (!(route instanceof R.types.RouteBuilder)) {
      throw new Error("Store#addRoute is only accepting RouteBuilder");
    }

    store.add(route);
  };
};

const process = (app) => {
  // Validators / response can still be swapped out if wanted, so only finalize when no
  // user code is running

  for (const route of store.values()) {
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
  }
};

const getModelName = (validator) => {
  if (validator === undefined || validator.item === undefined) {
    return undefined;
  }

  return upperCaseFirst(validator.item.name);
};

const registerLbuRoutes = () => {
  const group = R.group("LBU", "_lbu/");
  const tags = ["_lbu"];

  store.add(
    group
      .get("structure.json", "lbuStructure")
      .tags(...tags)
      .docs("Return the full generated structure as a json object."),
  );
};

const build = (result) => {
  registerLbuRoutes();

  result.routes = {};
  const tags = new Set();

  for (const route of store.values()) {
    const r = route.build();

    for (const t of r.tags.values()) {
      tags.add(t);
    }
    result.routes[r.group] = result.routes[r.group] || [];

    r.paramsValidator = getModelName(route.paramsValidator);
    r.queryValidator = getModelName(route.queryValidator);
    r.bodyValidator = getModelName(route.bodyValidator);
    r.responseModel = getModelName(route.responseModel);

    result.routes[r.group].push(r);
  }

  // unique route tags
  result.routeTags = [...tags];
};

export const plugin = {
  init,
  process,
  build,
};
