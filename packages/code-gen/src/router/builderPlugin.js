import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { R } from "./RouteBuilder.js";
import { buildTrie } from "./trie.js";

const store = new Set();

const init = app => {
  store.clear();
  app.hooks.addRoute = route => {
    if (!(route instanceof R.types.RouteBuilder)) {
      throw new Error("Store#addRoute is only accepting RouteBuilder");
    }

    store.add(route);

    if (!isNil(route.paramsValidator)) {
      app.callHook("addValidator", true, route.paramsValidator);
    }
    if (!isNil(route.queryValidator)) {
      app.callHook("addValidator", true, route.queryValidator);
    }
    if (!isNil(route.bodyValidator)) {
      app.callHook("addValidator", true, route.bodyValidator);
    }
    if (!isNil(route.responseModel)) {
      app.callHook("addValidator", true, route.responseModel);
    }
  };
};

const buildLinkedValidator = validator => {
  if (validator === undefined) {
    return undefined;
  }
  const typeName = upperCaseFirst(validator.item.name);
  return {
    typeName,
    funcName: `validate${typeName}`,
  };
};

const build = result => {
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

    r.paramsValidator = buildLinkedValidator(route.paramsValidator);
    r.queryValidator = buildLinkedValidator(route.queryValidator);
    r.bodyValidator = buildLinkedValidator(route.bodyValidator);
    r.responseModel = buildLinkedValidator(route.responseModel);

    result.routes.push(r);
  }

  result.routeTrie = buildTrie(result.routes);
  // unique route tags
  result.routeTags = [...tags];
};

export const plugin = {
  init,
  build,
};
