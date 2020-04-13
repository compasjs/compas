import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { upperCaseFirst } from "../../utils.js";
import { getInternalRoutes } from "./internalRoutes.js";
import { R } from "./RouteBuilder.js";
import { buildTrie } from "./trie.js";

const store = new Set();

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function init(app) {
  if (!app.generators.has("validator")) {
    throw new Error("router depends on validators");
  }

  store.clear();

  await compileTemplateDirectory(
    app.templateContext,

    join(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  /**
   * @name App#route
   * @function
   * @param {...RouteBuilder} routes
   * @return {App}
   */
  app.constructor.prototype.route = function (...routes) {
    for (const r of routes) {
      if (!(r instanceof R.types.RouteBuilder)) {
        throw new Error("Store#route is only accepting RouteBuilder");
      }

      store.add(r);
    }

    return this;
  };
}

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function preProcessStore(app) {
  app.route(...getInternalRoutes());

  for (const route of store) {
    if (!isNil(route.paramsValidator)) {
      app.validator(route.paramsValidator);
    }
    if (!isNil(route.queryValidator)) {
      app.validator(route.queryValidator);
    }
    if (!isNil(route.bodyValidator)) {
      app.validator(route.bodyValidator);
    }
    if (!isNil(route.responseModel)) {
      app.validator(route.responseModel);
    }
  }
}

/**
 * @param {App} app
 * @param {object} result
 * @param {...object} extendsFrom
 * @return {Promise<void>}
 */
export async function dumpStore(app, result, ...extendsFrom) {
  result.routes = [];
  const tags = new Set();
  const groups = new Set();

  for (const extender of extendsFrom) {
    for (const tag of extender.routeTags || []) {
      tags.add(tag);
    }
    for (const group of extender.routeGroups || []) {
      groups.add(group);
    }
    for (const r of extender.routes || []) {
      if (r.group === "lbu" && r.name === "structure") {
        continue;
      }
      result.routes.push(r);
    }
    result.routes.push(...(extender.routes || []));
  }

  for (const route of store) {
    const r = route.build();

    for (const t of r.tags) {
      tags.add(t);
    }
    groups.add(r.group);

    r.paramsValidator = getModelName(route.paramsValidator);
    r.queryValidator = getModelName(route.queryValidator);
    r.bodyValidator = getModelName(route.bodyValidator);
    r.responseModel = getModelName(route.responseModel);

    result.routes.push(r);
  }

  // unique route tags
  result.routeTags = [...tags];
  result.routeGroups = [...groups];
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  data.stringified = JSON.stringify(data);
  data.routeTrie = buildTrie(data.routes);

  return {
    path: "./router.js",
    source: executeTemplate(app.templateContext, "routerFile", {
      ...data,
      opts: app.options,
    }),
  };
}

function getModelName(validator) {
  if (validator === undefined || validator.item === undefined) {
    return undefined;
  }

  return upperCaseFirst(validator.item.name);
}
