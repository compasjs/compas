import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  isNil,
} from "@lbu/stdlib";
import { join } from "path";
import { getInternalRoutes } from "./internalRoutes.js";
import { buildTrie } from "./trie.js";
import { RouteBuilder, routeType } from "./type.js";

const store = new Set();

/**
 * @param {App} app
 * @return {Promise<void>}
 */
export async function registerTypes(app) {
  app.types.push(routeType);
}

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
      if (!(r instanceof RouteBuilder)) {
        throw new Error("Store#route is only accepting RouteBuilder");
      }

      store.add(r);
      app.model(r);
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
    if (!isNil(route.queryBuilder)) {
      app.validator(route.queryBuilder);
    }
    if (!isNil(route.paramsBuilder)) {
      app.validator(route.paramsBuilder);
    }
    if (!isNil(route.bodyBuilder)) {
      app.validator(route.bodyBuilder);
    }
    if (!isNil(route.responseBuilder)) {
      app.validator(route.responseBuilder);
    }
  }
}

/**
 * @param {App} app
 * @param {object} result
 * @return {Promise<void>}
 */
export async function dumpStore(app, result) {
  const routes = new Set();
  const tags = new Set();

  for (const route of store) {
    const r = route.build();

    for (const t of r.tags) {
      tags.add(t);
    }

    routes.add(r.uniqueName);
  }

  result.routeTags = [...tags];
  result.routes = [...routes];
}

/**
 * @param {App} app
 * @param {object} data
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data) {
  data.stringified = JSON.stringify(data);
  data.routeTrie = buildTrie(data.models, data.routes);

  return {
    path: "./router.js",
    source: executeTemplate(app.templateContext, "routerFile", {
      ...data,
      opts: app.options,
    }),
  };
}
